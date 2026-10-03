from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class ClaseClassroom:
    id: str
    nombre: str
    seccion: Optional[str] = None
    descripcion: Optional[str] = None
    sala: Optional[str] = None
    enlace: Optional[str] = None
    estado: str = "ACTIVA"

@dataclass
class TareaClassroom:
    id: str
    id_clase: str
    titulo: str
    descripcion: Optional[str] = None
    id_tema: Optional[str] = None
    fecha_limite: Optional[datetime] = None
    puntaje_maximo: Optional[float] = None
    estado: str = "PUBLISHED"
    enlace: Optional[str] = None

@dataclass
class TemaClassroom:
    id: str
    id_clase: str
    nombre: str
