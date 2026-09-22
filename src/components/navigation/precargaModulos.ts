import type { ModuloId } from "./types";

const CARGADORES_MODULOS: Record<ModuloId, () => Promise<unknown>> = {
	actividades: async () => {},
	plantillas: () =>
		import("../../features/plantillas/pages/PlantillasSeguimientoPage"),
	configuracion: () =>
		import("../../features/configuracion/pages/ConfiguracionPage"),
	reportes: () => import("../../features/reportes/pages/ReportesPage"),
	documentacion: () =>
		import("../../features/documentacion/pages/DocumentacionPage"),
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
