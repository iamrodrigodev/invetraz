import type { ModuloId } from "@/components/navigation/types.ts";

const CARGADORES_MODULOS: Record<ModuloId, () => Promise<unknown>> = {
	actividades: async () => {},
	plantillas: () => import("@/features/plantillas/pages/PlantillasSeguimientoPage.tsx"),
	configuracion: () => import("@/features/configuracion/pages/ConfiguracionPage.tsx"),
	reportes: () => import("@/features/reportes/pages/ReportesPage.tsx"),
	documentacion: () => import("@/features/documentacion/pages/DocumentacionPage.tsx"),
};

export function precargarModulo(id: ModuloId): void {
	try {
		CARGADORES_MODULOS[id]?.();
	} catch {}
}

export function precargarTodosLosModulos(): void {
	for (const id of Object.keys(CARGADORES_MODULOS) as ModuloId[]) {
		precargarModulo(id);
	}
}
