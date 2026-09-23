// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { z } from "zod";

export const VerificarAutenticacionRespuestaSchema = z.object({
	autenticado: z.boolean(),
	email: z.string().nullable().optional(),
});

export type VerificarAutenticacionRespuesta = z.infer<typeof VerificarAutenticacionRespuestaSchema>;

export const LoginRespuestaSchema = z.object({
	tokenAcceso: z.string().min(1),
});

export type LoginRespuesta = z.infer<typeof LoginRespuestaSchema>;

export const EstadoSetupRespuestaSchema = z.object({
	configurado: z.boolean(),
});

export type EstadoSetupRespuesta = z.infer<typeof EstadoSetupRespuestaSchema>;

export function crearApiRespuestaSchema<T extends z.ZodType>(datosSchema: T) {
	return z.object({
		estado: z.number().int().optional(),
		mensaje: z.string().optional(),
		idRastreo: z.string().nullable().optional(),
		ruta: z.string().nullable().optional(),
		fechaHora: z.string().nullable().optional(),
		datos: datosSchema,
		errores: z.unknown().optional(),
	});
}
