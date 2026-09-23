import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actividadesApi from "@/features/actividades/api/actividades.api.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import { ejecutarLimpiezaSesion } from "@/utils/eventosSesion.ts";

describe("usePlantillasSeguimientoStore", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		usePlantillasSeguimientoStore.getState().limpiar();
	});

	it("retorna plantillas cacheadas si ya esta cargado y no se fuerza", async () => {
		const mockPlantillas = [
			{
				id: "p-1",
				nombre: "Plantilla 1",
				enlaceWeb: null,
				frecuenciaUso: 0,
				estructuraValida: true,
			},
		];
		usePlantillasSeguimientoStore.setState({
			cargado: true,
			plantillas: mockPlantillas,
		});

		const spy = vi.spyOn(actividadesApi, "obtenerPlantillasParaFormulario");
		const res = await usePlantillasSeguimientoStore.getState().cargarPlantillas(false);
		expect(res).toEqual(mockPlantillas);
		expect(spy).not.toHaveBeenCalled();
	});

	it("retorna plantillas actuales si ya esta en curso una carga", async () => {
		usePlantillasSeguimientoStore.setState({ cargando: true });
		const spy = vi.spyOn(actividadesApi, "obtenerPlantillasParaFormulario");
		const res = await usePlantillasSeguimientoStore.getState().cargarPlantillas(true);
		expect(res).toEqual([]);
		expect(spy).not.toHaveBeenCalled();
	});

	it("obtiene plantillas desde la api y actualiza el estado", async () => {
		const mockPlantillas = [
			{
				id: "p-1",
				nombre: "Plantilla 1",
				enlaceWeb: null,
				frecuenciaUso: 0,
				estructuraValida: true,
			},
		];
		vi.spyOn(actividadesApi, "obtenerPlantillasParaFormulario").mockResolvedValue(mockPlantillas);

		const res = await usePlantillasSeguimientoStore.getState().cargarPlantillas();
		expect(res).toEqual(mockPlantillas);
		expect(usePlantillasSeguimientoStore.getState().cargado).toBe(true);
		expect(usePlantillasSeguimientoStore.getState().cargando).toBe(false);
		expect(usePlantillasSeguimientoStore.getState().plantillas).toEqual(mockPlantillas);
	});

	it("restablece cargando a false si la api arroja error", async () => {
		vi.spyOn(actividadesApi, "obtenerPlantillasParaFormulario").mockRejectedValue(
			new Error("Error de plantillas"),
		);

		await expect(usePlantillasSeguimientoStore.getState().cargarPlantillas()).rejects.toThrow(
			"Error de plantillas",
		);
		expect(usePlantillasSeguimientoStore.getState().cargando).toBe(false);
	});

	it("limpia el estado manualmente y al disparar limpieza de sesion", () => {
		usePlantillasSeguimientoStore.setState({
			plantillas: [
				{
					id: "p",
					nombre: "n",
					enlaceWeb: null,
					frecuenciaUso: 0,
					estructuraValida: true,
				},
			],
			cargado: true,
			cargando: true,
		});

		usePlantillasSeguimientoStore.getState().limpiar();
		expect(usePlantillasSeguimientoStore.getState().plantillas).toEqual([]);
		expect(usePlantillasSeguimientoStore.getState().cargado).toBe(false);
		expect(usePlantillasSeguimientoStore.getState().cargando).toBe(false);

		usePlantillasSeguimientoStore.setState({
			plantillas: [
				{
					id: "p2",
					nombre: "n2",
					enlaceWeb: null,
					frecuenciaUso: 0,
					estructuraValida: true,
				},
			],
			cargado: true,
		});
		ejecutarLimpiezaSesion();
		expect(usePlantillasSeguimientoStore.getState().plantillas).toEqual([]);
		expect(usePlantillasSeguimientoStore.getState().cargado).toBe(false);
	});
});
