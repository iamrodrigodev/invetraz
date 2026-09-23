import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actividadesApi from "@/features/actividades/api/actividades.api.ts";
import { useClasesDocenteStore } from "@/features/actividades/store/useClasesDocenteStore.ts";
import { ejecutarLimpiezaSesion } from "@/utils/eventosSesion.ts";

describe("useClasesDocenteStore", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		useClasesDocenteStore.getState().limpiar();
	});

	it("retorna clases cacheadas si ya esta cargado y no se fuerza", async () => {
		const mockClases = [
			{
				idClassroom: "c-101",
				nombre: "Metodologia de la Investigacion",
				estado: "ACTIVE",
			},
		];
		useClasesDocenteStore.setState({
			cargado: true,
			clases: mockClases,
		});

		const spy = vi.spyOn(actividadesApi, "obtenerClasesDocente");
		const res = await useClasesDocenteStore.getState().cargarClases(false);
		expect(res).toEqual(mockClases);
		expect(spy).not.toHaveBeenCalled();
	});

	it("retorna clases actuales si ya esta en curso una carga", async () => {
		useClasesDocenteStore.setState({ cargando: true });
		const spy = vi.spyOn(actividadesApi, "obtenerClasesDocente");
		const res = await useClasesDocenteStore.getState().cargarClases(true);
		expect(res).toEqual([]);
		expect(spy).not.toHaveBeenCalled();
	});

	it("obtiene clases desde la api y actualiza el estado", async () => {
		const mockClases = [
			{
				idClassroom: "c-101",
				nombre: "Metodologia de la Investigacion",
				estado: "ACTIVE",
			},
		];
		vi.spyOn(actividadesApi, "obtenerClasesDocente").mockResolvedValue(mockClases);

		const res = await useClasesDocenteStore.getState().cargarClases();
		expect(res).toEqual(mockClases);
		expect(useClasesDocenteStore.getState().cargado).toBe(true);
		expect(useClasesDocenteStore.getState().cargando).toBe(false);
		expect(useClasesDocenteStore.getState().error).toBeNull();
		expect(useClasesDocenteStore.getState().clases).toEqual(mockClases);
	});

	it("restablece cargando a false y registra error si la api arroja error", async () => {
		vi.spyOn(actividadesApi, "obtenerClasesDocente").mockRejectedValue(
			new Error("Error de conexion"),
		);

		await expect(useClasesDocenteStore.getState().cargarClases()).rejects.toThrow(
			"Error de conexion",
		);
		expect(useClasesDocenteStore.getState().cargando).toBe(false);
		expect(useClasesDocenteStore.getState().error).toBe("Error de conexion");
	});

	it("limpia el estado manualmente y al disparar limpieza de sesion", () => {
		useClasesDocenteStore.setState({
			clases: [
				{
					idClassroom: "c-1",
					nombre: "Clase 1",
				},
			],
			cargado: true,
			cargando: true,
			error: "algo",
		});

		useClasesDocenteStore.getState().limpiar();
		expect(useClasesDocenteStore.getState().clases).toEqual([]);
		expect(useClasesDocenteStore.getState().cargado).toBe(false);
		expect(useClasesDocenteStore.getState().cargando).toBe(false);
		expect(useClasesDocenteStore.getState().error).toBeNull();

		useClasesDocenteStore.setState({
			clases: [
				{
					idClassroom: "c-2",
					nombre: "Clase 2",
				},
			],
			cargado: true,
		});
		ejecutarLimpiezaSesion();
		expect(useClasesDocenteStore.getState().clases).toEqual([]);
		expect(useClasesDocenteStore.getState().cargado).toBe(false);
	});
});
