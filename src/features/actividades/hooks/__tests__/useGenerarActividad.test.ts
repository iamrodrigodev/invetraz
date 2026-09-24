import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actividadesApi from "@/features/actividades/api/actividades.api.ts";
import { useGenerarActividad } from "@/features/actividades/hooks/useGenerarActividad.ts";
import { useClasesDocenteStore } from "@/features/actividades/store/useClasesDocenteStore.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

describe("useGenerarActividad", () => {
	beforeEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		useConfiguracionStore.getState().limpiar();
		usePlantillasSeguimientoStore.getState().limpiar();
		useClasesDocenteStore.getState().limpiar();
		vi.spyOn(useConfiguracionStore.getState(), "cargarConfiguracion").mockResolvedValue(
			{} as never,
		);
		vi.spyOn(usePlantillasSeguimientoStore.getState(), "cargarPlantillas").mockResolvedValue(
			[] as never,
		);
		vi.spyOn(useClasesDocenteStore.getState(), "cargarClases").mockResolvedValue([] as never);
	});

	it("no ejecuta cargas automaticas si activo es false", () => {
		vi.restoreAllMocks();
		const spyConfig = vi.spyOn(useConfiguracionStore.getState(), "cargarConfiguracion");
		const spyPlantillas = vi.spyOn(usePlantillasSeguimientoStore.getState(), "cargarPlantillas");
		const spyClases = vi.spyOn(useClasesDocenteStore.getState(), "cargarClases");

		const { result } = renderHook(() => useGenerarActividad(false));
		expect(spyConfig).not.toHaveBeenCalled();
		expect(spyPlantillas).not.toHaveBeenCalled();
		expect(spyClases).not.toHaveBeenCalled();
		expect(result.current.clases).toEqual([]);
	});

	it("dispara cargas iniciales si activo es true", () => {
		const spyConfig = vi
			.spyOn(useConfiguracionStore.getState(), "cargarConfiguracion")
			.mockResolvedValue({} as never);
		const spyPlantillas = vi
			.spyOn(usePlantillasSeguimientoStore.getState(), "cargarPlantillas")
			.mockResolvedValue([] as never);
		const spyClases = vi
			.spyOn(useClasesDocenteStore.getState(), "cargarClases")
			.mockResolvedValue([] as never);

		renderHook(() => useGenerarActividad(true));
		expect(spyConfig).toHaveBeenCalled();
		expect(spyPlantillas).toHaveBeenCalled();
		expect(spyClases).toHaveBeenCalled();
	});

	it("carga temas dinamicamente segun la clase seleccionada", async () => {
		const spyObtenerTemas = vi
			.spyOn(actividadesApi, "obtenerTemasClase")
			.mockResolvedValueOnce([
				{ idTema: "t-1", nombre: "Tema 1" },
				{ idTema: "t-2", nombre: "Tema 2" },
			])
			.mockResolvedValueOnce([]);

		const { result } = renderHook(() => useGenerarActividad());

		await act(async () => {
			result.current.cargarTemasDeClase("c-101");
		});

		expect(spyObtenerTemas).toHaveBeenCalledWith("c-101");
		expect(result.current.cargandoTemas).toBe(false);
		expect(result.current.temas).toHaveLength(2);
		expect(result.current.temas[0]?.nombre).toBe("Tema 1");

		act(() => {
			result.current.cargarTemasDeClase("");
		});
		expect(result.current.temas).toEqual([]);

		await act(async () => {
			result.current.cargarTemasDeClase("clase-sin-temas");
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
		const spyGenerar = vi
			.spyOn(actividadesApi, "generarActividadSeguimientoApi")
			.mockResolvedValue(true);

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
		await act(async () => {
			res = await result.current.ejecutarGeneracion({
				idClase: "c-101",
				titulo: "Nueva Tarea",
				idPlantilla: "p-1",
				fechaVencimiento: "2026-10-10",
			});
		});

		expect(spyGenerar).toHaveBeenCalledWith({
			idClase: "c-101",
			titulo: "Nueva Tarea",
			idPlantilla: "p-1",
			fechaVencimiento: "2026-10-10",
		});
		expect(res).toBe(true);
	});
});
