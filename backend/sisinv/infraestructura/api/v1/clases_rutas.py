"""Rutas de Google Classroom."""

from typing import List
from fastapi import APIRouter, Body
from sisinv.aplicacion.comandos.clases import (
    ComandoArchivarClase,
    ComandoCrearTarea,
    ComandoListarClasesAlumno,
    ComandoListarClasesDocente,
    ComandoListarTareas,
    ComandoListarTemas,
)
from sisinv.infraestructura.api.dependencias import (
    RepoConfigDep,
    ServicioClassroomDep,
    UsuarioActualDep,
)
from sisinv.infraestructura.api.esquemas import (
    ApiRespuesta,
    ClaseRespuesta,
    CrearTareaPeticion,
    TareaRespuesta,
    TemaRespuesta,
)

enrutador = APIRouter(prefix="/clases", tags=["Clases"])


@enrutador.get("/como-docente", response_model=ApiRespuesta[List[ClaseRespuesta]])
def listar_como_docente(
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_classroom: ServicioClassroomDep,
):
    comando = ComandoListarClasesDocente(
        repo_config=repo_config,
        servicio_classroom=servicio_classroom,
    )
    clases = comando.run()
    datos = [
        ClaseRespuesta(
            id=c.id,
            nombre=c.nombre,
            seccion=c.seccion,
            descripcion=c.descripcion,
            sala=c.sala,
            enlace=c.enlace,
            estado=c.estado,
        )
        for c in clases
    ]
    return ApiRespuesta.exitoso(mensaje="Clases como docente obtenidas exitosamente", datos=datos)


@enrutador.get("/como-estudiante", response_model=ApiRespuesta[List[ClaseRespuesta]])
def listar_como_estudiante(
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_classroom: ServicioClassroomDep,
):
    comando = ComandoListarClasesAlumno(
        repo_config=repo_config,
        servicio_classroom=servicio_classroom,
    )
    clases = comando.run()
    datos = [
        ClaseRespuesta(
            id=c.id,
            nombre=c.nombre,
            seccion=c.seccion,
            descripcion=c.descripcion,
            sala=c.sala,
            enlace=c.enlace,
            estado=c.estado,
        )
        for c in clases
    ]
    return ApiRespuesta.exitoso(mensaje="Clases como estudiante obtenidas exitosamente", datos=datos)


@enrutador.get("/{id_clase}/tareas", response_model=ApiRespuesta[List[TareaRespuesta]])
def listar_tareas(
    id_clase: str,
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_classroom: ServicioClassroomDep,
):
    comando = ComandoListarTareas(
        id_clase=id_clase,
        repo_config=repo_config,
        servicio_classroom=servicio_classroom,
    )
    tareas = comando.run()
    datos = [
        TareaRespuesta(
            id=t.id,
            idClase=t.id_clase,
            titulo=t.titulo,
            descripcion=t.descripcion,
            idTema=t.id_tema,
            fechaLimite=t.fecha_limite,
            puntajeMaximo=t.puntaje_maximo,
            estado=t.estado,
            enlace=t.enlace,
        )
        for t in tareas
    ]
    return ApiRespuesta.exitoso(mensaje="Tareas de la clase obtenidas exitosamente", datos=datos)


@enrutador.get("/{id_clase}/temas", response_model=ApiRespuesta[List[TemaRespuesta]])
def listar_temas(
    id_clase: str,
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_classroom: ServicioClassroomDep,
):
    comando = ComandoListarTemas(
        id_clase=id_clase,
        repo_config=repo_config,
        servicio_classroom=servicio_classroom,
    )
    temas = comando.run()
    datos = [
        TemaRespuesta(id=t.id, idClase=t.id_clase, nombre=t.nombre)
        for t in temas
    ]
    return ApiRespuesta.exitoso(mensaje="Temas de la clase obtenidos exitosamente", datos=datos)


@enrutador.post("/{id_clase}/tareas", response_model=ApiRespuesta[TareaRespuesta])
def crear_tarea(
    id_clase: str,
    peticion: CrearTareaPeticion,
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_classroom: ServicioClassroomDep,
):
    comando = ComandoCrearTarea(
        id_clase=id_clase,
        titulo=peticion.titulo,
        descripcion=peticion.descripcion,
        id_tema=peticion.idTema,
        enlace_plantilla=peticion.enlacePlantilla,
        fecha_limite=peticion.fechaLimite,
        puntaje_maximo=peticion.puntajeMaximo,
        repo_config=repo_config,
        servicio_classroom=servicio_classroom,
    )
    creada = comando.run()
    dto = TareaRespuesta(
        id=creada.id,
        idClase=creada.id_clase,
        titulo=creada.titulo,
        descripcion=creada.descripcion,
        idTema=creada.id_tema,
        fechaLimite=creada.fecha_limite,
        puntajeMaximo=creada.puntaje_maximo,
        estado=creada.estado,
        enlace=creada.enlace,
    )
    return ApiRespuesta.exitoso(mensaje="Tarea creada exitosamente", datos=dto, codigo=201)


@enrutador.post("", response_model=ApiRespuesta[None])
def archivar_clase(
    id_clase: str = Body(..., embed=True, alias="idClase"),
    _usuario: UsuarioActualDep = None,
    repo_config: RepoConfigDep = None,
    servicio_classroom: ServicioClassroomDep = None,
):
    comando = ComandoArchivarClase(
        id_clase=id_clase,
        repo_config=repo_config,
        servicio_classroom=servicio_classroom,
    )
    comando.run()
    return ApiRespuesta.exitoso(mensaje="Clase archivada exitosamente")
