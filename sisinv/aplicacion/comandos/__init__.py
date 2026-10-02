from sisinv.aplicacion.comandos.base import ComandoBase
from sisinv.aplicacion.comandos.autenticacion import (
    ComandoLogin,
    ComandoVerificarPassword,
    ComandoCambiarPassword,
    ResultadoLogin,
)
from sisinv.aplicacion.comandos.setup import (
    ComandoObtenerEstadoSetup,
    ComandoCrearAdmin,
    EstadoSetup,
)
from sisinv.aplicacion.comandos.configuracion import (
    ComandoObtenerConfiguracion,
    ComandoGuardarConfiguracion,
    ComandoVerificarConexionGoogle,
    DtoConfiguracionSistema,
)
from sisinv.aplicacion.comandos.plantillas import (
    ComandoListarPlantillas,
    ComandoVincularCarpetaDrive,
    CarpetaPlantillasInfo,
)
from sisinv.aplicacion.comandos.clases import (
    ComandoListarClasesDocente,
    ComandoListarClasesAlumno,
    ComandoListarTareas,
    ComandoListarTemas,
    ComandoCrearTarea,
    ComandoArchivarClase,
)
from sisinv.aplicacion.comandos.actividades import (
    ComandoListarActividades,
    ComandoSincronizarActividades,
)
from sisinv.aplicacion.comandos.estado import (
    ComandoVerificarReadiness,
    EstadoReadiness,
)

__all__ = [
    "ComandoBase",
    "ComandoLogin",
    "ComandoVerificarPassword",
    "ComandoCambiarPassword",
    "ResultadoLogin",
    "ComandoObtenerEstadoSetup",
    "ComandoCrearAdmin",
    "EstadoSetup",
    "ComandoObtenerConfiguracion",
    "ComandoGuardarConfiguracion",
    "ComandoVerificarConexionGoogle",
    "DtoConfiguracionSistema",
    "ComandoListarPlantillas",
    "ComandoVincularCarpetaDrive",
    "CarpetaPlantillasInfo",
    "ComandoListarClasesDocente",
    "ComandoListarClasesAlumno",
    "ComandoListarTareas",
    "ComandoListarTemas",
    "ComandoCrearTarea",
    "ComandoArchivarClase",
    "ComandoListarActividades",
    "ComandoSincronizarActividades",
    "ComandoVerificarReadiness",
    "EstadoReadiness",
]
