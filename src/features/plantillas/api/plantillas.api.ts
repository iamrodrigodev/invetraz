// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { entorno } from "@/config/entorno.ts";
import type {
	CarpetaPlantillasRespuesta,
	VincularCarpetaPeticion,
} from "@/features/plantillas/types/plantillas.types.ts";
import { CarpetaPlantillasRespuestaSchema } from "@/features/plantillas/types/plantillas.types.ts";
import { ejecutarPeticion } from "@/utils/api.ts";

export async function obtenerPlantillas(): Promise<CarpetaPlantillasRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas`,
		{ method: "GET" },
		CarpetaPlantillasRespuestaSchema,
		"Error al consultar las plantillas de seguimiento",
	);
}

export async function verificarCarpetaDrive(
	peticion: VincularCarpetaPeticion,
): Promise<CarpetaPlantillasRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas/verificar`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		CarpetaPlantillasRespuestaSchema,
		"Error al verificar la carpeta de Google Drive",
	);
}

export async function vincularCarpetaDrive(
	peticion: VincularCarpetaPeticion,
): Promise<CarpetaPlantillasRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas/carpeta`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		CarpetaPlantillasRespuestaSchema,
		"Error al vincular la carpeta de Google Drive",
	);
}
