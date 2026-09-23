// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import type { z } from "zod";
import { crearApiRespuestaSchema } from "@/schemas/api.schemas.ts";
import { extraerMensajeError, fetchSeguro, parsearConEsquema } from "@/utils/fetch.ts";

export async function leerDatos<T extends z.ZodType>(
	respuesta: Response,
	esquema: T,
	mensajeError: string,
): Promise<z.infer<T>> {
	if (!respuesta.ok) {
		throw new Error(await extraerMensajeError(respuesta, mensajeError));
	}
	const envoltura = await parsearConEsquema(respuesta, crearApiRespuestaSchema(esquema));
	return (envoltura as unknown as { datos: z.infer<T> }).datos;
}

export async function ejecutarPeticion<T extends z.ZodType>(
	url: string,
	opciones: RequestInit,
	esquema: T,
	mensajeError: string,
): Promise<z.infer<T>> {
	const res = await fetchSeguro(url, opciones);
	return leerDatos(res, esquema, mensajeError);
}

export async function ejecutarAccion(
	url: string,
	opciones: RequestInit,
	mensajeError: string,
): Promise<void> {
	const res = await fetchSeguro(url, opciones);
	if (!res.ok) {
		throw new Error(await extraerMensajeError(res, mensajeError));
	}
}
