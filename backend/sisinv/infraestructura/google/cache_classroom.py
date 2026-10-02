"""Caché en memoria con tiempo de vida (TTL) para consultas a Google Classroom."""

from typing import Any, Dict, Optional
from cachetools import TTLCache


class CacheClassroom:
    """Almacena en memoria las listas de clases durante 60 segundos."""

    def __init__(self, maxsize: int = 100, ttl_segundos: float = 60.0):
        self._cache: TTLCache = TTLCache(maxsize=maxsize, ttl=ttl_segundos)

    def obtener(self, clave: str) -> Optional[Any]:
        return self._cache.get(clave)

    def guardar(self, clave: str, valor: Any) -> None:
        self._cache[clave] = valor

    def invalidar_todo(self) -> None:
        self._cache.clear()
