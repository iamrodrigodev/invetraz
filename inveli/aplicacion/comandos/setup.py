"""Comandos de configuración inicial (Setup) del sistema."""

from dataclasses import dataclass
import uuid
from inveli.aplicacion.comandos.base import ComandoBase
from inveli.aplicacion.puertos.repositorios import PuertoRepositorioUsuarios
from inveli.aplicacion.puertos.seguridad import PuertoHashPassword
from inveli.dominio.entidades.usuario import Usuario
from inveli.dominio.excepciones.base import CodigosDeError, ExcepcionDominio


@dataclass
class EstadoSetup:
    admin_configurado: bool


class ComandoObtenerEstadoSetup(ComandoBase[EstadoSetup]):
    def __init__(self, repo_usuarios: PuertoRepositorioUsuarios):
        self.repo_usuarios = repo_usuarios

    def ejecutar(self) -> EstadoSetup:
        configurado = self.repo_usuarios.existe_algun_usuario()
        return EstadoSetup(admin_configurado=configurado)


class ComandoCrearAdmin(ComandoBase[Usuario]):
    def __init__(
        self,
        email: str,
        password: str,
        repo_usuarios: PuertoRepositorioUsuarios,
        servicio_hash: PuertoHashPassword,
    ):
        self.email = email.strip().lower()
        self.password = password
        self.repo_usuarios = repo_usuarios
        self.servicio_hash = servicio_hash

    def validar(self) -> None:
        if not self.email or "@" not in self.email:
            raise ExcepcionDominio(CodigosDeError.DATOS_INVALIDOS, "El correo electrónico no es válido.")
        if not self.password or len(self.password) < 8:
            raise ExcepcionDominio(CodigosDeError.DATOS_INVALIDOS, "La contraseña debe tener al menos 8 caracteres.")

    def ejecutar(self) -> Usuario:
        if self.repo_usuarios.existe_algun_usuario():
            raise ExcepcionDominio(CodigosDeError.ADMIN_YA_CONFIGURADO)

        password_hash = self.servicio_hash.hash(self.password)
        nuevo_admin = Usuario(
            id=uuid.uuid4(),
            email=self.email,
            password=password_hash,
        )
        return self.repo_usuarios.guardar(nuevo_admin)
