from dataclasses import dataclass
from typing import Optional

@dataclass
class PlantillaXlsx:
    id: str
    nombre: str
    enlace_web: Optional[str] = None
    enlace_descarga: Optional[str] = None
    total_usos: int = 0
    formato_valido: bool = True
