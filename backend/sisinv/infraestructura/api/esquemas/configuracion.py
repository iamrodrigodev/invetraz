"""Esquemas Pydantic v2 para peticiones y respuestas de Configuración."""

from typing import Optional
import uuid
from pydantic import BaseModel, Field


class ActualizarCredencialesPeticion(BaseModel):
    clientId: Optional[str] = Field(default=None, alias="clientId")
    clientSecret: Optional[str] = Field(default=None, alias="clientSecret")
    refreshToken: Optional[str] = Field(default=None, alias="refreshToken")


class ConfiguracionSistemaDTO(BaseModel):
    id: uuid.UUID
    googleClientId: Optional[str] = Field(default=None, serialization_alias="googleClientId")
    googleClientSecret: Optional[str] = Field(default=None, serialization_alias="googleClientSecret")
    googleRefreshToken: Optional[str] = Field(default=None, serialization_alias="googleRefreshToken")
    googleDriveFolderId: Optional[str] = Field(default=None, serialization_alias="googleDriveFolderId")
    googleDriveFolderName: Optional[str] = Field(default=None, serialization_alias="googleDriveFolderName")
    googleVerificado: bool = Field(default=False, serialization_alias="googleVerificado")
    driveVerificado: bool = Field(default=False, serialization_alias="driveVerificado")
