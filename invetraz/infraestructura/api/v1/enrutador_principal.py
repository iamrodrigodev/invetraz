from fastapi import APIRouter
from invetraz.infraestructura.api.v1.auth_rutas import enrutador as enrutador_auth
from invetraz.infraestructura.api.v1.setup_rutas import enrutador as enrutador_setup
from invetraz.infraestructura.api.v1.estado_rutas import enrutador as enrutador_estado
from invetraz.infraestructura.api.v1.clases_rutas import enrutador as enrutador_clases
from invetraz.infraestructura.api.v1.actividades_rutas import enrutador as enrutador_actividades
from invetraz.infraestructura.api.v1.plantillas_rutas import enrutador as enrutador_plantillas
from invetraz.infraestructura.api.v1.configuracion_rutas import enrutador as enrutador_configuracion

enrutador_v1 = APIRouter(prefix="/api/v1")

enrutador_v1.include_router(enrutador_auth)
enrutador_v1.include_router(enrutador_setup)
enrutador_v1.include_router(enrutador_estado)
enrutador_v1.include_router(enrutador_clases)
enrutador_v1.include_router(enrutador_actividades)
enrutador_v1.include_router(enrutador_plantillas)
enrutador_v1.include_router(enrutador_configuracion)
