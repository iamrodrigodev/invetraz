"""Adaptador de persistencia para ConfiguracionSistema con cifrado transparente."""

from typing import Optional
import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from sisinv.dominio.entidades.configuracion import ConfiguracionSistema
from sisinv.infraestructura.base_de_datos.modelos.configuracion_modelo import ConfiguracionSistemaModelo
from sisinv.aplicacion.puertos.seguridad import PuertoCriptografia


class RepositorioConfiguracionSqlAlchemy:
    def __init__(self, sesion: Session, encriptador: PuertoCriptografia):
        self._sesion = sesion
        self._encriptador = encriptador

    def _a_dominio(self, modelo: ConfiguracionSistemaModelo) -> ConfiguracionSistema:
        return ConfiguracionSistema(
            id=modelo.id,
            google_client_id=modelo.google_client_id,
            google_client_secret=self._encriptador.desencriptar(modelo.google_client_secret),
            google_refresh_token=self._encriptador.desencriptar(modelo.google_refresh_token),
            google_drive_folder_id=modelo.google_drive_folder_id,
            google_drive_folder_name=modelo.google_drive_folder_name,
            google_verificado=modelo.google_verificado,
            drive_verificado=modelo.drive_verificado,
        )

    def obtener(self) -> Optional[ConfiguracionSistema]:
        sentencia = select(ConfiguracionSistemaModelo).limit(1)
        modelo = self._sesion.scalars(sentencia).first()
        return self._a_dominio(modelo) if modelo else None

    def guardar(self, configuracion: ConfiguracionSistema) -> ConfiguracionSistema:
        secret_cifrado = self._encriptador.encriptar(configuracion.google_client_secret)
        token_cifrado = self._encriptador.encriptar(configuracion.google_refresh_token)

        sentencia = select(ConfiguracionSistemaModelo).limit(1)
        modelo = self._sesion.scalars(sentencia).first()

        if modelo is None:
            modelo = ConfiguracionSistemaModelo(
                id=configuracion.id or uuid.uuid4(),
                google_client_id=configuracion.google_client_id,
                google_client_secret=secret_cifrado,
                google_refresh_token=token_cifrado,
                google_drive_folder_id=configuracion.google_drive_folder_id,
                google_drive_folder_name=configuracion.google_drive_folder_name,
                google_verificado=configuracion.google_verificado,
                drive_verificado=configuracion.drive_verificado,
            )
            self._sesion.add(modelo)
        else:
            modelo.google_client_id = configuracion.google_client_id
            modelo.google_client_secret = secret_cifrado
            modelo.google_refresh_token = token_cifrado
            modelo.google_drive_folder_id = configuracion.google_drive_folder_id
            modelo.google_drive_folder_name = configuracion.google_drive_folder_name
            modelo.google_verificado = configuracion.google_verificado
            modelo.drive_verificado = configuracion.drive_verificado

        self._sesion.commit()
        self._sesion.refresh(modelo)
        return self._a_dominio(modelo)
