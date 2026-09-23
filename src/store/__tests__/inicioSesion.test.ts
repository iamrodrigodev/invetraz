// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
	verificarAutenticacion: vi.fn(),
	verificarEstadoSistema: vi.fn(),
	esSesionValida: vi.fn(),
}));

vi.mock("@/features/auth/api/auth.api", () => ({
	verificarAutenticacion: api.verificarAutenticacion,
	logout: vi.fn(),
}));
vi.mock("@/features/setup/api/setup.api", () => ({
	verificarEstadoSistema: api.verificarEstadoSistema,
}));
vi.mock("@/utils/sesion", () => ({
	esSesionValida: api.esSesionValida,
	guardarSesion: vi.fn(),
	limpiarSesion: vi.fn(),
	programarExpiracionAutomatica: vi.fn(),
}));

import { useAppStore } from "@/store/useAppStore.ts";

beforeEach(() => {
	vi.clearAllMocks();
	api.esSesionValida.mockReturnValue(false);
	useAppStore.setState({
		configurado: null,
		autenticado: false,
		usuarioEmail: null,
		estadoVerificado: false,
		errorVerificacion: null,
	});
});

describe("verificación inicial", () => {
	it("consulta solo setup cuando no hay sesión previa y comparte la petición concurrente", async () => {
		api.verificarEstadoSistema.mockResolvedValue(true);

		await Promise.all([
			useAppStore.getState().verificarEstadoGlobal(),
			useAppStore.getState().verificarEstadoGlobal(),
		]);

		expect(api.verificarEstadoSistema).toHaveBeenCalledOnce();
		expect(api.verificarAutenticacion).not.toHaveBeenCalled();
		expect(useAppStore.getState().configurado).toBe(true);
	});

	it("consulta solo la sesión si ya está autenticada", async () => {
		api.esSesionValida.mockReturnValue(true);
		api.verificarAutenticacion.mockResolvedValue({
			autenticado: true,
			email: "admin@ulasalle.edu.pe",
		});

		await useAppStore.getState().verificarEstadoGlobal();

		expect(api.verificarAutenticacion).toHaveBeenCalledOnce();
		expect(api.verificarEstadoSistema).not.toHaveBeenCalled();
		expect(useAppStore.getState().autenticado).toBe(true);
	});

	it("una verificación antigua no revierte un login reciente", async () => {
		let terminarConsulta: (valor: boolean) => void = () => {};
		api.verificarEstadoSistema.mockReturnValue(
			new Promise<boolean>((resolve) => {
				terminarConsulta = resolve;
			}),
		);

		const pendiente = useAppStore.getState().verificarEstadoGlobal();
		useAppStore.getState().setAutenticado(true, "nuevo@ulasalle.edu.pe");
		terminarConsulta(false);
		await pendiente;

		expect(useAppStore.getState().autenticado).toBe(true);
		expect(useAppStore.getState().usuarioEmail).toBe("nuevo@ulasalle.edu.pe");
	});
});
