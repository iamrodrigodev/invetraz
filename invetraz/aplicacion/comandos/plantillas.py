from dataclasses import dataclass
from typing import List
from invetraz.aplicacion.comandos.base import ComandoBase
from invetraz.aplicacion.puertos.repositorios import (
    PuertoRepositorioActividades,
    PuertoRepositorioConfiguracion,
)
from invetraz.aplicacion.puertos.google import PuertoGoogleDrive
from invetraz.dominio.entidades.plantilla import PlantillaXlsx
from invetraz.dominio.excepciones.base import CodigosDeError, ExcepcionDominio

@dataclass
class CarpetaPlantillasInfo:
    id_carpeta: str
    nombre_carpeta: str

class ComandoVincularCarpetaDrive(ComandoBase[CarpetaPlantillasInfo]):
    def __init__(
        self,
        id_o_enlace: str,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_drive: PuertoGoogleDrive,
    ):
        self.id_o_enlace = id_o_enlace
        self.repo_config = repo_config
        self.servicio_drive = servicio_drive

    def ejecutar(self) -> CarpetaPlantillasInfo:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)

        nombre_carpeta = self.servicio_drive.verificar_y_obtener_nombre_carpeta(self.id_o_enlace, config)
        id_limpio = self.servicio_drive.extraer_id_carpeta(self.id_o_enlace)

        config.google_drive_folder_id = id_limpio
        config.google_drive_folder_name = nombre_carpeta
        config.drive_verificado = True
        self.repo_config.guardar(config)

        return CarpetaPlantillasInfo(id_carpeta=id_limpio, nombre_carpeta=nombre_carpeta)

class ComandoListarPlantillas(ComandoBase[List[PlantillaXlsx]]):
    def __init__(
        self,
        repo_config: PuertoRepositorioConfiguracion,
        repo_actividades: PuertoRepositorioActividades,
        servicio_drive: PuertoGoogleDrive,
    ):
        self.repo_config = repo_config
        self.repo_actividades = repo_actividades
        self.servicio_drive = servicio_drive

    def ejecutar(self) -> List[PlantillaXlsx]:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)

        if not config.google_drive_folder_id:
            return []

        plantillas = self.servicio_drive.listar_plantillas_xlsx(config.google_drive_folder_id, config)

        for p in plantillas:
            usos = self.repo_actividades.contar_usos_por_plantilla(p.id)
            p.total_usos = usos

        return plantillas
