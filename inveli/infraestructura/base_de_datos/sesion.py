"""Gestión de sesiones y motor de base de datos con SQLAlchemy 2.0."""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from inveli.config import get_settings


class Base(DeclarativeBase):
    """Clase base declarativa para todos los modelos ORM de Inveli."""
    pass


_settings = get_settings()

motor_db = create_engine(
    _settings.database_url,
    pool_size=_settings.db_pool_size,
    max_overflow=_settings.db_max_overflow,
    pool_pre_ping=True,
    echo=_settings.debug,
)

FabricaSesion = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=motor_db,
)


def obtener_sesion_db() -> Generator[Session, None, None]:
    """Generador de sesión para inyección de dependencias en FastAPI."""
    sesion = FabricaSesion()
    try:
        yield sesion
    finally:
        sesion.close()
