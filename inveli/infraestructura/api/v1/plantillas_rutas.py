"""Rutas de Plantillas y Google Drive."""

from typing import List
from fastapi import APIRouter
from inveli.aplicacion.comandos.plantillas import (
    ComandoListarPlantillas,
    ComandoVincularCarpetaDrive,
)
from inveli.infraestructura.api.dependencias import (
    RepoActividadesDep,
    RepoConfigDep,
    ServicioDriveDep,
    UsuarioActualDep,
)
from inveli.infraestructura.api.esquemas import (
    ApiRespuesta,
    CarpetaPlantillasRespuestaDto,
    PlantillaXlsxDto,
    VincularCarpetaDrivePeticion,
)

enrutador = APIRouter(prefix="/plantillas", tags=["Plantillas"])


@enrutador.get("", response_model=ApiRespuesta[List[PlantillaXlsxDto]])
def listar_plantillas(
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    repo_actividades: RepoActividadesDep,
    servicio_drive: ServicioDriveDep,
):
    comando = ComandoListarPlantillas(
        repo_config=repo_config,
        repo_actividades=repo_actividades,
        servicio_drive=servicio_drive,
    )
    plantillas = comando.run()
    datos = [
        PlantillaXlsxDto(
            id=p.id,
            nombre=p.nombre,
            enlaceWeb=p.enlace_web,
            enlaceDescarga=p.enlace_descarga,
            totalUsos=p.total_usos,
            formatoValido=p.formato_valido,
        )
        for p in plantillas
    ]
    return ApiRespuesta.exitoso(mensaje="Plantillas obtenidas exitosamente", datos=datos)


@enrutador.post("/verificar", response_model=ApiRespuesta[CarpetaPlantillasRespuestaDto])
def verificar_carpeta(
    peticion: VincularCarpetaDrivePeticion,
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_drive: ServicioDriveDep,
):
    comando = ComandoVincularCarpetaDrive(
        id_o_enlace=peticion.carpetaId,
        repo_config=repo_config,
        servicio_drive=servicio_drive,
    )
    resultado = comando.run()
    return ApiRespuesta.exitoso(
        mensaje="Carpeta verificada exitosamente",
        datos=CarpetaPlantillasRespuestaDto(
            carpetaId=resultado.id_carpeta,
            nombreCarpeta=resultado.nombre_carpeta,
        ),
    )


@enrutador.post("/carpeta", response_model=ApiRespuesta[CarpetaPlantillasRespuestaDto])
def vincular_carpeta(
    peticion: VincularCarpetaDrivePeticion,
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_drive: ServicioDriveDep,
):
    comando = ComandoVincularCarpetaDrive(
        id_o_enlace=peticion.carpetaId,
        repo_config=repo_config,
        servicio_drive=servicio_drive,
    )
    resultado = comando.run()
    return ApiRespuesta.exitoso(
        mensaje="Carpeta vinculada exitosamente",
        datos=CarpetaPlantillasRespuestaDto(
            carpetaId=resultado.id_carpeta,
            nombreCarpeta=resultado.nombre_carpeta,
        ),
    )
