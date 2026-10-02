"""Configuración centralizada de SisInv utilizando Pydantic Settings.
Inspirado en la clase Config de Apache Superset.
"""

from functools import lru_cache
from typing import List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Entorno y servidor
    app_name: str = "Sistema de Investigacion"
    debug: bool = False
    port: int = Field(default=8080, validation_alias="PORT")
    host: str = "0.0.0.0"

    # Base de datos PostgreSQL
    db_host: str = Field(default="localhost", validation_alias="DB_HOST")
    db_port: int = Field(default=5432, validation_alias="DB_PORT")
    db_name: str = Field(default="sistema_investigacion", validation_alias="DB_NAME")
    db_user: str = Field(default="investigacion", validation_alias="DB_USER")
    db_password: str = Field(default="postgres", validation_alias="DB_PASSWORD")
    db_pool_size: int = 10
    db_max_overflow: int = 5

    # Seguridad y Criptografía
    cookie_secure: bool = Field(default=False, validation_alias="COOKIE_SECURE")
    app_jwt_secret: str = Field(
        default="super_secret_jwt_key_that_should_be_long_enough_in_prod",
        validation_alias="APP_JWT_SECRET",
    )
    jwt_expiration_seconds: int = 3600  # 1 hora
    app_master_key: str = Field(
        default="super_secret_master_key_for_aes_encryption",
        validation_alias="APP_MASTER_KEY",
    )

    # CORS
    app_cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080,http://localhost:3000",
        validation_alias="APP_CORS_ORIGINS",
    )

    # Directorio de frontend estático
    static_dir: str = Field(default="frontend/dist", validation_alias="DIR_ESTATICOS_FRONTEND")

    @property
    def database_url(self) -> str:
        """URL de conexión para SQLAlchemy 2.0 con driver psycopg."""
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def cors_origins_list(self) -> List[str]:
        return [
            origin.strip()
            for origin in self.app_cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache()
def get_settings() -> Settings:
    return Settings()
