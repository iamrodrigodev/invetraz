"""Entidad de dominio ConfiguracionSistema."""

from dataclasses import dataclass
from typing import Optional
import uuid


@dataclass
class ConfiguracionSistema:
    id: uuid.UUID
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_refresh_token: Optional[str] = None
    google_drive_folder_id: Optional[str] = None
    google_drive_folder_name: Optional[str] = None
    google_verificado: bool = False
    drive_verificado: bool = False

    @property
    def credenciales_completas(self) -> bool:
        return bool(
            self.google_client_id
            and self.google_client_secret
            and self.google_refresh_token
        )
