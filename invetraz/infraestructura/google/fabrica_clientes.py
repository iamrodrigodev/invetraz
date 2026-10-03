from typing import Any
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from invetraz.dominio.entidades.configuracion import ConfiguracionSistema
from invetraz.dominio.excepciones.base import CodigosDeError, ExcepcionDominio

class FabricaClientesGoogle:
    """Crea clientes autenticados para Google Classroom y Google Drive."""

    TOKEN_URI = "https://oauth2.googleapis.com/token"

    @classmethod
    def obtener_credenciales(cls, config: ConfiguracionSistema) -> Credentials:
        if not config.credenciales_completas:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_CONFIGURADAS)

        return Credentials(
            token=None,
            refresh_token=config.google_refresh_token,
            token_uri=cls.TOKEN_URI,
            client_id=config.google_client_id,
            client_secret=config.google_client_secret,
        )

    @classmethod
    def construir_servicio_classroom(cls, config: ConfiguracionSistema) -> Any:
        creds = cls.obtener_credenciales(config)
        return build("classroom", "v1", credentials=creds, cache_discovery=False)

    @classmethod
    def construir_servicio_drive(cls, config: ConfiguracionSistema) -> Any:
        creds = cls.obtener_credenciales(config)
        return build("drive", "v3", credentials=creds, cache_discovery=False)
