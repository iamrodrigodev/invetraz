import type React from "react";
import {
	ActividadesSeguimientoPage,
	ConfiguracionPage,
	PlantillasSeguimientoPage,
	ReportesPage,
} from "../../pages";
import type { ModuloId } from "./types";

export const REGISTRO_MODULOS: Record<ModuloId, React.ComponentType> = {
	actividades: ActividadesSeguimientoPage,
	reportes: ReportesPage,
	plantillas: PlantillasSeguimientoPage,
	configuracion: ConfiguracionPage,
};
