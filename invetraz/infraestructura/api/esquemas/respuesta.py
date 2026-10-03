from datetime import datetime
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")

class ApiRespuesta(BaseModel, Generic[T]):
    """Envoltorio estándar idéntico al que espera el frontend React."""

    estado: int
    mensaje: str
    idRastreo: Optional[str] = Field(default=None, serialization_alias="idRastreo")
    ruta: Optional[str] = None
    fechaHora: Optional[str] = Field(default=None, serialization_alias="fechaHora")
    datos: Optional[T] = None
    errores: Optional[Any] = None

    @classmethod
    def exitoso(cls, mensaje: str, datos: Optional[T] = None, codigo: int = 200, id_rastreo: Optional[str] = None) -> "ApiRespuesta[T]":
        return cls(
            estado=codigo,
            mensaje=mensaje,
            idRastreo=id_rastreo,
            datos=datos,
        )

    @classmethod
    def con_error(
        cls,
        codigo: int,
        mensaje: str,
        ruta: Optional[str] = None,
        errores: Optional[Any] = None,
        id_rastreo: Optional[str] = None,
    ) -> "ApiRespuesta[None]":
        return cls(
            estado=codigo,
            mensaje=mensaje,
            idRastreo=id_rastreo,
            ruta=ruta,
            fechaHora=datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            errores=errores,
        )
