from typing import Optional
from fastapi import APIRouter
from invetraz.aplicacion.comandos.configuracion import (
    ComandoGuardarConfiguracion,
    ComandoObtenerConfiguracion,
    ComandoVerificarConexionGoogle,
)
from invetraz.infraestructura.api.dependencias import (
    RepoConfigDep,
    ServicioDriveDep,
    UsuarioActualDep,
)
from invetraz.infraestructura.api.esquemas import (
    ActualizarCredencialesPeticion,
    ApiRespuesta,
    ConfiguracionSistemaDTO,
)

enrutador = APIRouter(prefix="/configuracion", tags=["Configuración"])

@enrutador.get("", response_model=ApiRespuesta[Optional[ConfiguracionSistemaDTO]])
def obtener_configuracion(
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
):
    comando = ComandoObtenerConfiguracion(repo_config=repo_config)
    res = comando.run()
    if not res:
        return ApiRespuesta.exitoso(mensaje="Configuración consultada", datos=None)

    dto = ConfiguracionSistemaDTO(
        id=res.id,
        googleClientId=res.google_client_id,
        googleClientSecret=res.google_client_secret,
        googleRefreshToken=res.google_refresh_token,
        googleDriveFolderId=res.google_drive_folder_id,
        googleDriveFolderName=res.google_drive_folder_name,
        googleVerificado=res.google_verificado,
        driveVerificado=res.drive_verificado,
    )
    return ApiRespuesta.exitoso(mensaje="Configuración consultada", datos=dto)

@enrutador.post("", response_model=ApiRespuesta[ConfiguracionSistemaDTO])
def guardar_configuracion(
    peticion: ActualizarCredencialesPeticion,
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
):
    comando = ComandoGuardarConfiguracion(
        client_id=peticion.clientId,
        client_secret=peticion.clientSecret,
        refresh_token=peticion.refreshToken,
        repo_config=repo_config,
    )
    res = comando.run()
    dto = ConfiguracionSistemaDTO(
        id=res.id,
        googleClientId=res.google_client_id,
        googleClientSecret=res.google_client_secret,
        googleRefreshToken=res.google_refresh_token,
        googleDriveFolderId=res.google_drive_folder_id,
        googleDriveFolderName=res.google_drive_folder_name,
        googleVerificado=res.google_verificado,
        driveVerificado=res.drive_verificado,
    )
    return ApiRespuesta.exitoso(mensaje="Configuración guardada exitosamente", datos=dto)

@enrutador.post("/verificar", response_model=ApiRespuesta[bool])
def verificar_conexion_google(
    _usuario: UsuarioActualDep,
    repo_config: RepoConfigDep,
    servicio_drive: ServicioDriveDep,
):
    comando = ComandoVerificarConexionGoogle(
        repo_config=repo_config,
        servicio_drive=servicio_drive,
    )
    valido = comando.run()
    return ApiRespuesta.exitoso(
        mensaje="Conexión con Google verificada exitosamente",
        datos=valido,
    )
