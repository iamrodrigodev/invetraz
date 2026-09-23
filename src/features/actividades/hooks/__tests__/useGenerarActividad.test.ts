// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGenerarActividad } from "@/features/actividades/hooks/useGenerarActividad.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

describe("useGenerarActividad", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.restoreAllMocks();
		useConfiguracionStore.getState().limpiar();
		usePlantillasSeguimientoStore.getState().limpiar();
	});

	it("no ejecuta cargas automaticas si activo es false", () => {
		const spyConfig = vi.spyOn(useConfiguracionStore.getState(), "cargarConfiguracion");
		const spyPlantillas = vi.spyOn(usePlantillasSeguimientoStore.getState(), "cargarPlantillas");

		const { result } = renderHook(() => useGenerarActividad(false));
		expect(spyConfig).not.toHaveBeenCalled();
		expect(spyPlantillas).not.toHaveBeenCalled();
		expect(result.current.clases.length).toBeGreaterThan(0);
	});

	it("dispara cargas iniciales si activo es true", () => {
		const spyConfig = vi
			.spyOn(useConfiguracionStore.getState(), "cargarConfiguracion")
			.mockResolvedValue({} as never);
		const spyPlantillas = vi
			.spyOn(usePlantillasSeguimientoStore.getState(), "cargarPlantillas")
			.mockResolvedValue([] as never);

		renderHook(() => useGenerarActividad(true));
		expect(spyConfig).toHaveBeenCalled();
		expect(spyPlantillas).toHaveBeenCalled();
	});

	it("carga temas dinamicamente segun la clase seleccionada", async () => {
		const { result } = renderHook(() => useGenerarActividad());

		act(() => {
			result.current.cargarTemasDeClase("c-101");
		});

		expect(result.current.cargandoTemas).toBe(true);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current.cargandoTemas).toBe(false);
		expect(result.current.temas.length).toBeGreaterThan(0);

		act(() => {
			result.current.cargarTemasDeClase("");
		});
		expect(result.current.temas).toEqual([]);

		let cleanup: (() => void) | undefined;
		act(() => {
			cleanup = result.current.cargarTemasDeClase("c-101");
		});
		expect(cleanup).toBeDefined();
		act(() => {
			cleanup?.();
		});

		act(() => {
			result.current.cargarTemasDeClase("clase-sin-temas");
		});
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current.temas).toEqual([]);
	});

	it("retorna false en ejecutarGeneracion si la configuracion no es valida", async () => {
		const { result } = renderHook(() => useGenerarActividad());

		let res = true;
		await act(async () => {
			res = await result.current.ejecutarGeneracion({
				idClase: "c-1",
				titulo: "Tarea",
				idPlantilla: "p-1",
				fechaVencimiento: "2026-10-10",
			});
		});

		expect(res).toBe(false);
	});

	it("ejecuta generacion exitosamente cuando la configuracion es valida", async () => {
		useConfiguracionStore.setState({
			estadoConexion: "conectado",
			credenciales: {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
				googleVerificado: true,
				googleDriveFolderId: "folder-123",
				driveVerificado: true,
			},
		});

		const { result } = renderHook(() => useGenerarActividad());
		expect(result.current.configuracionValida).toBe(true);
		expect(result.current.carpetaDrive.id).toBe("folder-123");

		let res = false;
		const generacionPromise = act(async () => {
			res = await result.current.ejecutarGeneracion({
				idClase: "c-101",
				titulo: "Nueva Tarea",
				idPlantilla: "p-1",
				fechaVencimiento: "2026-10-10",
			});
		});

		await vi.advanceTimersByTimeAsync(1500);
		await generacionPromise;

		expect(res).toBe(true);
	});
});
