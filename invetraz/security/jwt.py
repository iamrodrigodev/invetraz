import base64
import time
from typing import Any, Dict, Optional
import jwt

class JWTService:
    def __init__(self, secret: str, expiration_seconds: int = 3600):
        self.expiration_seconds = expiration_seconds
        try:
            decoded = base64.b64decode(secret, validate=True)
            if len(decoded) >= 32:
                self.secret_bytes = decoded
            else:
                self.secret_bytes = secret.encode("utf-8")
        except Exception:
            self.secret_bytes = secret.encode("utf-8")

    def generar_token_acceso(self, user_id: str, rol: str = "ADMIN") -> str:
        ahora = int(time.time())
        payload = {
            "sub": str(user_id),
            "tipo": "acceso",
            "rol": rol,
            "iat": ahora,
            "exp": ahora + self.expiration_seconds,
        }
        return jwt.encode(payload, self.secret_bytes, algorithm="HS256")

    def obtener_payload(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            return jwt.decode(token, self.secret_bytes, algorithms=["HS256"])
        except (jwt.PyJWTError, ValueError):
            return None
