"""Adaptador para Google Classroom API implementando PuertoGoogleClassroom."""

from datetime import datetime
import re
from typing import Any, List, Optional
from googleapiclient.errors import HttpError
from sisinv.dominio.entidades.clase import ClaseClassroom, TareaClassroom, TemaClassroom
from sisinv.dominio.entidades.configuracion import ConfiguracionSistema
from sisinv.dominio.excepciones.base import CodigosDeError, ExcepcionDominio
from sisinv.infraestructura.google.fabrica_clientes import FabricaClientesGoogle
from sisinv.infraestructura.google.cache_classroom import CacheClassroom


class AdaptadorGoogleClassroom:
    """Implementa las operaciones de Google Classroom con manejo de errores y caché."""

    def __init__(self, cache: Optional[CacheClassroom] = None):
        self._cache = cache or CacheClassroom()

    def _mapear_error_http(self, error: HttpError) -> ExcepcionDominio:
        codigo = error.resp.status
        if codigo == 403:
            return ExcepcionDominio(CodigosDeError.ACCESO_DENEGADO)
        elif codigo == 404:
            return ExcepcionDominio(CodigosDeError.RECURSO_NO_ENCONTRADO)
        elif codigo == 429:
            return ExcepcionDominio(CodigosDeError.LIMITE_PETICIONES_EXCEDIDO)
        elif codigo == 502:
            return ExcepcionDominio(CodigosDeError.ERROR_COMUNICACION_GOOGLE)
        elif codigo == 503:
            return ExcepcionDominio(CodigosDeError.ERROR_CONFIGURACION_GOOGLE)
        elif codigo == 504:
            return ExcepcionDominio(CodigosDeError.TIEMPO_ESPERA_AGOTADO)
        return ExcepcionDominio(CodigosDeError.ERROR_COMUNICACION_GOOGLE, detalle=str(error))

    def listar_clases_como_docente(self, config: ConfiguracionSistema) -> List[ClaseClassroom]:
        clave_cache = "docente_cursos"
        en_cache = self._cache.obtener(clave_cache)
        if en_cache is not None:
            return en_cache

        try:
            servicio = FabricaClientesGoogle.construir_servicio_classroom(config)
            peticion = servicio.courses().list(teacherId="me", courseStates=["ACTIVE"])
            resultado = peticion.execute()
            cursos_crudos = resultado.get("courses", [])

            clases = [
                ClaseClassroom(
                    id=c.get("id"),
                    nombre=c.get("name"),
                    seccion=c.get("section"),
                    descripcion=c.get("descriptionHeading"),
                    sala=c.get("room"),
                    enlace=c.get("alternateLink"),
                    estado=c.get("courseState", "ACTIVE"),
                )
                for c in cursos_crudos
            ]
            self._cache.guardar(clave_cache, clases)
            return clases
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_GOOGLE, detalle=str(e))

    def listar_clases_como_estudiante(self, config: ConfiguracionSistema) -> List[ClaseClassroom]:
        clave_cache = "estudiante_cursos"
        en_cache = self._cache.obtener(clave_cache)
        if en_cache is not None:
            return en_cache

        try:
            servicio = FabricaClientesGoogle.construir_servicio_classroom(config)
            peticion = servicio.courses().list(studentId="me", courseStates=["ACTIVE"])
            resultado = peticion.execute()
            cursos_crudos = resultado.get("courses", [])

            clases = [
                ClaseClassroom(
                    id=c.get("id"),
                    nombre=c.get("name"),
                    seccion=c.get("section"),
                    descripcion=c.get("descriptionHeading"),
                    sala=c.get("room"),
                    enlace=c.get("alternateLink"),
                    estado=c.get("courseState", "ACTIVE"),
                )
                for c in cursos_crudos
            ]
            self._cache.guardar(clave_cache, clases)
            return clases
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_GOOGLE, detalle=str(e))

    def listar_tareas_de_clase(self, id_clase: str, config: ConfiguracionSistema) -> List[TareaClassroom]:
        try:
            servicio = FabricaClientesGoogle.construir_servicio_classroom(config)
            peticion = servicio.courses().courseWork().list(
                courseId=id_clase,
                courseWorkStates=["PUBLISHED"],
            )
            resultado = peticion.execute()
            tareas_crudas = resultado.get("courseWork", [])

            tareas = []
            for t in tareas_crudas:
                fecha_limite = None
                due_date = t.get("dueDate")
                due_time = t.get("dueTime", {})
                if due_date:
                    try:
                        fecha_limite = datetime(
                            year=due_date.get("year", 2026),
                            month=due_date.get("month", 1),
                            day=due_date.get("day", 1),
                            hour=due_time.get("hours", 23),
                            minute=due_time.get("minutes", 59),
                        )
                    except Exception:
                        fecha_limite = None

                tareas.append(
                    TareaClassroom(
                        id=t.get("id"),
                        id_clase=id_clase,
                        titulo=t.get("title", ""),
                        descripcion=t.get("description"),
                        id_tema=t.get("topicId"),
                        fecha_limite=fecha_limite,
                        puntaje_maximo=t.get("maxPoints"),
                        estado=t.get("state", "PUBLISHED"),
                        enlace=t.get("alternateLink"),
                    )
                )
            return tareas
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_GOOGLE, detalle=str(e))

    def listar_temas_de_clase(self, id_clase: str, config: ConfiguracionSistema) -> List[TemaClassroom]:
        try:
            servicio = FabricaClientesGoogle.construir_servicio_classroom(config)
            peticion = servicio.courses().topics().list(courseId=id_clase)
            resultado = peticion.execute()
            temas_crudos = resultado.get("topic", [])
            return [
                TemaClassroom(
                    id=t.get("topicId"),
                    id_clase=id_clase,
                    nombre=t.get("name", ""),
                )
                for t in temas_crudos
            ]
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_GOOGLE, detalle=str(e))

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
        try:
            servicio = FabricaClientesGoogle.construir_servicio_classroom(config)
            cuerpo: dict[str, Any] = {
                "title": titulo,
                "state": "PUBLISHED",
                "workType": "ASSIGNMENT",
            }
            if descripcion:
                cuerpo["description"] = descripcion
            if id_tema:
                cuerpo["topicId"] = id_tema
            if puntaje_maximo is not None:
                cuerpo["maxPoints"] = puntaje_maximo

            if enlace_plantilla:
                cuerpo["materials"] = [{"link": {"url": enlace_plantilla}}]

            if fecha_limite:
                try:
                    dt = datetime.fromisoformat(fecha_limite.replace("Z", "+00:00"))
                    cuerpo["dueDate"] = {"year": dt.year, "month": dt.month, "day": dt.day}
                    cuerpo["dueTime"] = {"hours": dt.hour, "minutes": dt.minute}
                except Exception:
                    pass

            peticion = servicio.courses().courseWork().create(courseId=id_clase, body=cuerpo)
            creada = peticion.execute()

            self._cache.invalidar_todo()

            return TareaClassroom(
                id=creada.get("id"),
                id_clase=id_clase,
                titulo=creada.get("title", titulo),
                descripcion=creada.get("description"),
                id_tema=creada.get("topicId"),
                puntaje_maximo=creada.get("maxPoints"),
                estado=creada.get("state", "PUBLISHED"),
                enlace=creada.get("alternateLink"),
            )
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_GOOGLE, detalle=str(e))

    def archivar_clase(self, id_clase: str, config: ConfiguracionSistema) -> None:
        try:
            servicio = FabricaClientesGoogle.construir_servicio_classroom(config)
            cuerpo = {"courseState": "ARCHIVED"}
            servicio.courses().patch(id=id_clase, updateMask="courseState", body=cuerpo).execute()
            self._cache.invalidar_todo()
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_GOOGLE, detalle=str(e))
