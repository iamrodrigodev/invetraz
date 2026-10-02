"""Puertos de Repositorio (Interfaces secundarias de persistencia).
Permiten desacoplar la lógica de aplicación del ORM SQLAlchemy.
"""

from typing import List, Optional, Protocol
import uuid
from inveli.dominio.entidades.usuario import Usuario
from inveli.dominio.entidades.configuracion import ConfiguracionSistema
from inveli.dominio.entidades.actividad import ActividadSeguimiento


class PuertoRepositorioUsuarios(Protocol):
    """Contrato para la persistencia de usuarios administradores."""

    def obtener_por_id(self, id_usuario: uuid.UUID) -> Optional[Usuario]:
        ...

    def obtener_por_email(self, email: str) -> Optional[Usuario]:
        ...

    def existe_algun_usuario(self) -> bool:
        ...

    def guardar(self, usuario: Usuario) -> Usuario:
        ...

    def actualizar_password(self, id_usuario: uuid.UUID, nueva_password_hash: str) -> None:
        ...


class PuertoRepositorioConfiguracion(Protocol):
    """Contrato para la persistencia de la configuración del sistema (Singleton)."""

    def obtener(self) -> Optional[ConfiguracionSistema]:
        ...

    def guardar(self, configuracion: ConfiguracionSistema) -> ConfiguracionSistema:
        ...


class PuertoRepositorioActividades(Protocol):
    """Contrato para la persistencia de actividades de seguimiento."""

    def obtener_por_id_tarea(self, id_tarea: str) -> Optional[ActividadSeguimiento]:
        ...

    def listar_todas_ordenadas(self) -> List[ActividadSeguimiento]:
        ...

    def guardar_o_actualizar(self, actividad: ActividadSeguimiento) -> ActividadSeguimiento:
        ...

    def guardar_lote(self, actividades: List[ActividadSeguimiento]) -> None:
        ...

    def contar_usos_por_plantilla(self, id_plantilla: str) -> int:
        ...
