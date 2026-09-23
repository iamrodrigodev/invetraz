// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
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
