"""Adaptador en memoria para limitación de tasa de intentos (Rate Limiter).
Réplica exacta del comportamiento de ServicioLimitadorIntentos de Java.
"""

from dataclasses import dataclass
import threading
import time
from typing import Dict
from sisinv.dominio.excepciones.base import CodigosDeError, ExcepcionDominio


@dataclass
class _RegistroIntento:
    intentos: int
    inicio_ventana: float
    bloqueado_hasta: float


class AdaptadorLimitadorIntentos:
    """Implementa PuertoLimitadorIntentos con ventana deslizante thread-safe."""

    def __init__(self, umbral_limpieza: int = 500, tiempo_expiracion_segundos: float = 300.0):
        self._umbral_limpieza = umbral_limpieza
        self._tiempo_expiracion = tiempo_expiracion_segundos
        self._intentos: Dict[str, _RegistroIntento] = {}
        self._bloqueo = threading.Lock()

    def comprobar_bloqueo(self, clave: str) -> None:
        ahora = time.time()
        with self._bloqueo:
            registro = self._intentos.get(clave)
            if registro and ahora < registro.bloqueado_hasta:
                raise ExcepcionDominio(CodigosDeError.DEMASIADOS_INTENTOS_LOGIN)

    def registrar_fallo(self, clave: str, max_intentos: int = 5, ventana_segundos: int = 60) -> None:
        ahora = time.time()
        with self._bloqueo:
            registro = self._intentos.get(clave)
            if not registro:
                registro = _RegistroIntento(intentos=1, inicio_ventana=ahora, bloqueado_hasta=0.0)
                self._intentos[clave] = registro
                return

            if ahora < registro.bloqueado_hasta:
                raise ExcepcionDominio(CodigosDeError.DEMASIADOS_INTENTOS_LOGIN)

            if ahora - registro.inicio_ventana > ventana_segundos:
                registro.intentos = 1
                registro.inicio_ventana = ahora
            else:
                registro.intentos += 1

            if registro.intentos >= max_intentos:
                registro.bloqueado_hasta = ahora + ventana_segundos
                raise ExcepcionDominio(CodigosDeError.DEMASIADOS_INTENTOS_LOGIN)

            if len(self._intentos) > self._umbral_limpieza:
                self._limpiar_expirados(ahora)

    def limpiar_intentos(self, clave: str) -> None:
        with self._bloqueo:
            self._intentos.pop(clave, None)

    def _limpiar_expirados(self, ahora: float) -> None:
        claves_a_eliminar = [
            clave
            for clave, reg in self._intentos.items()
            if ahora > reg.bloqueado_hasta and (ahora - reg.inicio_ventana) > self._tiempo_expiracion
        ]
        for clave in claves_a_eliminar:
            self._intentos.pop(clave, None)
