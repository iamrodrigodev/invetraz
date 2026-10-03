from typing import Optional
import uuid
from sqlalchemy import Boolean, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from invetraz.infraestructura.base_de_datos.sesion import Base

class ConfiguracionSistemaModelo(Base):
    __tablename__ = "configuracion_sistema"
    __table_args__ = {"schema": "configuracion"}

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    google_client_id: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    google_client_secret: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    google_refresh_token: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    google_drive_folder_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_drive_folder_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    google_verificado: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    drive_verificado: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
