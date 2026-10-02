"""Entidad de dominio ActividadSeguimiento."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional
import uuid


@dataclass
class ActividadSeguimiento:
    id: uuid.UUID
    id_tarea_classroom: str
    id_clase_classroom: str
    nombre_clase: Optional[str]
    id_tema_classroom: Optional[str]
    nombre_tema: Optional[str]
    id_plantilla_drive: str
    nombre_plantilla: Optional[str]
    enlace_plantilla: Optional[str]
    titulo: str
    descripcion: Optional[str]
    fecha_limite: Optional[datetime]
    puntaje_maximo: Optional[float]
    estado: str
    enlace_tarea: Optional[str]
    fecha_creacion: Optional[datetime] = None
