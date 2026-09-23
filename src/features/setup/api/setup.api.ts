// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { entorno } from "@/config/entorno.ts";
import type { CrearAdminPeticion } from "@/features/setup/types/CrearAdminPeticion.ts";
import { EstadoSetupRespuestaSchema } from "@/schemas/api.schemas.ts";
import { ejecutarAccion, ejecutarPeticion } from "@/utils/api.ts";

export async function verificarEstadoSistema(): Promise<boolean> {
	const datos = await ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/setup/estado`,
		{ method: "GET" },
		EstadoSetupRespuestaSchema,
		"No se pudo consultar el estado del sistema",
	);
	if (typeof window !== "undefined") {
		if (datos.configurado) {
			localStorage.setItem("sistema_configurado", "true");
		} else {
			localStorage.removeItem("sistema_configurado");
		}
	}
	return datos.configurado;
}

export async function crearAdmin(
	peticion: Omit<CrearAdminPeticion, "confirmPassword">,
): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/setup/crear-admin`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		"Error al crear la cuenta de administrador",
	);
}
