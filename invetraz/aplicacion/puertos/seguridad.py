from typing import Any, Dict, Optional, Protocol
import uuid

class PuertoCriptografia(Protocol):
    """Contrato para cifrado simétrico de datos sensibles (tokens OAuth)."""

    def encriptar(self, texto_plano: Optional[str]) -> Optional[str]:
        ...

    def desencriptar(self, texto_cifrado: Optional[str]) -> Optional[str]:
        ...

class PuertoTokenJwt(Protocol):
    """Contrato para generación y validación de tokens JWT."""

    def generar_token(self, id_usuario: uuid.UUID, rol: str = "ADMIN") -> str:
        ...

    def validar_y_obtener_payload(self, token: str) -> Optional[Dict[str, Any]]:
        ...

class PuertoHashPassword(Protocol):
    """Contrato para verificación y hash seguro de contraseñas."""

    def hash(self, password_plana: str) -> str:
        ...

    def verificar(self, password_plana: str, password_hash: str) -> bool:
        ...

class PuertoLimitadorIntentos(Protocol):
    """Contrato para control de tasa (Rate Limiting) en autenticación."""

    def comprobar_bloqueo(self, clave: str) -> None:
        ...

    def registrar_fallo(self, clave: str, max_intentos: int, ventana_segundos: int) -> None:
        ...

    def limpiar_intentos(self, clave: str) -> None:
        ...
