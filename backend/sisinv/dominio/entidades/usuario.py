"""Entidad de dominio Usuario."""

from dataclasses import dataclass
import uuid


@dataclass
class Usuario:
    id: uuid.UUID
    email: str
    password: str
