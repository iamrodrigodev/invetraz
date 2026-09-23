import { type ComponentType, lazy } from "react";
import type { ModuloId } from "@/components/navigation/types";

export const REGISTRO_MODULOS: Record<ModuloId, ComponentType> = {
	actividades: lazy(
		() => import("@/features/actividades/pages/ActividadesSeguimientoPage"),
	),
	reportes: lazy(() => import("@/features/reportes/pages/ReportesPage")),
	plantillas: lazy(
		() => import("@/features/plantillas/pages/PlantillasSeguimientoPage"),
	),
	configuracion: lazy(
		() => import("@/features/configuracion/pages/ConfiguracionPage"),
	),
	documentacion: lazy(
		() => import("@/features/documentacion/pages/DocumentacionPage"),
	),
};
