"""Inyección de dependencias para FastAPI."""

from typing import Annotated, Optional
import uuid
from fastapi import Cookie, Depends, Header, Request
from sqlalchemy.orm import Session
from inveli.config import get_settings
from inveli.dominio.entidades.usuario import Usuario
from inveli.dominio.excepciones.base import CodigosDeError, ExcepcionDominio
from inveli.infraestructura.base_de_datos.sesion import obtener_sesion_db
from inveli.infraestructura.base_de_datos.repositorios import (
    RepositorioActividadesSqlAlchemy,
    RepositorioConfiguracionSqlAlchemy,
    RepositorioUsuariosSqlAlchemy,
)
from inveli.infraestructura.seguridad import (
    AdaptadorCriptografiaAesGcm,
    AdaptadorHashPassword,
    AdaptadorLimitadorIntentos,
    AdaptadorTokenJwt,
)
from inveli.infraestructura.google import (
    AdaptadorGoogleClassroom,
    AdaptadorGoogleDrive,
    CacheClassroom,
)

_settings = get_settings()

# Singletons de seguridad e integraciones
_criptografia = AdaptadorCriptografiaAesGcm(_settings.app_master_key)
_jwt = AdaptadorTokenJwt(_settings.app_jwt_secret, _settings.jwt_expiration_seconds)
_hash_password = AdaptadorHashPassword()
_limitador = AdaptadorLimitadorIntentos()
_cache_classroom = CacheClassroom()
_google_classroom = AdaptadorGoogleClassroom(_cache_classroom)
_google_drive = AdaptadorGoogleDrive()


def obtener_servicio_criptografia() -> AdaptadorCriptografiaAesGcm:
    return _criptografia


def obtener_servicio_jwt() -> AdaptadorTokenJwt:
    return _jwt


def obtener_servicio_password() -> AdaptadorHashPassword:
    return _hash_password


def obtener_servicio_limitador() -> AdaptadorLimitadorIntentos:
    return _limitador


def obtener_servicio_classroom() -> AdaptadorGoogleClassroom:
    return _google_classroom


def obtener_servicio_drive() -> AdaptadorGoogleDrive:
    return _google_drive


def obtener_repo_usuarios(db: Session = Depends(obtener_sesion_db)) -> RepositorioUsuariosSqlAlchemy:
    return RepositorioUsuariosSqlAlchemy(db)


def obtener_repo_configuracion(
    db: Session = Depends(obtener_sesion_db),
    crypto: AdaptadorCriptografiaAesGcm = Depends(obtener_servicio_criptografia),
) -> RepositorioConfiguracionSqlAlchemy:
    return RepositorioConfiguracionSqlAlchemy(db, crypto)


def obtener_repo_actividades(db: Session = Depends(obtener_sesion_db)) -> RepositorioActividadesSqlAlchemy:
    return RepositorioActividadesSqlAlchemy(db)


def obtener_ip_cliente(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


def obtener_usuario_actual(
    jwt_cookie: Optional[str] = Cookie(None, alias="jwt"),
    authorization: Optional[str] = Header(None),
    servicio_jwt: AdaptadorTokenJwt = Depends(obtener_servicio_jwt),
    repo_usuarios: RepositorioUsuariosSqlAlchemy = Depends(obtener_repo_usuarios),
) -> Usuario:
    """Extrae y valida el JWT de la cookie 'jwt' o la cabecera 'Authorization: Bearer'."""
    token = None
    if jwt_cookie:
        token = jwt_cookie
    elif authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()

    if not token:
        raise ExcepcionDominio(CodigosDeError.CREDENCIALES_INVALIDAS)

    payload = servicio_jwt.validar_y_obtener_payload(token)
    if not payload or not payload.get("sub"):
        raise ExcepcionDominio(CodigosDeError.CREDENCIALES_INVALIDAS)

    try:
        id_usuario = uuid.UUID(payload["sub"])
    except ValueError:
        raise ExcepcionDominio(CodigosDeError.CREDENCIALES_INVALIDAS)

    usuario = repo_usuarios.obtener_por_id(id_usuario)
    if not usuario:
        raise ExcepcionDominio(CodigosDeError.CREDENCIALES_INVALIDAS)

    return usuario


# Type aliases para Annotated dependencies
SesionDB = Annotated[Session, Depends(obtener_sesion_db)]
RepoUsuariosDep = Annotated[RepositorioUsuariosSqlAlchemy, Depends(obtener_repo_usuarios)]
RepoConfigDep = Annotated[RepositorioConfiguracionSqlAlchemy, Depends(obtener_repo_configuracion)]
RepoActividadesDep = Annotated[RepositorioActividadesSqlAlchemy, Depends(obtener_repo_actividades)]
ServicioHashDep = Annotated[AdaptadorHashPassword, Depends(obtener_servicio_password)]
ServicioJwtDep = Annotated[AdaptadorTokenJwt, Depends(obtener_servicio_jwt)]
ServicioLimitadorDep = Annotated[AdaptadorLimitadorIntentos, Depends(obtener_servicio_limitador)]
ServicioClassroomDep = Annotated[AdaptadorGoogleClassroom, Depends(obtener_servicio_classroom)]
ServicioDriveDep = Annotated[AdaptadorGoogleDrive, Depends(obtener_servicio_drive)]
IpClienteDep = Annotated[str, Depends(obtener_ip_cliente)]
UsuarioActualDep = Annotated[Usuario, Depends(obtener_usuario_actual)]
