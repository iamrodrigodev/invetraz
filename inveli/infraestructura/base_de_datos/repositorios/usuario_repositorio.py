"""Adaptador de persistencia para Usuarios utilizando SQLAlchemy 2.0."""

from typing import Optional
import uuid
from sqlalchemy import select, update
from sqlalchemy.orm import Session
from inveli.dominio.entidades.usuario import Usuario
from inveli.infraestructura.base_de_datos.modelos.usuario_modelo import UsuarioModelo


class RepositorioUsuariosSqlAlchemy:
    def __init__(self, sesion: Session):
        self._sesion = sesion

    def _a_dominio(self, modelo: UsuarioModelo) -> Usuario:
        return Usuario(
            id=modelo.id,
            email=modelo.email,
            password=modelo.password,
        )

    def obtener_por_id(self, id_usuario: uuid.UUID) -> Optional[Usuario]:
        modelo = self._sesion.get(UsuarioModelo, id_usuario)
        return self._a_dominio(modelo) if modelo else None

    def obtener_por_email(self, email: str) -> Optional[Usuario]:
        sentencia = select(UsuarioModelo).where(UsuarioModelo.email == email)
        modelo = self._sesion.scalars(sentencia).first()
        return self._a_dominio(modelo) if modelo else None

    def existe_algun_usuario(self) -> bool:
        sentencia = select(UsuarioModelo.id).limit(1)
        return self._sesion.scalars(sentencia).first() is not None

    def guardar(self, usuario: Usuario) -> Usuario:
        modelo = UsuarioModelo(
            id=usuario.id or uuid.uuid4(),
            email=usuario.email,
            password=usuario.password,
        )
        self._sesion.add(modelo)
        self._sesion.commit()
        self._sesion.refresh(modelo)
        return self._a_dominio(modelo)

    def actualizar_password(self, id_usuario: uuid.UUID, nueva_password_hash: str) -> None:
        sentencia = (
            update(UsuarioModelo)
            .where(UsuarioModelo.id == id_usuario)
            .values(password=nueva_password_hash)
        )
        self._sesion.execute(sentencia)
        self._sesion.commit()
