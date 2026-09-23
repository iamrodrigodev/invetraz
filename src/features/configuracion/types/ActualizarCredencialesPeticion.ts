// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { z } from "zod";
import { VALIDATION_LIMITS } from "@/constants/validations.ts";

export const ActualizarCredencialesPeticionSchema = z.object({
	googleClientId: z
		.string()
		.trim()
		.min(1, "El Client ID es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID,
			`El Client ID no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID} caracteres`,
		),
	googleClientSecret: z
		.string()
		.trim()
		.min(1, "El Client Secret es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET,
			`El Client Secret no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET} caracteres`,
		),
	googleRefreshToken: z
		.string()
		.trim()
		.min(1, "El Refresh Token es obligatorio")
		.max(
			VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN,
			`El Refresh Token no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN} caracteres`,
		),
	googleDriveFolderId: z.string().trim().nullable().optional(),
	googleDriveFolderName: z.string().trim().nullable().optional(),
	googleVerificado: z.boolean().optional(),
	driveVerificado: z.boolean().optional(),
});

export type ActualizarCredencialesPeticion = z.infer<typeof ActualizarCredencialesPeticionSchema>;

export const ConfiguracionRespuestaSchema = z.object({
	googleClientId: z.string().optional().default(""),
	googleClientSecret: z.string().optional().default(""),
	googleRefreshToken: z.string().optional().default(""),
	googleDriveFolderId: z.string().nullable().optional().default(null),
	googleDriveFolderName: z.string().nullable().optional().default(null),
	googleVerificado: z.boolean().optional().default(false),
	driveVerificado: z.boolean().optional().default(false),
});

export type ConfiguracionRespuesta = z.infer<typeof ConfiguracionRespuestaSchema>;

export const ResultadoVerificacionSchema = z.object({
	valido: z.boolean(),
	mensaje: z.string(),
});

export type ResultadoVerificacion = z.infer<typeof ResultadoVerificacionSchema>;
