import pytest
from invetraz.infraestructura.seguridad.encriptador_aes_gcm import AdaptadorCriptografiaAesGcm

CLAVE_MAESTRA = "super_secret_master_key_for_aes_encryption_long"

def test_encriptar_y_desencriptar_correctamente():
    encriptador = AdaptadorCriptografiaAesGcm(CLAVE_MAESTRA)
    texto_original = "1//04_abcdef123456789_refresh_token_secreto"

    cifrado = encriptador.encriptar(texto_original)
    assert cifrado is not None
    assert cifrado != texto_original

    desencriptado = encriptador.desencriptar(cifrado)
    assert desencriptado == texto_original

def test_manejo_de_nulos_y_vacios():
    encriptador = AdaptadorCriptografiaAesGcm(CLAVE_MAESTRA)
    assert encriptador.encriptar(None) is None
    assert encriptador.desencriptar(None) is None
    assert encriptador.desencriptar("") is None

def test_error_con_clave_corta():
    with pytest.raises(ValueError, match="al menos 32 caracteres"):
        AdaptadorCriptografiaAesGcm("corta")

def test_error_con_texto_cifrado_corrupto():
    encriptador = AdaptadorCriptografiaAesGcm(CLAVE_MAESTRA)
    with pytest.raises(ValueError):
        encriptador.desencriptar("texto_invalido_que_no_es_base64_valido!!!")
