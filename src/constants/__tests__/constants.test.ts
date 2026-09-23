// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { describe, expect, it } from "vitest";
import { ELEMENTOS_NAVEGACION } from "@/constants/navigation.ts";
import { VALIDATION_LIMITS } from "@/constants/validations.ts";

describe("constants", () => {
	it("contiene los 5 elementos de navegacion principales del sistema", () => {
		expect(ELEMENTOS_NAVEGACION).toHaveLength(5);
		const ids = ELEMENTOS_NAVEGACION.map((item) => item.id);
		expect(ids).toEqual([
			"actividades",
			"reportes",
			"plantillas",
			"configuracion",
			"documentacion",
		]);

		for (const item of ELEMENTOS_NAVEGACION) {
			expect(item.id).toBeTruthy();
			expect(item.titulo).toBeTruthy();
			expect(item.etiquetaMenu).toBeTruthy();
			expect(item.icono).toBeDefined();
			expect(item.descripcion).toBeTruthy();
		}
	});

	it("define los limites de validacion esperados", () => {
		expect(VALIDATION_LIMITS.MAX_EMAIL).toBe(150);
		expect(VALIDATION_LIMITS.MIN_PASSWORD).toBe(8);
		expect(VALIDATION_LIMITS.MAX_PASSWORD).toBe(255);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID).toBe(500);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET).toBe(1000);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN).toBe(1000);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID).toBe(255);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_NAME).toBe(255);
	});
});
