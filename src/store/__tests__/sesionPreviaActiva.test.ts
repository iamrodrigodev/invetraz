// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { describe, expect, it, vi } from "vitest";

const programarMock = vi.fn();

vi.mock("@/utils/sesion", () => ({
	esSesionValida: () => true,
	guardarSesion: vi.fn(),
	limpiarSesion: vi.fn(),
	programarExpiracionAutomatica: programarMock,
}));
vi.mock("@/features/auth/api/auth.api", () => ({
	verificarAutenticacion: vi.fn(),
	logout: vi.fn(),
}));
vi.mock("@/features/setup/api/setup.api", () => ({
	verificarEstadoSistema: vi.fn(),
}));

describe("sesionPreviaActiva", () => {
	it("programa expiracion automatica al cargar el store con sesion activa", async () => {
		const mod = await import("@/store/useAppStore.ts");
		expect(programarMock).toHaveBeenCalled();
		expect(mod.useAppStore.getState().autenticado).toBe(true);
	});
});
