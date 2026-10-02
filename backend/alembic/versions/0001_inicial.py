"""Migración inicial: creación de esquemas y tablas del Sistema de Investigación

Revision ID: 0001_inicial
Revises: 
Create Date: 2026-10-01
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '0001_inicial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Crear esquemas
    op.execute("CREATE SCHEMA IF NOT EXISTS auth;")
    op.execute("CREATE SCHEMA IF NOT EXISTS configuracion;")
    op.execute("CREATE SCHEMA IF NOT EXISTS seguimiento;")

    # 2. Tabla auth.usuarios
    op.create_table(
        'usuarios',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('password', sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        schema='auth',
    )

    # 3. Tabla configuracion.configuracion_sistema
    op.create_table(
        'configuracion_sistema',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('google_client_id', sa.String(length=500), nullable=True),
        sa.Column('google_client_secret', sa.String(length=1000), nullable=True),
        sa.Column('google_refresh_token', sa.String(length=1000), nullable=True),
        sa.Column('google_drive_folder_id', sa.String(length=255), nullable=True),
        sa.Column('google_drive_folder_name', sa.String(length=255), nullable=True),
        sa.Column('google_verificado', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('drive_verificado', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.PrimaryKeyConstraint('id'),
        schema='configuracion',
    )

    # 4. Tabla seguimiento.actividades_seguimiento
    op.create_table(
        'actividades_seguimiento',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('id_tarea_classroom', sa.String(length=100), nullable=False),
        sa.Column('id_clase_classroom', sa.String(length=100), nullable=False),
        sa.Column('nombre_clase', sa.String(length=255), nullable=True),
        sa.Column('id_tema_classroom', sa.String(length=100), nullable=True),
        sa.Column('nombre_tema', sa.String(length=255), nullable=True),
        sa.Column('id_plantilla_drive', sa.String(length=255), nullable=False),
        sa.Column('nombre_plantilla', sa.String(length=255), nullable=True),
        sa.Column('enlace_plantilla', sa.String(length=1000), nullable=True),
        sa.Column('titulo', sa.String(length=3000), nullable=False),
        sa.Column('descripcion', sa.String(length=2000), nullable=True),
        sa.Column('fecha_limite', sa.DateTime(), nullable=True),
        sa.Column('puntaje_maximo', sa.Float(), nullable=True),
        sa.Column('estado', sa.String(length=50), nullable=False),
        sa.Column('enlace_tarea', sa.String(length=1000), nullable=True),
        sa.Column('fecha_creacion', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('id_tarea_classroom'),
        schema='seguimiento',
    )
    op.create_index(
        'idx_actividades_seguimiento_plantilla',
        'actividades_seguimiento',
        ['id_plantilla_drive'],
        unique=False,
        schema='seguimiento',
    )
    op.create_index(
        'idx_actividades_seguimiento_clase',
        'actividades_seguimiento',
        ['id_clase_classroom'],
        unique=False,
        schema='seguimiento',
    )


def downgrade() -> None:
    op.drop_table('actividades_seguimiento', schema='seguimiento')
    op.drop_table('configuracion_sistema', schema='configuracion')
    op.drop_table('usuarios', schema='auth')
