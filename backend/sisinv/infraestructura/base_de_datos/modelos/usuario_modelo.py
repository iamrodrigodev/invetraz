"""Modelo ORM SQLAlchemy 2.0 para la tabla auth.usuarios."""

import uuid
from sqlalchemy import String, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sisinv.infraestructura.base_de_datos.sesion import Base


class UsuarioModelo(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"schema": "auth"}

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
