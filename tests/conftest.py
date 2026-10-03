import uuid
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
from invetraz.fabrica_aplicacion import create_app
from invetraz.infraestructura.base_de_datos.sesion import Base, obtener_sesion_db
from invetraz.infraestructura.base_de_datos.repositorios import RepositorioUsuariosSqlAlchemy
from invetraz.infraestructura.seguridad import AdaptadorCriptografiaAesGcm, AdaptadorHashPassword
from invetraz.dominio.entidades.usuario import Usuario

CLAVE_MAESTRA_TEST = "clave_maestra_de_prueba_con_mas_de_32_caracteres_12345"

@pytest.fixture(name="db_sesion")
def fixture_db_sesion():
    motor = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    for tabla in Base.metadata.tables.values():
        tabla.schema = None

    Base.metadata.create_all(bind=motor)
    Fabrica = sessionmaker(autocommit=False, autoflush=False, bind=motor)
    sesion = Fabrica()

    try:
        yield sesion
    finally:
        sesion.close()
        Base.metadata.drop_all(bind=motor)

@pytest.fixture(name="cliente_http")
def fixture_cliente_http(db_sesion: Session):
    app = create_app()
    app.dependency_overrides[obtener_sesion_db] = lambda: db_sesion
    with TestClient(app) as cliente:
        yield cliente
    app.dependency_overrides.clear()

@pytest.fixture(name="usuario_admin")
def fixture_usuario_admin(db_sesion: Session):
    repo = RepositorioUsuariosSqlAlchemy(db_sesion)
    hasher = AdaptadorHashPassword()
    usuario = Usuario(
        id=uuid.uuid4(),
        email="admin@ulasalle.edu.pe",
        password=hasher.hash("claveSegura123"),
    )
    return repo.guardar(usuario)
