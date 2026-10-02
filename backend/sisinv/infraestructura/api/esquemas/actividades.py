"""Esquemas Pydantic v2 para peticiones y respuestas de Actividades de Seguimiento."""

from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, Field


class ActividadSeguimientoDto(BaseModel):
    id: uuid.UUID
    idTareaClassroom: str = Field(serialization_alias="idTareaClassroom")
    idClaseClassroom: str = Field(serialization_alias="idClaseClassroom")
    nombreClase: Optional[str] = Field(default=None, serialization_alias="nombreClase")
    idTemaClassroom: Optional[str] = Field(default=None, serialization_alias="idTemaClassroom")
    nombreTema: Optional[str] = Field(default=None, serialization_alias="nombreTema")
    idPlantillaDrive: str = Field(serialization_alias="idPlantillaDrive")
    nombrePlantilla: Optional[str] = Field(default=None, serialization_alias="nombrePlantilla")
    enlacePlantilla: Optional[str] = Field(default=None, serialization_alias="enlacePlantilla")
    titulo: str
    descripcion: Optional[str] = None
    fechaLimite: Optional[datetime] = Field(default=None, serialization_alias="fechaLimite")
    puntajeMaximo: Optional[float] = Field(default=None, serialization_alias="puntajeMaximo")
    estado: str
    enlaceTarea: Optional[str] = Field(default=None, serialization_alias="enlaceTarea")
    fechaCreacion: Optional[datetime] = Field(default=None, serialization_alias="fechaCreacion")
