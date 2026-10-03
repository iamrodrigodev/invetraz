from fastapi import APIRouter
from invetraz.aplicacion.comandos.estado import ComandoVerificarReadiness
from invetraz.infraestructura.api.dependencias import RepoConfigDep
from invetraz.infraestructura.api.esquemas import ApiRespuesta, ReadinessRespuesta

enrutador = APIRouter(prefix="/estado", tags=["Estado"])

@enrutador.get("", response_model=ApiRespuesta[None])
def verificar_estado():
    return ApiRespuesta.exitoso(
        mensaje="El sistema de investigacion esta funcionando correctamente."
    )

@enrutador.get("/readiness", response_model=ApiRespuesta[ReadinessRespuesta])
def verificar_readiness(repo_config: RepoConfigDep):
    comando = ComandoVerificarReadiness(repo_config=repo_config)
    resultado = comando.run()
    return ApiRespuesta.exitoso(
        mensaje="Estado de readiness verificado",
        datos=ReadinessRespuesta(
            listo=resultado.listo,
            baseDeDatos=resultado.base_de_datos,
            googleCloud=resultado.google_cloud,
            googleDrive=resultado.google_drive,
        ),
    )
