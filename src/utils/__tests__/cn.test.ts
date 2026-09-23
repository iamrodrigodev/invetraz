// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { describe, expect, it } from "vitest";
import { cn } from "@/utils/cn.ts";

describe("cn", () => {
	it("retorna string vacio sin argumentos", () => {
		expect(cn()).toBe("");
	});

	it("ignora valores falsy y combina strings y numeros", () => {
		expect(cn("clase-1", null, undefined, false, 0, "clase-2", 42)).toBe("clase-1 clase-2 42");
	});

	it("ignora booleanos true", () => {
		expect(cn("clase-1", true, "clase-2")).toBe("clase-1 clase-2");
	});

	it("soporta arrays anidados recursivos", () => {
		expect(cn(["clase-a", ["clase-b", ["clase-c"]]])).toBe("clase-a clase-b clase-c");
	});

	it("ignora arrays anidados vacios", () => {
		expect(cn(["clase-a", []])).toBe("clase-a");
	});

	it("soporta objetos de clases condicionales", () => {
		expect(
			cn({
				activo: true,
				deshabilitado: false,
				visible: null,
				oculto: undefined,
				resaltado: true,
			}),
		).toBe("activo resaltado");
	});

	it("combina tipos mixtos correctamente", () => {
		expect(cn("base", { "mod-1": true, "mod-2": false }, ["array-1", false, "array-2"], null)).toBe(
			"base mod-1 array-1 array-2",
		);
	});
});
