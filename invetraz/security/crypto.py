"""Módulo de cifrado AES-256-GCM.
Totalmente compatible a nivel binario con el AttributeEncryptor de Spring Boot.
Permite leer y escribir los tokens de Google encriptados en la base de datos sin alterar ningún dato existente.
"""

import base64
import os
from typing import Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class AttributeEncryptor:
    """Encriptador y desencriptador simétrico AES-256-GCM idéntico a Java."""

    def __init__(self, master_key: str):
        if not master_key or len(master_key) < 32:
            raise ValueError("La llave maestra debe tener al menos 32 caracteres.")
        # Utilizar exactamente los primeros 32 bytes en codificación UTF-8
        self._key = master_key[:32].encode("utf-8")
        self._aesgcm = AESGCM(self._key)

    def encrypt(self, plain_text: Optional[str]) -> Optional[str]:
        """Encripta una cadena de texto en formato Base64(IV_12_bytes + Ciphertext + Tag_16_bytes)."""
        if plain_text is None:
            return None
        iv = os.urandom(12)  # 12 bytes nonce/IV
        data = plain_text.encode("utf-8")
        ciphertext_and_tag = self._aesgcm.encrypt(iv, data, None)
        cipher_with_iv = iv + ciphertext_and_tag
        return base64.b64encode(cipher_with_iv).decode("utf-8")

    def decrypt(self, encrypted_b64: Optional[str]) -> Optional[str]:
        """Desencripta un texto cifrado en Base64."""
        if encrypted_b64 is None or not encrypted_b64.strip():
            return None
        try:
            raw = base64.b64decode(encrypted_b64)
            if len(raw) < 28:  # 12 bytes IV + 16 bytes tag mínimo
                raise ValueError("Payload cifrado demasiado corto.")
            iv = raw[:12]
            ciphertext_and_tag = raw[12:]
            decrypted = self._aesgcm.decrypt(iv, ciphertext_and_tag, None)
            return decrypted.decode("utf-8")
        except Exception as e:
            raise ValueError(f"Error al desencriptar el atributo: {e}") from e
