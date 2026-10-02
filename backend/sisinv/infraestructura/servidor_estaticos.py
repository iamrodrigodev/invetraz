"""Manejador de archivos estáticos y resolución de rutas de SPA (React).
Permite servir la SPA en el mismo puerto que la API FastAPI, idéntico a Apache Superset.
"""

import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sisinv.config import get_settings


def configurar_servidor_estaticos(app: FastAPI) -> None:
    settings = get_settings()

    posibles_rutas_estaticas = [
        Path(settings.static_dir),
        Path("/app/frontend/dist"),
        Path("frontend/dist"),
        Path("../frontend/dist"),
        Path("app/static"),
        Path("static"),
    ]

    directorio_estatico: Path | None = None
    for ruta in posibles_rutas_estaticas:
        if (ruta / "index.html").is_file():
            directorio_estatico = ruta.resolve()
            break

    # Endpoint de compatibilidad Actuator para healthchecks
    @app.get("/actuator/health", include_in_schema=False)
    @app.get("/actuator/health/liveness", include_in_schema=False)
    @app.get("/actuator/health/readiness", include_in_schema=False)
    def actuator_health():
        return {"status": "UP"}

    if directorio_estatico:
        carpeta_assets = directorio_estatico / "assets"
        if carpeta_assets.is_dir():
            app.mount("/assets", StaticFiles(directory=str(carpeta_assets)), name="assets")

        @app.get("/{ruta_completa:path}", include_in_schema=False)
        async def fallback_spa(request: Request, ruta_completa: str):
            # Nunca servir index.html para rutas de API o Actuator
            if ruta_completa.startswith("api/") or ruta_completa.startswith("actuator/"):
                return JSONResponse(
                    status_code=404,
                    content={"estado": 404, "mensaje": "Recurso no encontrado", "ruta": f"/{ruta_completa}"},
                )

            archivo_especifico = directorio_estatico / ruta_completa
            if archivo_especifico.is_file():
                return FileResponse(archivo_especifico)

            # Para cualquier otra ruta de navegación del cliente (React Router), servir index.html
            archivo_index = directorio_estatico / "index.html"
            return FileResponse(archivo_index)

    else:
        # Modo API pura (cuando no se ha compilado el frontend aún)
        @app.get("/", include_in_schema=False)
        def redirigir_a_estado():
            return RedirectResponse(url="/api/v1/estado")
