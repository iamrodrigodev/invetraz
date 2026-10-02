"""Pruebas unitarias de los Comandos de la Capa de Aplicación."""

import uuid
import pytest
from unittest.mock import MagicMock
from inveli.aplicacion.comandos.autenticacion import (
    ComandoCambiarPassword,
    ComandoLogin,
    ComandoVerificarPassword,
)
from inveli.aplicacion.comandos.configuracion import (
    ComandoGuardarConfiguracion,
    ComandoObtenerConfiguracion,
)
from inveli.aplicacion.comandos.setup import (
    ComandoCrearAdmin,
    ComandoObtenerEstadoSetup,
)
from inveli.aplicacion.comandos.plantillas import ComandoVincularCarpetaDrive
from inveli.dominio.excepciones.base import CodigosDeError, ExcepcionDominio
from inveli.infraestructura.base_de_datos.repositorios import (
    RepositorioConfiguracionSqlAlchemy,
    RepositorioUsuariosSqlAlchemy,
)
from inveli.infraestructura.seguridad import (
    AdaptadorCriptografiaAesGcm,
    AdaptadorHashPassword,
    AdaptadorLimitadorIntentos,
    AdaptadorTokenJwt,
)
from inveli.dominio.entidades.configuracion import ConfiguracionSistema


CLAVE_MAESTRA = "super_secret_master_key_for_aes_encryption_long"


def test_flujo_setup_y_creacion_admin(db_sesion):
    repo_usuarios = RepositorioUsuariosSqlAlchemy(db_sesion)
    hasher = AdaptadorHashPassword()

    # 1. Al inicio adminConfigurado debe ser falso
    cmd_estado = ComandoObtenerEstadoSetup(repo_usuarios)
    assert cmd_estado.run().admin_configurado is False

    # 2. Crear administrador exitosamente con cualquier dominio (sin restricción institucional)
    cmd_crear = ComandoCrearAdmin(
        email="admin@cualquiera.org",
        password="claveSegura123",
        repo_usuarios=repo_usuarios,
        servicio_hash=hasher,
    )
    admin = cmd_crear.run()
    assert admin.email == "admin@cualquiera.org"
    assert hasher.verificar("claveSegura123", admin.password) is True

    # 3. Ahora adminConfigurado debe ser verdadero
    assert cmd_estado.run().admin_configurado is True

    # 4. Intentar crear otro admin debe fallar con ADMIN_YA_CONFIGURADO
    cmd_duplicado = ComandoCrearAdmin(
        email="otro@dominio.com",
        password="claveSegura123",
        repo_usuarios=repo_usuarios,
        servicio_hash=hasher,
    )
    with pytest.raises(ExcepcionDominio) as exc_info:
        cmd_duplicado.run()
    assert exc_info.value.error == CodigosDeError.ADMIN_YA_CONFIGURADO


def test_flujo_login_y_cambio_password(db_sesion, usuario_admin):
    repo_usuarios = RepositorioUsuariosSqlAlchemy(db_sesion)
    hasher = AdaptadorHashPassword()
    jwt_serv = AdaptadorTokenJwt("secreto_largo_de_jwt_para_pruebas_unitarias")
    limitador = AdaptadorLimitadorIntentos()

    # 1. Login exitoso
    cmd_login = ComandoLogin(
        email="admin@ulasalle.edu.pe",
        password="claveSegura123",
        ip_cliente="127.0.0.1",
        repo_usuarios=repo_usuarios,
        servicio_hash=hasher,
        servicio_jwt=jwt_serv,
        limitador=limitador,
    )
    res_login = cmd_login.run()
    assert res_login.email == "admin@ulasalle.edu.pe"
    assert res_login.token is not None

    # 2. Login con contraseña incorrecta falla
    cmd_login_invalido = ComandoLogin(
        email="admin@ulasalle.edu.pe",
        password="clave_erronea",
        ip_cliente="127.0.0.1",
        repo_usuarios=repo_usuarios,
        servicio_hash=hasher,
        servicio_jwt=jwt_serv,
        limitador=limitador,
    )
    with pytest.raises(ExcepcionDominio) as exc_info:
        cmd_login_invalido.run()
    assert exc_info.value.error == CodigosDeError.CREDENCIALES_INVALIDAS

    # 3. Cambiar contraseña
    cmd_cambiar = ComandoCambiarPassword(
        id_usuario=usuario_admin.id,
        password_actual="claveSegura123",
        password_nueva="nuevaClaveSuperSegura456",
        ip_cliente="127.0.0.1",
        repo_usuarios=repo_usuarios,
        servicio_hash=hasher,
        limitador=limitador,
    )
    cmd_cambiar.run()

    # 4. Verificar que la nueva contraseña funciona en login
    cmd_login_nuevo = ComandoLogin(
        email="admin@ulasalle.edu.pe",
        password="nuevaClaveSuperSegura456",
        ip_cliente="127.0.0.1",
        repo_usuarios=repo_usuarios,
        servicio_hash=hasher,
        servicio_jwt=jwt_serv,
        limitador=limitador,
    )
    assert cmd_login_nuevo.run().email == "admin@ulasalle.edu.pe"


def test_guardar_y_obtener_configuracion(db_sesion):
    crypto = AdaptadorCriptografiaAesGcm(CLAVE_MAESTRA)
    repo_config = RepositorioConfiguracionSqlAlchemy(db_sesion, crypto)

    cmd_guardar = ComandoGuardarConfiguracion(
        client_id="google-client-id-123.apps.googleusercontent.com",
        client_secret="GOCSPX-secret-secreto",
        refresh_token="1//04_refresh_token_secreto",
        repo_config=repo_config,
    )
    guardada = cmd_guardar.run()
    assert guardada.google_client_id == "google-client-id-123.apps.googleusercontent.com"
    assert guardada.google_verificado is False

    cmd_obtener = ComandoObtenerConfiguracion(repo_config)
    obtenida = cmd_obtener.run()
    assert obtenida is not None
    assert obtenida.google_client_secret == "GOCSPX-secret-secreto"
    assert obtenida.google_refresh_token == "1//04_refresh_token_secreto"


def test_vincular_carpeta_drive_exitoso(db_sesion):
    crypto = AdaptadorCriptografiaAesGcm(CLAVE_MAESTRA)
    repo_config = RepositorioConfiguracionSqlAlchemy(db_sesion, crypto)

    # Configuración previamente verificada
    config = ConfiguracionSistema(
        id=uuid.uuid4(),
        google_client_id="id",
        google_client_secret="secret",
        google_refresh_token="token",
        google_verificado=True,
    )
    repo_config.guardar(config)

    # Mock de servicio drive
    mock_drive = MagicMock()
    mock_drive.verificar_y_obtener_nombre_carpeta.return_value = "Plantillas 2026"
    mock_drive.extraer_id_carpeta.return_value = "carpeta-drive-id-xyz"

    cmd = ComandoVincularCarpetaDrive(
        id_o_enlace="https://drive.google.com/drive/folders/carpeta-drive-id-xyz",
        repo_config=repo_config,
        servicio_drive=mock_drive,
    )
    resultado = cmd.run()

    assert resultado.id_carpeta == "carpeta-drive-id-xyz"
    assert resultado.nombre_carpeta == "Plantillas 2026"

    # Verificar que quedó guardado en base de datos
    actualizada = repo_config.obtener()
    assert actualizada.google_drive_folder_id == "carpeta-drive-id-xyz"
    assert actualizada.google_drive_folder_name == "Plantillas 2026"
    assert actualizada.drive_verificado is True
