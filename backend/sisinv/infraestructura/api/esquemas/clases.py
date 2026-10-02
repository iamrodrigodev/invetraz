"""Esquemas Pydantic v2 para peticiones y respuestas de Google Classroom."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ClaseRespuesta(BaseModel):
    id: str
    nombre: str
    seccion: Optional[str] = None
    descripcion: Optional[str] = None
    sala: Optional[str] = None
    enlace: Optional[str] = None
    estado: str = "ACTIVA"


class TareaRespuesta(BaseModel):
    id: str
    idClase: str = Field(serialization_alias="idClase")
    titulo: str
    descripcion: Optional[str] = None
    idTema: Optional[str] = Field(default=None, serialization_alias="idTema")
    fechaLimite: Optional[datetime] = Field(default=None, serialization_alias="fechaLimite")
    puntajeMaximo: Optional[float] = Field(default=None, serialization_alias="puntajeMaximo")
    estado: str = "PUBLISHED"
    enlace: Optional[str] = None


class TemaRespuesta(BaseModel):
    id: str
    idClase: str = Field(serialization_alias="idClase")
    nombre: str


class CrearTareaPeticion(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    idTema: Optional[str] = Field(default=None, alias="idTema")
    enlacePlantilla: Optional[str] = Field(default=None, alias="enlacePlantilla")
    fechaLimite: Optional[str] = Field(default=None, alias="fechaLimite")
    puntajeMaximo: Optional[float] = Field(default=None, alias="puntajeMaximo")
