"""Comandos para la gestión de credenciales y configuración del sistema."""

from dataclasses import dataclass
from typing import Optional
import uuid
from invetraz.aplicacion.comandos.base import ComandoBase
from invetraz.aplicacion.puertos.repositorios import PuertoRepositorioConfiguracion
from invetraz.aplicacion.puertos.google import PuertoGoogleDrive
from invetraz.dominio.entidades.configuracion import ConfiguracionSistema
from invetraz.dominio.excepciones.base import CodigosDeError, ExcepcionDominio


@dataclass
class DtoConfiguracionSistema:
    id: uuid.UUID
    google_client_id: Optional[str]
    google_client_secret: Optional[str]
    google_refresh_token: Optional[str]
    google_drive_folder_id: Optional[str]
    google_drive_folder_name: Optional[str]
    google_verificado: bool
    drive_verificado: bool


class ComandoObtenerConfiguracion(ComandoBase[Optional[DtoConfiguracionSistema]]):
    def __init__(self, repo_config: PuertoRepositorioConfiguracion):
        self.repo_config = repo_config

    def ejecutar(self) -> Optional[DtoConfiguracionSistema]:
        config = self.repo_config.obtener()
        if not config:
            return None
        return DtoConfiguracionSistema(
            id=config.id,
            google_client_id=config.google_client_id,
            google_client_secret=config.google_client_secret,
            google_refresh_token=config.google_refresh_token,
            google_drive_folder_id=config.google_drive_folder_id,
            google_drive_folder_name=config.google_drive_folder_name,
            google_verificado=config.google_verificado,
            drive_verificado=config.drive_verificado,
        )


class ComandoGuardarConfiguracion(ComandoBase[DtoConfiguracionSistema]):
    def __init__(
        self,
        client_id: Optional[str],
        client_secret: Optional[str],
        refresh_token: Optional[str],
        repo_config: PuertoRepositorioConfiguracion,
    ):
        self.client_id = client_id.strip() if client_id else None
        self.client_secret = client_secret.strip() if client_secret else None
        self.refresh_token = refresh_token.strip() if refresh_token else None
        self.repo_config = repo_config

    def ejecutar(self) -> DtoConfiguracionSistema:
        actual = self.repo_config.obtener()
        if not actual:
            actual = ConfiguracionSistema(id=uuid.uuid4())

        actual.google_client_id = self.client_id
        actual.google_client_secret = self.client_secret
        actual.google_refresh_token = self.refresh_token
        actual.google_verificado = False
        actual.drive_verificado = False

        guardada = self.repo_config.guardar(actual)
        return DtoConfiguracionSistema(
            id=guardada.id,
            google_client_id=guardada.google_client_id,
            google_client_secret=guardada.google_client_secret,
            google_refresh_token=guardada.google_refresh_token,
            google_drive_folder_id=guardada.google_drive_folder_id,
            google_drive_folder_name=guardada.google_drive_folder_name,
            google_verificado=guardada.google_verificado,
            drive_verificado=guardada.drive_verificado,
        )


class ComandoVerificarConexionGoogle(ComandoBase[bool]):
    def __init__(
        self,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_drive: PuertoGoogleDrive,
    ):
        self.repo_config = repo_config
        self.servicio_drive = servicio_drive

    def ejecutar(self) -> bool:
        config = self.repo_config.obtener()
        if not config:
            raise ExcepcionDominio(CodigosDeError.NO_HAY_CREDENCIALES_GOOGLE)
        if not config.credenciales_completas:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_INCOMPLETAS)

        try:
            valido = self.servicio_drive.verificar_conexion(config)
            config.google_verificado = valido
            if not valido:
                config.drive_verificado = False
            self.repo_config.guardar(config)
            return valido
        except Exception:
            config.google_verificado = False
            config.drive_verificado = False
            self.repo_config.guardar(config)
            raise
