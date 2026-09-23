// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { describe, expect, it, vi } from "vitest";
import { ejecutarLimpiezaSesion, registrarLimpiadorSesion } from "@/utils/eventosSesion.ts";

describe("eventosSesion", () => {
	it("ejecuta los limpiadores registrados al disparar la limpieza de sesión", () => {
		const limpiador1 = vi.fn();
		const limpiador2 = vi.fn();

		const desuscribir1 = registrarLimpiadorSesion(limpiador1);
		const desuscribir2 = registrarLimpiadorSesion(limpiador2);

		ejecutarLimpiezaSesion();

		expect(limpiador1).toHaveBeenCalledTimes(1);
		expect(limpiador2).toHaveBeenCalledTimes(1);

		desuscribir1();
		ejecutarLimpiezaSesion();

		expect(limpiador1).toHaveBeenCalledTimes(1);
		expect(limpiador2).toHaveBeenCalledTimes(2);

		desuscribir2();
	});

	it("no interrumpe la ejecución si un limpiador lanza un error", () => {
		const limpiadorConFallo = vi.fn(() => {
			throw new Error("Fallo en limpiador");
		});
		const limpiadorExitoso = vi.fn();

		const des1 = registrarLimpiadorSesion(limpiadorConFallo);
		const des2 = registrarLimpiadorSesion(limpiadorExitoso);

		expect(() => ejecutarLimpiezaSesion()).not.toThrow();
		expect(limpiadorConFallo).toHaveBeenCalledTimes(1);
		expect(limpiadorExitoso).toHaveBeenCalledTimes(1);

		des1();
		des2();
	});
});
