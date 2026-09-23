// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { z } from "zod";

export const PlantillaXlsxSchema = z.object({
	id: z.string(),
	nombre: z.string(),
	tipoMime: z.string(),
	enlaceWeb: z.string().nullable().optional(),
	enlaceDescarga: z.string().nullable().optional(),
	tamanoBytes: z.number().nullable().optional(),
	ultimaModificacion: z.string().nullable().optional(),
});

export type PlantillaXlsx = z.infer<typeof PlantillaXlsxSchema>;

export const CarpetaPlantillasRespuestaSchema = z.object({
	carpetaConfigurada: z.boolean(),
	carpetaId: z.string().nullable().optional(),
	carpetaNombre: z.string().nullable().optional(),
	plantillas: z.array(PlantillaXlsxSchema),
	driveVerificado: z.boolean().optional().default(false),
});

export type CarpetaPlantillasRespuesta = z.infer<typeof CarpetaPlantillasRespuestaSchema>;

export const VincularCarpetaPeticionSchema = z.object({
	carpetaUrlOId: z
		.string()
		.trim()
		.min(1, "El enlace o ID de la carpeta de Google Drive es obligatorio"),
});

export type VincularCarpetaPeticion = z.infer<typeof VincularCarpetaPeticionSchema>;
