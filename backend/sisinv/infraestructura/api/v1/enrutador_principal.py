"""Enrutador principal de la API v1 de SisInv."""

from fastapi import APIRouter
from sisinv.infraestructura.api.v1.auth_rutas import enrutador as enrutador_auth
from sisinv.infraestructura.api.v1.setup_rutas import enrutador as enrutador_setup
from sisinv.infraestructura.api.v1.estado_rutas import enrutador as enrutador_estado
from sisinv.infraestructura.api.v1.clases_rutas import enrutador as enrutador_clases
from sisinv.infraestructura.api.v1.actividades_rutas import enrutador as enrutador_actividades
from sisinv.infraestructura.api.v1.plantillas_rutas import enrutador as enrutador_plantillas
from sisinv.infraestructura.api.v1.configuracion_rutas import enrutador as enrutador_configuracion

enrutador_v1 = APIRouter(prefix="/api/v1")

enrutador_v1.include_router(enrutador_auth)
enrutador_v1.include_router(enrutador_setup)
enrutador_v1.include_router(enrutador_estado)
enrutador_v1.include_router(enrutador_clases)
enrutador_v1.include_router(enrutador_actividades)
enrutador_v1.include_router(enrutador_plantillas)
enrutador_v1.include_router(enrutador_configuracion)
