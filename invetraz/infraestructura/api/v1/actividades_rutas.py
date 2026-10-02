"""Rutas de Actividades de Seguimiento."""

from typing import List
from fastapi import APIRouter
from invetraz.aplicacion.comandos.actividades import (
    ComandoListarActividades,
    ComandoSincronizarActividades,
)
from invetraz.infraestructura.api.dependencias import (
    RepoActividadesDep,
    RepoConfigDep,
    ServicioClassroomDep,
    ServicioDriveDep,
    UsuarioActualDep,
)
from invetraz.infraestructura.api.esquemas import (
    ActividadSeguimientoDto,
    ApiRespuesta,
)

enrutador = APIRouter(prefix="/actividades-seguimiento", tags=["Actividades de Seguimiento"])


@enrutador.get("", response_model=ApiRespuesta[List[ActividadSeguimientoDto]])
def listar_actividades(
    _usuario: UsuarioActualDep,
    repo_actividades: RepoActividadesDep,
):
    comando = ComandoListarActividades(repo_actividades=repo_actividades)
    actividades = comando.run()
    datos = [
        ActividadSeguimientoDto(
            id=a.id,
            idTareaClassroom=a.id_tarea_classroom,
            idClaseClassroom=a.id_clase_classroom,
            nombreClase=a.nombre_clase,
            idTemaClassroom=a.id_tema_classroom,
            nombreTema=a.nombre_tema,
            idPlantillaDrive=a.id_plantilla_drive,
            nombrePlantilla=a.nombre_plantilla,
            enlacePlantilla=a.enlace_plantilla,
            titulo=a.titulo,
            descripcion=a.descripcion,
            fechaLimite=a.fecha_limite,
            puntajeMaximo=a.puntaje_maximo,
            estado=a.estado,
            enlaceTarea=a.enlace_tarea,
            fechaCreacion=a.fecha_creacion,
        )
        for a in actividades
    ]
    return ApiRespuesta.exitoso(mensaje="Actividades obtenidas exitosamente", datos=datos)


@enrutador.post("/sincronizar", response_model=ApiRespuesta[List[ActividadSeguimientoDto]])
def sincronizar_actividades(
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    repo_actividades: RepoActividadesDep,
    servicio_classroom: ServicioClassroomDep,
    servicio_drive: ServicioDriveDep,
):
    comando = ComandoSincronizarActividades(
        repo_config=repo_config,
        repo_actividades=repo_actividades,
        servicio_classroom=servicio_classroom,
        servicio_drive=servicio_drive,
    )
    actividades = comando.run()
    datos = [
        ActividadSeguimientoDto(
            id=a.id,
            idTareaClassroom=a.id_tarea_classroom,
            idClaseClassroom=a.id_clase_classroom,
            nombreClase=a.nombre_clase,
            idTemaClassroom=a.id_tema_classroom,
            nombreTema=a.nombre_tema,
            idPlantillaDrive=a.id_plantilla_drive,
            nombrePlantilla=a.nombre_plantilla,
            enlacePlantilla=a.enlace_plantilla,
            titulo=a.titulo,
            descripcion=a.descripcion,
            fechaLimite=a.fecha_limite,
            puntajeMaximo=a.puntaje_maximo,
            estado=a.estado,
            enlaceTarea=a.enlace_tarea,
            fechaCreacion=a.fecha_creacion,
        )
        for a in actividades
    ]
    return ApiRespuesta.exitoso(mensaje="Actividades sincronizadas exitosamente", datos=datos)
