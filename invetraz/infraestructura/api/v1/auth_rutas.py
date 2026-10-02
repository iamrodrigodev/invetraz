"""Rutas de Autenticación de Invetraz."""

from typing import Optional
from fastapi import APIRouter, Cookie, Depends, Header, Response
from invetraz.aplicacion.comandos.autenticacion import (
    ComandoCambiarPassword,
    ComandoLogin,
    ComandoVerificarPassword,
)
from invetraz.dominio.entidades.usuario import Usuario
from invetraz.infraestructura.api.dependencias import (
    IpClienteDep,
    RepoUsuariosDep,
    ServicioHashDep,
    ServicioJwtDep,
    ServicioLimitadorDep,
    UsuarioActualDep,
    obtener_repo_usuarios,
    obtener_servicio_jwt,
)
from invetraz.infraestructura.api.esquemas import (
    ApiRespuesta,
    CambiarPasswordPeticion,
    LoginPeticion,
    LoginRespuesta,
    VerificarAutenticacionRespuesta,
    VerificarPasswordPeticion,
)

enrutador = APIRouter(prefix="/auth", tags=["Autenticación"])


@enrutador.post("/login", response_model=ApiRespuesta[LoginRespuesta])
def login(
    peticion: LoginPeticion,
    respuesta_http: Response,
    ip_cliente: IpClienteDep,
    repo_usuarios: RepoUsuariosDep,
    servicio_hash: ServicioHashDep,
    servicio_jwt: ServicioJwtDep,
    limitador: ServicioLimitadorDep,
):
    comando = ComandoLogin(
        email=peticion.email,
        password=peticion.password,
        ip_cliente=ip_cliente,
        repo_usuarios=repo_usuarios,
        servicio_hash=servicio_hash,
        servicio_jwt=servicio_jwt,
        limitador=limitador,
    )
    resultado = comando.run()

    from invetraz.config import get_settings
    settings = get_settings()

    # Asignar cookie HTTP-Only 'jwt'
    respuesta_http.set_cookie(
        key="jwt",
        value=resultado.token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="none" if settings.cookie_secure else "lax",
        max_age=3600,
        path="/",
    )

    return ApiRespuesta.exitoso(
        mensaje="Inicio de sesión exitoso",
        datos=LoginRespuesta(email=resultado.email),
    )


@enrutador.post("/logout", response_model=ApiRespuesta[None])
def logout(respuesta_http: Response):
    respuesta_http.set_cookie(
        key="jwt",
        value="",
        httponly=True,
        secure=True,
        samesite="none",
        max_age=0,
        path="/",
    )
    return ApiRespuesta.exitoso(mensaje="Sesión cerrada correctamente")


@enrutador.get("/me", response_model=ApiRespuesta[VerificarAutenticacionRespuesta])
def verificar_me(
    jwt_cookie: Optional[str] = Cookie(None, alias="jwt"),
    authorization: Optional[str] = Header(None),
    servicio_jwt=Depends(obtener_servicio_jwt),
    repo_usuarios=Depends(obtener_repo_usuarios),
):
    token = None
    if jwt_cookie:
        token = jwt_cookie
    elif authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()

    if not token:
        return ApiRespuesta.exitoso(
            mensaje="No hay sesión activa",
            datos=VerificarAutenticacionRespuesta(autenticado=False, email=None),
        )

    payload = servicio_jwt.validar_y_obtener_payload(token)
    if not payload or not payload.get("sub"):
        return ApiRespuesta.exitoso(
            mensaje="Token expirado o inválido",
            datos=VerificarAutenticacionRespuesta(autenticado=False, email=None),
        )

    import uuid
    try:
        id_usuario = uuid.UUID(payload["sub"])
    except ValueError:
        return ApiRespuesta.exitoso(
            mensaje="Token inválido",
            datos=VerificarAutenticacionRespuesta(autenticado=False, email=None),
        )

    usuario = repo_usuarios.obtener_por_id(id_usuario)
    if not usuario:
        return ApiRespuesta.exitoso(
            mensaje="Usuario no encontrado",
            datos=VerificarAutenticacionRespuesta(autenticado=False, email=None),
        )

    return ApiRespuesta.exitoso(
        mensaje="Sesión activa",
        datos=VerificarAutenticacionRespuesta(autenticado=True, email=usuario.email),
    )


@enrutador.post("/verificar-password", response_model=ApiRespuesta[None])
def verificar_password(
    peticion: VerificarPasswordPeticion,
    usuario_actual: UsuarioActualDep,
    ip_cliente: IpClienteDep,
    repo_usuarios: RepoUsuariosDep,
    servicio_hash: ServicioHashDep,
    limitador: ServicioLimitadorDep,
):
    comando = ComandoVerificarPassword(
        id_usuario=usuario_actual.id,
        password=peticion.password,
        ip_cliente=ip_cliente,
        repo_usuarios=repo_usuarios,
        servicio_hash=servicio_hash,
        limitador=limitador,
    )
    comando.run()
    return ApiRespuesta.exitoso(mensaje="Contraseña correcta")


@enrutador.put("/cambiar-password", response_model=ApiRespuesta[None])
def cambiar_password(
    peticion: CambiarPasswordPeticion,
    usuario_actual: UsuarioActualDep,
    ip_cliente: IpClienteDep,
    repo_usuarios: RepoUsuariosDep,
    servicio_hash: ServicioHashDep,
    limitador: ServicioLimitadorDep,
):
    comando = ComandoCambiarPassword(
        id_usuario=usuario_actual.id,
        password_actual=peticion.passwordActual,
        password_nueva=peticion.passwordNueva,
        ip_cliente=ip_cliente,
        repo_usuarios=repo_usuarios,
        servicio_hash=servicio_hash,
        limitador=limitador,
    )
    comando.run()
    return ApiRespuesta.exitoso(mensaje="Contraseña actualizada exitosamente")
