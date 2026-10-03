from typing import List, Optional
import uuid
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from invetraz.dominio.entidades.actividad import ActividadSeguimiento
from invetraz.infraestructura.base_de_datos.modelos.actividad_modelo import ActividadSeguimientoModelo

class RepositorioActividadesSqlAlchemy:
    def __init__(self, sesion: Session):
        self._sesion = sesion

    def _a_dominio(self, modelo: ActividadSeguimientoModelo) -> ActividadSeguimiento:
        return ActividadSeguimiento(
            id=modelo.id,
            id_tarea_classroom=modelo.id_tarea_classroom,
            id_clase_classroom=modelo.id_clase_classroom,
            nombre_clase=modelo.nombre_clase,
            id_tema_classroom=modelo.id_tema_classroom,
            nombre_tema=modelo.nombre_tema,
            id_plantilla_drive=modelo.id_plantilla_drive,
            nombre_plantilla=modelo.nombre_plantilla,
            enlace_plantilla=modelo.enlace_plantilla,
            titulo=modelo.titulo,
            descripcion=modelo.descripcion,
            fecha_limite=modelo.fecha_limite,
            puntaje_maximo=modelo.puntaje_maximo,
            estado=modelo.estado,
            enlace_tarea=modelo.enlace_tarea,
            fecha_creacion=modelo.fecha_creacion,
        )

    def obtener_por_id_tarea(self, id_tarea: str) -> Optional[ActividadSeguimiento]:
        sentencia = select(ActividadSeguimientoModelo).where(
            ActividadSeguimientoModelo.id_tarea_classroom == id_tarea
        )
        modelo = self._sesion.scalars(sentencia).first()
        return self._a_dominio(modelo) if modelo else None

    def listar_todas_ordenadas(self) -> List[ActividadSeguimiento]:
        sentencia = select(ActividadSeguimientoModelo).order_by(
            ActividadSeguimientoModelo.fecha_creacion.desc()
        )
        modelos = self._sesion.scalars(sentencia).all()
        return [self._a_dominio(m) for m in modelos]

    def guardar_o_actualizar(self, actividad: ActividadSeguimiento) -> ActividadSeguimiento:
        sentencia = select(ActividadSeguimientoModelo).where(
            ActividadSeguimientoModelo.id_tarea_classroom == actividad.id_tarea_classroom
        )
        modelo = self._sesion.scalars(sentencia).first()

        if modelo is None:
            modelo = ActividadSeguimientoModelo(
                id=actividad.id or uuid.uuid4(),
                id_tarea_classroom=actividad.id_tarea_classroom,
                id_clase_classroom=actividad.id_clase_classroom,
                nombre_clase=actividad.nombre_clase,
                id_tema_classroom=actividad.id_tema_classroom,
                nombre_tema=actividad.nombre_tema,
                id_plantilla_drive=actividad.id_plantilla_drive,
                nombre_plantilla=actividad.nombre_plantilla,
                enlace_plantilla=actividad.enlace_plantilla,
                titulo=actividad.titulo,
                descripcion=actividad.descripcion,
                fecha_limite=actividad.fecha_limite,
                puntaje_maximo=actividad.puntaje_maximo,
                estado=actividad.estado,
                enlace_tarea=actividad.enlace_tarea,
            )
            self._sesion.add(modelo)
        else:
            modelo.id_clase_classroom = actividad.id_clase_classroom
            modelo.nombre_clase = actividad.nombre_clase
            modelo.id_tema_classroom = actividad.id_tema_classroom
            modelo.nombre_tema = actividad.nombre_tema
            modelo.id_plantilla_drive = actividad.id_plantilla_drive
            modelo.nombre_plantilla = actividad.nombre_plantilla
            modelo.enlace_plantilla = actividad.enlace_plantilla
            modelo.titulo = actividad.titulo
            modelo.descripcion = actividad.descripcion
            modelo.fecha_limite = actividad.fecha_limite
            modelo.puntaje_maximo = actividad.puntaje_maximo
            modelo.estado = actividad.estado
            modelo.enlace_tarea = actividad.enlace_tarea

        self._sesion.commit()
        self._sesion.refresh(modelo)
        return self._a_dominio(modelo)

    def guardar_lote(self, actividades: List[ActividadSeguimiento]) -> None:
        for act in actividades:
            self.guardar_o_actualizar(act)

    def contar_usos_por_plantilla(self, id_plantilla: str) -> int:
        sentencia = (
            select(func.count(ActividadSeguimientoModelo.id))
            .where(ActividadSeguimientoModelo.id_plantilla_drive == id_plantilla)
        )
        total = self._sesion.scalar(sentencia)
        return total or 0
