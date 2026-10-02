"""Comandos para gestión y sincronización de Actividades de Seguimiento."""

from datetime import datetime
from typing import List, Optional
import uuid
from inveli.aplicacion.comandos.base import ComandoBase
from inveli.aplicacion.puertos.repositorios import (
    PuertoRepositorioActividades,
    PuertoRepositorioConfiguracion,
)
from inveli.aplicacion.puertos.google import PuertoGoogleClassroom, PuertoGoogleDrive
from inveli.dominio.entidades.actividad import ActividadSeguimiento
from inveli.dominio.excepciones.base import CodigosDeError, ExcepcionDominio


class ComandoListarActividades(ComandoBase[List[ActividadSeguimiento]]):
    def __init__(self, repo_actividades: PuertoRepositorioActividades):
        self.repo_actividades = repo_actividades

    def ejecutar(self) -> List[ActividadSeguimiento]:
        return self.repo_actividades.listar_todas_ordenadas()


class ComandoSincronizarActividades(ComandoBase[List[ActividadSeguimiento]]):
    def __init__(
        self,
        repo_config: PuertoRepositorioConfiguracion,
        repo_actividades: PuertoRepositorioActividades,
        servicio_classroom: PuertoGoogleClassroom,
        servicio_drive: PuertoGoogleDrive,
    ):
        self.repo_config = repo_config
        self.repo_actividades = repo_actividades
        self.servicio_classroom = servicio_classroom
        self.servicio_drive = servicio_drive

    def ejecutar(self) -> List[ActividadSeguimiento]:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)

        if not config.google_drive_folder_id:
            return self.repo_actividades.listar_todas_ordenadas()

        # 1. Obtener plantillas disponibles en Google Drive para correlacionar IDs
        plantillas = self.servicio_drive.listar_plantillas_xlsx(config.google_drive_folder_id, config)
        mapa_plantillas = {p.id: p for p in plantillas}

        # 2. Obtener clases donde es docente
        clases = self.servicio_classroom.listar_clases_como_docente(config)

        actividades_a_guardar: List[ActividadSeguimiento] = []

        for clase in clases:
            # Temas de la clase
            temas = self.servicio_classroom.listar_temas_de_clase(clase.id, config)
            mapa_temas = {t.id: t.nombre for t in temas}

            # Tareas de la clase
            tareas = self.servicio_classroom.listar_tareas_de_clase(clase.id, config)
            for tarea in tareas:
                # Buscar si la tarea ya fue registrada o si corresponde a una actividad
                existente = self.repo_actividades.obtener_por_id_tarea(tarea.id)
                id_plantilla = existente.id_plantilla_drive if existente else ""
                nombre_plantilla = existente.nombre_plantilla if existente else None
                enlace_plantilla = existente.enlace_plantilla if existente else None

                # Si no tiene plantilla vinculada pero hay coincidencia en plantillas
                if not id_plantilla and plantillas:
                    # Por defecto o primera plantilla encontrada
                    id_plantilla = plantillas[0].id
                    nombre_plantilla = plantillas[0].nombre
                    enlace_plantilla = plantillas[0].enlace_web
                elif id_plantilla in mapa_plantillas:
                    nombre_plantilla = mapa_plantillas[id_plantilla].nombre
                    enlace_plantilla = mapa_plantillas[id_plantilla].enlace_web

                nombre_tema = mapa_temas.get(tarea.id_tema) if tarea.id_tema else None

                actividad = ActividadSeguimiento(
                    id=existente.id if existente else uuid.uuid4(),
                    id_tarea_classroom=tarea.id,
                    id_clase_classroom=clase.id,
                    nombre_clase=clase.nombre,
                    id_tema_classroom=tarea.id_tema,
                    nombre_tema=nombre_tema,
                    id_plantilla_drive=id_plantilla,
                    nombre_plantilla=nombre_plantilla,
                    enlace_plantilla=enlace_plantilla,
                    titulo=tarea.titulo,
                    descripcion=tarea.descripcion,
                    fecha_limite=tarea.fecha_limite,
                    puntaje_maximo=tarea.puntaje_maximo,
                    estado=tarea.estado,
                    enlace_tarea=tarea.enlace,
                )
                self.repo_actividades.guardar_o_actualizar(actividad)

        return self.repo_actividades.listar_todas_ordenadas()
