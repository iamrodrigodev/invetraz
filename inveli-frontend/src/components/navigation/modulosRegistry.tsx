import { type ComponentType, lazy } from "react";
import type { ModuloId } from "@/components/navigation/types.ts";

export const REGISTRO_MODULOS: Record<ModuloId, ComponentType> = {
	actividades: lazy(() => import("@/features/actividades/pages/ActividadesSeguimientoPage.tsx")),
	reportes: lazy(() => import("@/features/reportes/pages/ReportesPage.tsx")),
	plantillas: lazy(() => import("@/features/plantillas/pages/PlantillasSeguimientoPage.tsx")),
	configuracion: lazy(() => import("@/features/configuracion/pages/ConfiguracionPage.tsx")),
	documentacion: lazy(() => import("@/features/documentacion/pages/DocumentacionPage.tsx")),
};
