"""Modelo ORM SQLAlchemy 2.0 para la tabla seguimiento.actividades_seguimiento."""

from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy import DateTime, Float, Index, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column
from sisinv.infraestructura.base_de_datos.sesion import Base


class ActividadSeguimientoModelo(Base):
    __tablename__ = "actividades_seguimiento"
    __table_args__ = (
        Index("idx_actividades_seguimiento_plantilla", "id_plantilla_drive"),
        Index("idx_actividades_seguimiento_clase", "id_clase_classroom"),
        {"schema": "seguimiento"},
    )

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    id_tarea_classroom: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    id_clase_classroom: Mapped[str] = mapped_column(String(100), nullable=False)
    nombre_clase: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    id_tema_classroom: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    nombre_tema: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    id_plantilla_drive: Mapped[str] = mapped_column(String(255), nullable=False)
    nombre_plantilla: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    enlace_plantilla: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    titulo: Mapped[str] = mapped_column(String(3000), nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    fecha_limite: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    puntaje_maximo: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    estado: Mapped[str] = mapped_column(String(50), nullable=False)
    enlace_tarea: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
