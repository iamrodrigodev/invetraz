"""Pruebas de integración HTTP de la API REST FastAPI."""


def test_endpoint_estado(cliente_http):
    respuesta = cliente_http.get("/api/v1/estado")
    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["estado"] == 200
    assert "El sistema de investigacion esta funcionando correctamente." in cuerpo["mensaje"]


def test_endpoint_actuator_health(cliente_http):
    respuesta = cliente_http.get("/actuator/health")
    assert respuesta.status_code == 200
    assert respuesta.json() == {"status": "UP"}


def test_endpoint_setup_flujo_completo(cliente_http):
    # 1. Consultar estado setup (debe ser adminConfigurado: False)
    res_estado = cliente_http.get("/api/v1/setup/estado")
    assert res_estado.status_code == 200
    assert res_estado.json()["datos"]["adminConfigurado"] is False

    # 2. Crear admin
    res_crear = cliente_http.post(
        "/api/v1/setup/crear-admin",
        json={"email": "coordinador@ulasalle.edu.pe", "password": "superPassword2026!"},
    )
    assert res_crear.status_code == 200
    assert res_crear.json()["estado"] == 201

    # 3. Consultar nuevamente estado setup (debe ser adminConfigurado: True)
    res_estado_2 = cliente_http.get("/api/v1/setup/estado")
    assert res_estado_2.status_code == 200
    assert res_estado_2.json()["datos"]["adminConfigurado"] is True

    # 4. Intentar crear admin duplicado debe devolver 403
    res_duplicado = cliente_http.post(
        "/api/v1/setup/crear-admin",
        json={"email": "otro@ulasalle.edu.pe", "password": "superPassword2026!"},
    )
    assert res_duplicado.status_code == 403
    assert "El administrador ya ha sido configurado" in res_duplicado.json()["mensaje"]


def test_endpoint_auth_login_y_me(cliente_http):
    # Crear admin inicial
    cliente_http.post(
        "/api/v1/setup/crear-admin",
        json={"email": "docente@ulasalle.edu.pe", "password": "passwordSeguro123"},
    )

    # 1. Login exitoso
    res_login = cliente_http.post(
        "/api/v1/auth/login",
        json={"email": "docente@ulasalle.edu.pe", "password": "passwordSeguro123"},
    )
    assert res_login.status_code == 200
    assert "jwt" in res_login.cookies
    assert res_login.json()["datos"]["email"] == "docente@ulasalle.edu.pe"

    # 2. Validar sesión con /api/v1/auth/me enviando la cookie
    res_me = cliente_http.get("/api/v1/auth/me")
    assert res_me.status_code == 200
    cuerpo_me = res_me.json()
    assert cuerpo_me["datos"]["autenticado"] is True
    assert cuerpo_me["datos"]["email"] == "docente@ulasalle.edu.pe"

    # 3. Logout limpia la cookie
    res_logout = cliente_http.post("/api/v1/auth/logout")
    assert res_logout.status_code == 200
    # Cookie jwt debe estar vacía o eliminada del cliente
    assert cliente_http.cookies.get("jwt") in (None, "")


def test_endpoint_api_inexistente_retorna_404_json(cliente_http):
    respuesta = cliente_http.get("/api/v1/ruta-que-no-existe-en-el-sistema")
    assert respuesta.status_code == 404
    # Debe ser JSON estructurado, jamás HTML
    cuerpo = respuesta.json()
    assert cuerpo["estado"] == 404
