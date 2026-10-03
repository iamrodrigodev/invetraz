import click
import uvicorn
from sqlalchemy import text
from invetraz.config import get_settings
from invetraz.dominio.entidades.usuario import Usuario
from invetraz.dominio.excepciones.base import ExcepcionDominio
from invetraz.infraestructura.base_de_datos.sesion import FabricaSesion, motor_db
from invetraz.infraestructura.base_de_datos.repositorios import RepositorioUsuariosSqlAlchemy
from invetraz.infraestructura.seguridad import AdaptadorHashPassword

@click.group()
def cli():
    """Herramienta de administración y gestión para Invetraz (Sistema de Investigación)."""
    pass

@cli.command("run")
@click.option("--host", default=None, help="Dirección IP del servidor.")
@click.option("--port", default=None, type=int, help="Puerto del servidor HTTP.")
@click.option("--reload", is_flag=True, default=False, help="Habilita hot-reloading para desarrollo.")
@click.option("--workers", default=1, type=int, help="Número de workers Uvicorn.")
def ejecutar_servidor(host: str | None, port: int | None, reload: bool, workers: int):
    """Inicia el servidor web FastAPI con Uvicorn."""
    settings = get_settings()
    host_final = host or settings.host
    port_final = port or settings.port

    click.echo(f"🚀 Iniciando Invetraz en http://{host_final}:{port_final}")
    uvicorn.run(
        "invetraz.fabrica_aplicacion:create_app",
        factory=True,
        host=host_final,
        port=port_final,
        reload=reload,
        workers=workers if not reload else 1,
    )

def _obtener_config_alembic():
    from pathlib import Path
    from alembic.config import Config
    posibles_rutas = [
        Path.cwd() / "alembic.ini",
        Path(__file__).resolve().parent.parent / "alembic.ini",
        Path("/app/alembic.ini"),
    ]
    for ruta in posibles_rutas:
        if ruta.is_file():
            return Config(str(ruta))
    return Config("alembic.ini")

@cli.command("init")
def inicializar_base_de_datos():
    """Crea los esquemas e inicializa las tablas de Invetraz (estilo Apache Superset)."""
    click.echo("📦 Inicializando esquemas de base de datos en PostgreSQL...")
    with motor_db.connect() as conexion:
        conexion.execute(text("CREATE SCHEMA IF NOT EXISTS auth;"))
        conexion.execute(text("CREATE SCHEMA IF NOT EXISTS configuracion;"))
        conexion.execute(text("CREATE SCHEMA IF NOT EXISTS seguimiento;"))
        conexion.commit()
    click.echo("✅ Esquemas creados o verificados exitosamente.")

    click.echo("🔄 Aplicando migraciones de base de datos (Alembic)...")
    try:
        from alembic import command
        cfg = _obtener_config_alembic()
        command.upgrade(cfg, "head")
        click.echo("✅ Migraciones de Alembic aplicadas exitosamente.")
    except Exception as e:
        click.echo(f"⚠️ Aviso al ejecutar Alembic: {e}. Intentando sincronización directa con SQLAlchemy...")
        from invetraz.infraestructura.base_de_datos.sesion import Base
        import invetraz.infraestructura.base_de_datos.modelos
        Base.metadata.create_all(bind=motor_db)
        click.echo("✅ Tablas sincronizadas con SQLAlchemy.")

@cli.group("db")
def grupo_db():
    """Comandos para gestión de migraciones de base de datos."""
    pass

@grupo_db.command("upgrade")
def db_upgrade():
    """Aplica todas las migraciones pendientes hasta 'head'."""
    from alembic import command
    cfg = _obtener_config_alembic()
    click.echo("🔄 Ejecutando migraciones de base de datos...")
    command.upgrade(cfg, "head")
    click.echo("✅ Base de datos actualizada a 'head'.")

@grupo_db.command("migrate")
@click.option("-m", "--mensaje", required=True, help="Descripción del cambio.")
def db_migrate(mensaje: str):
    """Genera una nueva revisión de migración con autogenerate."""
    from alembic import command
    cfg = _obtener_config_alembic()
    click.echo(f"📝 Generando migración: {mensaje}...")
    command.revision(cfg, autogenerate=True, message=mensaje)
    click.echo("✅ Migración generada.")

@cli.command("create-admin")
@click.option("--email", prompt="Correo del Administrador", help="Correo electrónico del administrador.")
@click.option(
    "--password",
    prompt="Contraseña",
    hide_input=True,
    confirmation_prompt=True,
    help="Contraseña para el administrador.",
)
def crear_admin(email: str, password: str):
    """Crea un usuario administrador inicial desde la terminal."""
    sesion = FabricaSesion()
    try:
        repo = RepositorioUsuariosSqlAlchemy(sesion)
        hash_service = AdaptadorHashPassword()

        from invetraz.aplicacion.comandos.setup import ComandoCrearAdmin
        comando = ComandoCrearAdmin(email=email, password=password, repo_usuarios=repo, servicio_hash=hash_service)
        usuario = comando.run()
        click.echo(f"✅ Administrador {usuario.email} creado con ID: {usuario.id}")
    except ExcepcionDominio as e:
        click.echo(f"❌ Error: {e.mensaje}", err=True)
    finally:
        sesion.close()

def main():
    cli()

if __name__ == "__main__":
    main()
