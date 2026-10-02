"""Adaptador de Criptografía AES-256-GCM.
Totalmente compatible a nivel binario con AttributeEncryptor de Spring Boot.
"""

import base64
import os
from typing import Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class AdaptadorCriptografiaAesGcm:
    """Implementa PuertoCriptografia con AES-256-GCM y nonce de 12 bytes."""

    def __init__(self, clave_maestra: str):
        if not clave_maestra or len(clave_maestra) < 32:
            raise ValueError("La llave maestra debe tener al menos 32 caracteres.")
        self._clave = clave_maestra[:32].encode("utf-8")
        self._aesgcm = AESGCM(self._clave)

    def encriptar(self, texto_plano: Optional[str]) -> Optional[str]:
        if texto_plano is None:
            return None
        iv = os.urandom(12)  # 12 bytes IV
        datos = texto_plano.encode("utf-8")
        cifrado_y_tag = self._aesgcm.encrypt(iv, datos, None)
        cifrado_con_iv = iv + cifrado_y_tag
        return base64.b64encode(cifrado_con_iv).decode("utf-8")

    def desencriptar(self, texto_cifrado: Optional[str]) -> Optional[str]:
        if texto_cifrado is None or not texto_cifrado.strip():
            return None
        try:
            crudo = base64.b64decode(texto_cifrado)
            if len(crudo) < 28:  # 12 bytes IV + 16 bytes tag
                raise ValueError("Longitud de texto cifrado insuficiente.")
            iv = crudo[:12]
            cifrado_y_tag = crudo[12:]
            desencriptado = self._aesgcm.decrypt(iv, cifrado_y_tag, None)
            return desencriptado.decode("utf-8")
        except Exception as e:
            raise ValueError(f"Error al desencriptar el atributo: {e}") from e
