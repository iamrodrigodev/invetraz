import base64
import time
from typing import Any, Dict, Optional
import uuid
import jwt

class AdaptadorTokenJwt:
    """Implementa PuertoTokenJwt firmando tokens con HMAC-SHA256."""

    def __init__(self, clave_secreta: str, duracion_segundos: int = 3600):
        self._duracion_segundos = duracion_segundos
        try:
            decodificado = base64.b64decode(clave_secreta, validate=True)
            if len(decodificado) >= 32:
                self._clave_bytes = decodificado
            else:
                self._clave_bytes = clave_secreta.encode("utf-8")
        except Exception:
            self._clave_bytes = clave_secreta.encode("utf-8")

    def generar_token(self, id_usuario: uuid.UUID, rol: str = "ADMIN") -> str:
        ahora = int(time.time())
        payload = {
            "sub": str(id_usuario),
            "tipo": "acceso",
            "rol": rol,
            "iat": ahora,
            "exp": ahora + self._duracion_segundos,
        }
        return jwt.encode(payload, self._clave_bytes, algorithm="HS256")

    def validar_y_obtener_payload(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            return jwt.decode(token, self._clave_bytes, algorithms=["HS256"])
        except (jwt.PyJWTError, ValueError):
            return None
