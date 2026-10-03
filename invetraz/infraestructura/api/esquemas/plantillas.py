from typing import Optional
from pydantic import BaseModel, Field

class VincularCarpetaDrivePeticion(BaseModel):
    carpetaId: str = Field(alias="carpetaId")

class CarpetaPlantillasRespuestaDto(BaseModel):
    carpetaId: str = Field(serialization_alias="carpetaId")
    nombreCarpeta: str = Field(serialization_alias="nombreCarpeta")

class PlantillaXlsxDto(BaseModel):
    id: str
    nombre: str
    enlaceWeb: Optional[str] = Field(default=None, serialization_alias="enlaceWeb")
    enlaceDescarga: Optional[str] = Field(default=None, serialization_alias="enlaceDescarga")
    totalUsos: int = Field(default=0, serialization_alias="totalUsos")
    formatoValido: bool = Field(default=True, serialization_alias="formatoValido")
