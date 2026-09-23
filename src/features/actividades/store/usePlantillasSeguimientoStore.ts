// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { create } from "zustand";
import { obtenerPlantillasParaFormulario } from "@/features/actividades/api/actividades.api.ts";
import type { PlantillaSeguimientoOpcion } from "@/features/actividades/types/actividades.types.ts";
import { registrarLimpiadorSesion } from "@/utils/eventosSesion.ts";

interface PlantillasSeguimientoState {
	plantillas: PlantillaSeguimientoOpcion[];
	cargando: boolean;
	cargado: boolean;
	cargarPlantillas: (forzar?: boolean) => Promise<PlantillaSeguimientoOpcion[]>;
	limpiar: () => void;
}

export const usePlantillasSeguimientoStore = create<PlantillasSeguimientoState>((set, get) => ({
	plantillas: [],
	cargando: false,
	cargado: false,

	cargarPlantillas: async (forzar = false) => {
		const { cargado, cargando, plantillas } = get();
		if (cargado && !forzar) {
			return plantillas;
		}
		if (cargando) {
			return plantillas;
		}

		set({ cargando: true });
		try {
			const datos = await obtenerPlantillasParaFormulario();
			set({ plantillas: datos, cargado: true, cargando: false });
			return datos;
		} catch (error) {
			set({ cargando: false });
			throw error;
		}
	},

	limpiar: () => {
		set({ plantillas: [], cargando: false, cargado: false });
	},
}));

registrarLimpiadorSesion(() => {
	usePlantillasSeguimientoStore.getState().limpiar();
});
