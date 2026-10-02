"""Adaptador para Google Drive API implementando PuertoGoogleDrive."""

import re
from typing import List, Optional
from googleapiclient.errors import HttpError
from inveli.dominio.entidades.configuracion import ConfiguracionSistema
from inveli.dominio.entidades.plantilla import PlantillaXlsx
from inveli.dominio.excepciones.base import CodigosDeError, ExcepcionDominio
from inveli.infraestructura.google.fabrica_clientes import FabricaClientesGoogle


class AdaptadorGoogleDrive:
    """Implementa operaciones con Google Drive API para carpetas y plantillas Excel."""

    PATRON_URL_CARPETA = re.compile(r"/folders/([a-zA-Z0-9_-]+)")
    PATRON_URL_ID = re.compile(r"[?&]id=([a-zA-Z0-9_-]+)")

    @classmethod
    def extraer_id_carpeta(cls, id_o_enlace: str) -> str:
        if not id_o_enlace or not id_o_enlace.strip():
            raise ExcepcionDominio(CodigosDeError.CARPETA_DRIVE_ID_INVALIDO)

        texto = id_o_enlace.strip()
        coincidencia = cls.PATRON_URL_CARPETA.search(texto)
        if coincidencia:
            return coincidencia.group(1)

        coincidencia_id = cls.PATRON_URL_ID.search(texto)
        if coincidencia_id:
            return coincidencia_id.group(1)

        # Si no tiene barras ni parámetros, tomar directamente como ID
        if "/" not in texto and "?" not in texto:
            return texto

        raise ExcepcionDominio(CodigosDeError.CARPETA_DRIVE_ID_INVALIDO)

    def _mapear_error_http(self, error: HttpError) -> ExcepcionDominio:
        codigo = error.resp.status
        if codigo == 403:
            return ExcepcionDominio(CodigosDeError.ACCESO_DENEGADO_DRIVE)
        elif codigo == 404:
            return ExcepcionDominio(CodigosDeError.CARPETA_DRIVE_NO_ENCONTRADA)
        elif codigo == 502:
            return ExcepcionDominio(CodigosDeError.ERROR_CONEXION_DRIVE)
        elif codigo == 503:
            return ExcepcionDominio(CodigosDeError.ERROR_CONSULTA_DRIVE)
        return ExcepcionDominio(CodigosDeError.ERROR_CONEXION_DRIVE, detalle=str(error))

    def verificar_y_obtener_nombre_carpeta(self, id_o_enlace: str, config: ConfiguracionSistema) -> str:
        id_carpeta = self.extraer_id_carpeta(id_o_enlace)

        try:
            servicio = FabricaClientesGoogle.construir_servicio_drive(config)
            peticion = servicio.files().get(
                fileId=id_carpeta,
                fields="id, name, mimeType, trashed",
                supportsAllDrives=True,
            )
            archivo = peticion.execute()

            if archivo.get("trashed"):
                raise ExcepcionDominio(CodigosDeError.CARPETA_DRIVE_EN_PAPELERA)

            if archivo.get("mimeType") != "application/vnd.google-apps.folder":
                raise ExcepcionDominio(CodigosDeError.ENLACE_DRIVE_NO_ES_CARPETA)

            nombre = archivo.get("name")
            if not nombre:
                raise ExcepcionDominio(CodigosDeError.CARPETA_DRIVE_NO_ENCONTRADA)

            return nombre
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_CONEXION_DRIVE, detalle=str(e))

    def listar_plantillas_xlsx(self, id_carpeta: str, config: ConfiguracionSistema) -> List[PlantillaXlsx]:
        id_limpio = self.extraer_id_carpeta(id_carpeta)

        try:
            servicio = FabricaClientesGoogle.construir_servicio_drive(config)
            consulta = (
                f"'{id_limpio}' in parents and "
                "mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' and "
                "trashed = false"
            )
            peticion = servicio.files().list(
                q=consulta,
                fields="files(id, name, webViewLink, webContentLink)",
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            resultado = peticion.execute()
            archivos = resultado.get("files", [])

            plantillas = []
            for a in archivos:
                plantillas.append(
                    PlantillaXlsx(
                        id=a.get("id"),
                        nombre=a.get("name"),
                        enlace_web=a.get("webViewLink"),
                        enlace_descarga=a.get("webContentLink"),
                    )
                )
            return plantillas
        except HttpError as e:
            raise self._mapear_error_http(e)
        except Exception as e:
            if isinstance(e, ExcepcionDominio):
                raise
            raise ExcepcionDominio(CodigosDeError.ERROR_LISTAR_ARCHIVOS_DRIVE, detalle=str(e))

    def verificar_conexion(self, config: ConfiguracionSistema) -> bool:
        try:
            servicio = FabricaClientesGoogle.construir_servicio_drive(config)
            servicio.files().list(pageSize=1).execute()
            return True
        except Exception:
            return False
