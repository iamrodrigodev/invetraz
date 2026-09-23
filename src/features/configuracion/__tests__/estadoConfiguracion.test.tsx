// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useVerificacionConexion } from "@/features/configuracion/hooks/useVerificacionConexion.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

const api = vi.hoisted(() => ({
	actualizarConfiguracion: vi.fn(),
	verificarConfiguracion: vi.fn(),
	obtenerConfiguracion: vi.fn(),
}));
vi.mock("@/features/configuracion/api/configuracion.api", () => api);

const datos = {
	googleClientId: "id",
	googleClientSecret: "secret",
	googleRefreshToken: "token",
	googleDriveFolderId: null,
	googleDriveFolderName: null,
	googleVerificado: false,
	driveVerificado: false,
};

beforeEach(() => {
	vi.clearAllMocks();
	useConfiguracionStore.getState().limpiar();
});

describe("guardado de configuración", () => {
	it("guarda una sola vez como pendiente cuando falla la verificación", async () => {
		api.verificarConfiguracion.mockRejectedValue(new Error("Sin acceso"));
		api.actualizarConfiguracion.mockResolvedValue(undefined);

		const resultado = await useConfiguracionStore.getState().guardarConfiguracion(datos);

		expect(resultado.valido).toBe(false);
		expect(api.actualizarConfiguracion).toHaveBeenCalledOnce();
		expect(api.actualizarConfiguracion).toHaveBeenCalledWith({
			...datos,
			googleVerificado: false,
		});
		expect(useConfiguracionStore.getState().cargando).toBe(false);
	});

	it("apaga el estado de carga si falla la persistencia", async () => {
		api.verificarConfiguracion.mockResolvedValue({
			valido: true,
			mensaje: "OK",
		});
		api.actualizarConfiguracion.mockRejectedValue(new Error("No se pudo guardar"));

		await expect(useConfiguracionStore.getState().guardarConfiguracion(datos)).rejects.toThrow(
			"No se pudo guardar",
		);
		expect(api.actualizarConfiguracion).toHaveBeenCalledOnce();
		expect(useConfiguracionStore.getState().cargando).toBe(false);
	});
});

describe("estado visual de conexión", () => {
	it("deja de mostrar conectado al editar un valor verificado", () => {
		const opciones = (valorActual: string) => ({
			valorActual,
			valorGuardado: "original",
			sonIguales: (a: string | null | undefined, b: string | null | undefined) => a === b,
			esValido: true,
			tieneValorGuardado: true,
			valorGuardadoVerificado: true,
			onVerificar: async () => "OK",
			onGuardar: async () => "OK",
		});
		const { result, rerender } = renderHook(
			({ actual }) => useVerificacionConexion(opciones(actual)),
			{ initialProps: { actual: "original" } },
		);
		expect(result.current.estadoVisual).toBe("conectado");
		rerender({ actual: "editado" });
		expect(result.current.estadoVisual).not.toBe("conectado");
	});
});
