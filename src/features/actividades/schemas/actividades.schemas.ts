// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { z } from "zod";

export const GenerarActividadSchema = z.object({
	idClase: z.string().min(1, "Debe seleccionar una clase de Google Classroom"),
	titulo: z
		.string()
		.trim()
		.min(1, "El título debe contener al menos 1 carácter")
		.max(3000, "El título no puede exceder 3000 caracteres"),
	fechaVencimiento: z
		.string()
		.min(1, "Debe seleccionar una fecha de vencimiento")
		.refine(
			(val) => {
				if (!val) {
					return false;
				}
				const [anio, mes, dia] = val.split("-").map(Number);
				if (!(anio && mes && dia)) {
					return false;
				}
				const fechaIngresada = new Date(anio, mes - 1, dia);
				const hoy = new Date();
				hoy.setHours(0, 0, 0, 0);
				return fechaIngresada >= hoy;
			},
			{
				message: "La fecha de vencimiento no puede ser anterior al día de hoy",
			},
		),
	idPlantilla: z.string().min(1, "Debe seleccionar una plantilla de seguimiento"),
	descripcion: z
		.string()
		.max(2000, "La descripción no puede superar los 2000 caracteres")
		.optional()
		.or(z.literal("")),
	horaVencimiento: z.string().optional().or(z.literal("")),
	idTema: z.string().optional().or(z.literal("")),
});

export type GenerarActividadSchemaTipo = z.infer<typeof GenerarActividadSchema>;
