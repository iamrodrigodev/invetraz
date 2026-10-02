"""Pruebas unitarias de seguridad: BCrypt, JWT y Limitador de Intentos."""

import uuid
import pytest
from invetraz.dominio.excepciones.base import CodigosDeError, ExcepcionDominio
from invetraz.infraestructura.seguridad.servicio_password import AdaptadorHashPassword
from invetraz.infraestructura.seguridad.servicio_jwt import AdaptadorTokenJwt
from invetraz.infraestructura.seguridad.limitador_intentos import AdaptadorLimitadorIntentos


def test_hashing_y_verificacion_password():
    hasher = AdaptadorHashPassword()
    clave_original = "MiContraseñaSuperSegura_2026!"

    hash_generado = hasher.hash(clave_original)
    assert hash_generado.startswith("$2")

    assert hasher.verificar(clave_original, hash_generado) is True
    assert hasher.verificar("clave_incorrecta", hash_generado) is False


def test_generacion_y_validacion_jwt():
    servicio = AdaptadorTokenJwt(clave_secreta="clave_secreta_jwt_para_pruebas_que_sea_larga", duracion_segundos=60)
    id_usuario = uuid.uuid4()

    token = servicio.generar_token(id_usuario, rol="ADMIN")
    assert isinstance(token, str)

    payload = servicio.validar_y_obtener_payload(token)
    assert payload is not None
    assert payload["sub"] == str(id_usuario)
    assert payload["rol"] == "ADMIN"
    assert payload["tipo"] == "acceso"


def test_jwt_invalido():
    servicio = AdaptadorTokenJwt(clave_secreta="clave_secreta_jwt_para_pruebas_que_sea_larga", duracion_segundos=60)
    assert servicio.validar_y_obtener_payload("token.invalido.123") is None


def test_limitador_de_intentos_bloqueo():
    limitador = AdaptadorLimitadorIntentos()
    clave = "login:127.0.0.1:admin@ulasalle.edu.pe"

    # Intentos 1 a 4: no deben lanzar excepción
    for _ in range(4):
        limitador.registrar_fallo(clave, max_intentos=5, ventana_segundos=60)

    # El 5to intento debe disparar bloqueo
    with pytest.raises(ExcepcionDominio) as exc_info:
        limitador.registrar_fallo(clave, max_intentos=5, ventana_segundos=60)
    assert exc_info.value.error == CodigosDeError.DEMASIADOS_INTENTOS_LOGIN

    # Llamadas subsecuentes a comprobar_bloqueo deben rechazar la petición
    with pytest.raises(ExcepcionDominio):
        limitador.comprobar_bloqueo(clave)

    # Limpiar intentos y verificar que ya no está bloqueado
    limitador.limpiar_intentos(clave)
    limitador.comprobar_bloqueo(clave)
