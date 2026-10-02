"""Puertos de Integración con servicios de Google."""

from typing import List, Optional, Protocol
from sisinv.dominio.entidades.clase import ClaseClassroom, TareaClassroom, TemaClassroom
from sisinv.dominio.entidades.plantilla import PlantillaXlsx
from sisinv.dominio.entidades.configuracion import ConfiguracionSistema


class PuertoGoogleClassroom(Protocol):
    """Contrato para interactuar con Google Classroom API."""

    def listar_clases_como_docente(self, config: ConfiguracionSistema) -> List[ClaseClassroom]:
        ...

    def listar_clases_como_estudiante(self, config: ConfiguracionSistema) -> List[ClaseClassroom]:
        ...

    def listar_tareas_de_clase(self, id_clase: str, config: ConfiguracionSistema) -> List[TareaClassroom]:
        ...

    def listar_temas_de_clase(self, id_clase: str, config: ConfiguracionSistema) -> List[TemaClassroom]:
        ...

    def crear_tarea(
        self,
        id_clase: str,
        titulo: str,
        descripcion: Optional[str],
        id_tema: Optional[str],
        enlace_plantilla: Optional[str],
        fecha_limite: Optional[str],
        puntaje_maximo: Optional[float],
        config: ConfiguracionSistema,
    ) -> TareaClassroom:
        ...

    def archivar_clase(self, id_clase: str, config: ConfiguracionSistema) -> None:
        ...


class PuertoGoogleDrive(Protocol):
    """Contrato para interactuar con Google Drive API."""

    def verificar_y_obtener_nombre_carpeta(self, id_o_enlace: str, config: ConfiguracionSistema) -> str:
        ...

    def listar_plantillas_xlsx(self, id_carpeta: str, config: ConfiguracionSistema) -> List[PlantillaXlsx]:
        ...

    def verificar_conexion(self, config: ConfiguracionSistema) -> bool:
        ...
