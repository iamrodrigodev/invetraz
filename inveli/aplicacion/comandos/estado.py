"""Comandos para verificación de estado y readiness del sistema."""

from dataclasses import dataclass
from inveli.aplicacion.comandos.base import ComandoBase
from inveli.aplicacion.puertos.repositorios import PuertoRepositorioConfiguracion


@dataclass
class EstadoReadiness:
    listo: bool
    base_de_datos: bool
    google_cloud: bool
    google_drive: bool


class ComandoVerificarReadiness(ComandoBase[EstadoReadiness]):
    def __init__(self, repo_config: PuertoRepositorioConfiguracion):
        self.repo_config = repo_config

    def ejecutar(self) -> EstadoReadiness:
        try:
            config = self.repo_config.obtener()
            bd_ok = True
            google_cloud_ok = bool(config and config.google_verificado)
            google_drive_ok = bool(config and config.drive_verificado)
        except Exception:
            bd_ok = False
            google_cloud_ok = False
            google_drive_ok = False

        listo = bd_ok
        return EstadoReadiness(
            listo=listo,
            base_de_datos=bd_ok,
            google_cloud=google_cloud_ok,
            google_drive=google_drive_ok,
        )
