"""Rutas de inicialización y setup de Invetraz."""

from fastapi import APIRouter
from invetraz.aplicacion.comandos.setup import ComandoCrearAdmin, ComandoObtenerEstadoSetup
from invetraz.infraestructura.api.dependencias import RepoUsuariosDep, ServicioHashDep
from invetraz.infraestructura.api.esquemas import (
    ApiRespuesta,
    CrearAdminPeticion,
    EstadoSetupRespuesta,
)

enrutador = APIRouter(prefix="/setup", tags=["Setup"])


@enrutador.get("/estado", response_model=ApiRespuesta[EstadoSetupRespuesta])
def obtener_estado_setup(repo_usuarios: RepoUsuariosDep):
    comando = ComandoObtenerEstadoSetup(repo_usuarios=repo_usuarios)
    resultado = comando.run()
    return ApiRespuesta.exitoso(
        mensaje="Estado del sistema consultado",
        datos=EstadoSetupRespuesta(adminConfigurado=resultado.admin_configurado),
    )


@enrutador.post("/crear-admin", response_model=ApiRespuesta[None])
def crear_admin(
    peticion: CrearAdminPeticion,
    repo_usuarios: RepoUsuariosDep,
    servicio_hash: ServicioHashDep,
):
    comando = ComandoCrearAdmin(
        email=peticion.email,
        password=peticion.password,
        repo_usuarios=repo_usuarios,
        servicio_hash=servicio_hash,
    )
    comando.run()
    return ApiRespuesta.exitoso(
        mensaje="Administrador creado exitosamente",
        codigo=201,
    )
