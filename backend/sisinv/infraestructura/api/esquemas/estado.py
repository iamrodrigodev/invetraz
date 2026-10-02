"""Esquemas Pydantic v2 para Estado y Readiness."""

from pydantic import BaseModel, Field


class ReadinessRespuesta(BaseModel):
    listo: bool
    baseDeDatos: bool = Field(serialization_alias="baseDeDatos")
    googleCloud: bool = Field(serialization_alias="googleCloud")
    googleDrive: bool = Field(serialization_alias="googleDrive")
