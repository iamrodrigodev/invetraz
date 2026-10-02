"""Fábrica de Aplicación (create_app) para SisInv.
Inspirado en el patrón create_app de Apache Superset.
"""

from contextlib import asynccontextmanager
import time
import uuid
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sisinv.config import get_settings
from sisinv.dominio.excepciones.base import CodigosDeError, ExcepcionDominio
from sisinv.infraestructura.api.v1.enrutador_principal import enrutador_v1
from sisinv.infraestructura.servidor_estaticos import configurar_servidor_estaticos


@asynccontextmanager
async def ciclo_de_vida(app: FastAPI):
    # Inicialización al arrancar
    yield
    # Limpieza al detener


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Sistema de Investigación - SisInv",
        description="API REST modular y de código abierto para seguimiento con Google Classroom y Drive",
        version="1.0.0",
        lifespan=ciclo_de_vida,
    )

    # Middleware de Trace ID y Tiempo de Respuesta
    @app.middleware("http")
    async def middleware_rastreo(request: Request, call_next):
        id_rastreo = request.headers.get("x-trace-id", str(uuid.uuid4()))
        request.state.id_rastreo = id_rastreo
        inicio = time.time()
        response = await call_next(request)
        duracion_ms = (time.time() - inicio) * 1000
        response.headers["x-trace-id"] = id_rastreo
        response.headers["x-response-time"] = f"{duracion_ms:.2f}ms"
        return response

    # Configuración de CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Manejo de Excepciones de Dominio
    @app.exception_handler(ExcepcionDominio)
    async def manejador_excepcion_dominio(request: Request, exc: ExcepcionDominio):
        id_rastreo = getattr(request.state, "id_rastreo", None)
        return JSONResponse(
            status_code=exc.codigo_http,
            content={
                "estado": exc.codigo_http,
                "mensaje": exc.mensaje,
                "idRastreo": id_rastreo,
                "ruta": request.url.path,
                "errores": exc.detalle,
            },
        )

    # Manejo de Errores de Validación de Pydantic
    @app.exception_handler(RequestValidationError)
    async def manejador_error_validacion(request: Request, exc: RequestValidationError):
        id_rastreo = getattr(request.state, "id_rastreo", None)
        return JSONResponse(
            status_code=400,
            content={
                "estado": 400,
                "mensaje": CodigosDeError.DATOS_INVALIDOS.mensaje,
                "idRastreo": id_rastreo,
                "ruta": request.url.path,
                "errores": exc.errors(),
            },
        )

    # Manejo de Errores Internos Inesperados
    @app.exception_handler(Exception)
    async def manejador_error_general(request: Request, exc: Exception):
        id_rastreo = getattr(request.state, "id_rastreo", None)
        return JSONResponse(
            status_code=500,
            content={
                "estado": 500,
                "mensaje": CodigosDeError.ERROR_INTERNO.mensaje,
                "idRastreo": id_rastreo,
                "ruta": request.url.path,
                "errores": str(exc) if settings.debug else None,
            },
        )

    # Incluir enrutador de API v1
    app.include_router(enrutador_v1)

    # Configurar servidor de SPA y archivos estáticos
    configurar_servidor_estaticos(app)

    return app
