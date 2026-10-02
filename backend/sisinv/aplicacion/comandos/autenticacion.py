"""Comandos de autenticación y gestión de credenciales de usuario."""

from dataclasses import dataclass
import uuid
from sisinv.aplicacion.comandos.base import ComandoBase
from sisinv.aplicacion.puertos.repositorios import PuertoRepositorioUsuarios
from sisinv.aplicacion.puertos.seguridad import (
    PuertoHashPassword,
    PuertoLimitadorIntentos,
    PuertoTokenJwt,
)
from sisinv.dominio.excepciones.base import CodigosDeError, ExcepcionDominio


@dataclass
class ResultadoLogin:
    token: str
    email: str


class ComandoLogin(ComandoBase[ResultadoLogin]):
    def __init__(
        self,
        email: str,
        password: str,
        ip_cliente: str,
        repo_usuarios: PuertoRepositorioUsuarios,
        servicio_hash: PuertoHashPassword,
        servicio_jwt: PuertoTokenJwt,
        limitador: PuertoLimitadorIntentos,
    ):
        self.email = email.strip().lower()
        self.password = password
        self.ip_cliente = ip_cliente
        self.repo_usuarios = repo_usuarios
        self.servicio_hash = servicio_hash
        self.servicio_jwt = servicio_jwt
        self.limitador = limitador

    def ejecutar(self) -> ResultadoLogin:
        clave_bloqueo = f"login:{self.ip_cliente}:{self.email}"
        self.limitador.comprobar_bloqueo(clave_bloqueo)

        usuario = self.repo_usuarios.obtener_por_email(self.email)
        if not usuario or not self.servicio_hash.verificar(self.password, usuario.password):
            self.limitador.registrar_fallo(clave_bloqueo, max_intentos=5, ventana_segundos=60)
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_INVALIDAS)

        self.limitador.limpiar_intentos(clave_bloqueo)
        token = self.servicio_jwt.generar_token(usuario.id, rol="ADMIN")
        return ResultadoLogin(token=token, email=usuario.email)


class ComandoVerificarPassword(ComandoBase[None]):
    def __init__(
        self,
        id_usuario: uuid.UUID,
        password: str,
        ip_cliente: str,
        repo_usuarios: PuertoRepositorioUsuarios,
        servicio_hash: PuertoHashPassword,
        limitador: PuertoLimitadorIntentos,
    ):
        self.id_usuario = id_usuario
        self.password = password
        self.ip_cliente = ip_cliente
        self.repo_usuarios = repo_usuarios
        self.servicio_hash = servicio_hash
        self.limitador = limitador

    def ejecutar(self) -> None:
        clave_bloqueo = f"verificar_pass:{self.id_usuario}:{self.ip_cliente}"
        self.limitador.comprobar_bloqueo(clave_bloqueo)

        usuario = self.repo_usuarios.obtener_por_id(self.id_usuario)
        if not usuario or not self.servicio_hash.verificar(self.password, usuario.password):
            self.limitador.registrar_fallo(clave_bloqueo, max_intentos=5, ventana_segundos=60)
            raise ExcepcionDominio(CodigosDeError.CONTRASENA_ACTUAL_INCORRECTA)

        self.limitador.limpiar_intentos(clave_bloqueo)


class ComandoCambiarPassword(ComandoBase[None]):
    def __init__(
        self,
        id_usuario: uuid.UUID,
        password_actual: str,
        password_nueva: str,
        ip_cliente: str,
        repo_usuarios: PuertoRepositorioUsuarios,
        servicio_hash: PuertoHashPassword,
        limitador: PuertoLimitadorIntentos,
    ):
        self.id_usuario = id_usuario
        self.password_actual = password_actual
        self.password_nueva = password_nueva
        self.ip_cliente = ip_cliente
        self.repo_usuarios = repo_usuarios
        self.servicio_hash = servicio_hash
        self.limitador = limitador

    def validar(self) -> None:
        if self.password_actual == self.password_nueva:
            raise ExcepcionDominio(CodigosDeError.CONTRASENA_NUEVA_IGUAL)
        if len(self.password_nueva) < 8:
            raise ExcepcionDominio(CodigosDeError.DATOS_INVALIDOS, "La nueva contraseña debe tener al menos 8 caracteres.")

    def ejecutar(self) -> None:
        clave_bloqueo = f"cambiar_pass:{self.id_usuario}:{self.ip_cliente}"
        self.limitador.comprobar_bloqueo(clave_bloqueo)

        usuario = self.repo_usuarios.obtener_por_id(self.id_usuario)
        if not usuario or not self.servicio_hash.verificar(self.password_actual, usuario.password):
            self.limitador.registrar_fallo(clave_bloqueo, max_intentos=5, ventana_segundos=60)
            raise ExcepcionDominio(CodigosDeError.CONTRASENA_ACTUAL_INCORRECTA)

        self.limitador.limpiar_intentos(clave_bloqueo)
        nuevo_hash = self.servicio_hash.hash(self.password_nueva)
        self.repo_usuarios.actualizar_password(self.id_usuario, nuevo_hash)
