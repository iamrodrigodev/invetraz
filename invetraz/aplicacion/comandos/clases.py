from typing import List, Optional
from invetraz.aplicacion.comandos.base import ComandoBase
from invetraz.aplicacion.puertos.repositorios import PuertoRepositorioConfiguracion
from invetraz.aplicacion.puertos.google import PuertoGoogleClassroom
from invetraz.dominio.entidades.clase import ClaseClassroom, TareaClassroom, TemaClassroom
from invetraz.dominio.excepciones.base import CodigosDeError, ExcepcionDominio

class ComandoListarClasesDocente(ComandoBase[List[ClaseClassroom]]):
    def __init__(
        self,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_classroom: PuertoGoogleClassroom,
    ):
        self.repo_config = repo_config
        self.servicio_classroom = servicio_classroom

    def ejecutar(self) -> List[ClaseClassroom]:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)
        return self.servicio_classroom.listar_clases_como_docente(config)

class ComandoListarClasesAlumno(ComandoBase[List[ClaseClassroom]]):
    def __init__(
        self,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_classroom: PuertoGoogleClassroom,
    ):
        self.repo_config = repo_config
        self.servicio_classroom = servicio_classroom

    def ejecutar(self) -> List[ClaseClassroom]:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)
        return self.servicio_classroom.listar_clases_como_estudiante(config)

class ComandoListarTareas(ComandoBase[List[TareaClassroom]]):
    def __init__(
        self,
        id_clase: str,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_classroom: PuertoGoogleClassroom,
    ):
        self.id_clase = id_clase
        self.repo_config = repo_config
        self.servicio_classroom = servicio_classroom

    def ejecutar(self) -> List[TareaClassroom]:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)
        return self.servicio_classroom.listar_tareas_de_clase(self.id_clase, config)

class ComandoListarTemas(ComandoBase[List[TemaClassroom]]):
    def __init__(
        self,
        id_clase: str,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_classroom: PuertoGoogleClassroom,
    ):
        self.id_clase = id_clase
        self.repo_config = repo_config
        self.servicio_classroom = servicio_classroom

    def ejecutar(self) -> List[TemaClassroom]:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)
        return self.servicio_classroom.listar_temas_de_clase(self.id_clase, config)

class ComandoCrearTarea(ComandoBase[TareaClassroom]):
    def __init__(
        self,
        id_clase: str,
        titulo: str,
        descripcion: Optional[str],
        id_tema: Optional[str],
        enlace_plantilla: Optional[str],
        fecha_limite: Optional[str],
        puntaje_maximo: Optional[float],
        repo_config: PuertoRepositorioConfiguracion,
        servicio_classroom: PuertoGoogleClassroom,
    ):
        self.id_clase = id_clase
        self.titulo = titulo
        self.descripcion = descripcion
        self.id_tema = id_tema
        self.enlace_plantilla = enlace_plantilla
        self.fecha_limite = fecha_limite
        self.puntaje_maximo = puntaje_maximo
        self.repo_config = repo_config
        self.servicio_classroom = servicio_classroom

    def ejecutar(self) -> TareaClassroom:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)

        return self.servicio_classroom.crear_tarea(
            id_clase=self.id_clase,
            titulo=self.titulo,
            descripcion=self.descripcion,
            id_tema=self.id_tema,
            enlace_plantilla=self.enlace_plantilla,
            fecha_limite=self.fecha_limite,
            puntaje_maximo=self.puntaje_maximo,
            config=config,
        )

class ComandoArchivarClase(ComandoBase[None]):
    def __init__(
        self,
        id_clase: str,
        repo_config: PuertoRepositorioConfiguracion,
        servicio_classroom: PuertoGoogleClassroom,
    ):
        self.id_clase = id_clase
        self.repo_config = repo_config
        self.servicio_classroom = servicio_classroom

    def ejecutar(self) -> None:
        config = self.repo_config.obtener()
        if not config or not config.google_verificado:
            raise ExcepcionDominio(CodigosDeError.CREDENCIALES_GOOGLE_NO_VERIFICADAS)
        self.servicio_classroom.archivar_clase(self.id_clase, config)
