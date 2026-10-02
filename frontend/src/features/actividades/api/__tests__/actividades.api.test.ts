import { afterEach, describe, expect, it, vi } from "vitest";
import {
	generarActividadSeguimientoApi,
	obtenerActividadesSeguimiento,
	obtenerClasesDocente,
	obtenerPlantillasParaFormulario,
	obtenerTemasClase,
	sincronizarActividadesSeguimiento,
} from "@/features/actividades/api/actividades.api.ts";

describe("actividades.api", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("obtenerClasesDocente consulta y mapea las clases", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: [
						{
							idClassroom: "c-1",
							nombre: "Investigacion I",
							estado: "ACTIVE",
							enlaceClase: "https://classroom.google.com/c-1",
						},
					],
				}),
			}),
		);

		const clases = await obtenerClasesDocente();
		expect(clases).toEqual([
			{
				idClassroom: "c-1",
				nombre: "Investigacion I",
				estado: "ACTIVE",
			},
		]);
	});

	it("obtenerPlantillasParaFormulario transforma plantillas, ordena por frecuenciaUso y anade mock", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: {
						carpetaConfigurada: true,
						carpetaId: "folder-1",
						carpetaNombre: "Carpeta",
						plantillas: [
							{
								id: "p-invalida",
								nombre: "Plantilla Invalida.gsheet",
								tipoMime: "application/vnd.google-apps.spreadsheet",
								enlaceDescarga: null,
								enlaceWeb: null,
								tamanoBytes: null,
								ultimaModificacion: "2026-09-23",
								frecuenciaUso: 0,
							},
							{
								id: "p-valida",
								nombre: "Seguimiento 2026.xlsx",
								tipoMime: "application/vnd.ms-excel",
								enlaceDescarga: null,
								enlaceWeb: "https://sheet.google.com/1",
								tamanoBytes: 500,
								ultimaModificacion: "2026-09-23",
								frecuenciaUso: 4,
							},
						],
					},
				}),
			}),
		);

		const opciones = await obtenerPlantillasParaFormulario();
		expect(opciones).toHaveLength(3);
		expect(opciones[0]?.id).toBe("p-valida");
		expect(opciones[0]?.frecuenciaUso).toBe(4);

		const valida = opciones.find((p) => p.id === "p-valida");
		expect(valida?.nombre).toBe("Seguimiento 2026");
		expect(valida?.estructuraValida).toBe(true);
		expect(valida?.mensajeErrorEstructura).toBeUndefined();

		const invalida = opciones.find((p) => p.id === "p-invalida");
		expect(invalida?.nombre).toBe("Plantilla Invalida");
		expect(invalida?.estructuraValida).toBe(false);
		expect(invalida?.mensajeErrorEstructura).toBeDefined();

		const mock = opciones.find((p) => p.id === "mock-plantilla-seguimiento-invalida");
		expect(mock).toBeDefined();
		expect(mock?.estructuraValida).toBe(false);
	});

	it("obtenerTemasClase consulta y retorna los temas de una clase", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: [{ idTema: "t-1", nombre: "Semana 1" }],
				}),
			}),
		);

		const temas = await obtenerTemasClase("c-1");
		expect(temas).toEqual([{ idTema: "t-1", nombre: "Semana 1" }]);
	});

	it("obtenerActividadesSeguimiento y sincronizarActividadesSeguimiento consultan los endpoints respectivos", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => ({
				datos: [
					{
						idTarea: "t-100",
						idClase: "c-1",
						nombreClase: "Tesis I",
						titulo: "Avance 1",
						idPlantilla: "p-1",
						nombrePlantilla: "Matriz.xlsx",
					},
				],
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const lista = await obtenerActividadesSeguimiento();
		expect(lista).toHaveLength(1);
		expect(lista[0]?.titulo).toBe("Avance 1");

		const sincronizadas = await sincronizarActividadesSeguimiento();
		expect(sincronizadas).toHaveLength(1);
		expect(sincronizadas[0]?.idTarea).toBe("t-100");
	});

	it("generarActividadSeguimientoApi envia la tarea con hora especifica o por defecto 23:59", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 201,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => ({
				datos: {
					idTarea: "t-creada",
					titulo: "Tarea creada",
				},
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const resConHora = await generarActividadSeguimientoApi({
			idClase: "c-1",
			nombreClase: "Tesis I",
			titulo: "Tarea 1",
			idPlantilla: "p-1",
			nombrePlantilla: "Matriz",
			enlacePlantilla: "https://drive.google.com/open?id=p-1",
			fechaVencimiento: "2026-10-15",
			horaVencimiento: "18:30",
			descripcion: "Desc",
			idTema: "tema-1",
			nombreTema: "Semana 1",
		});
		expect(resConHora).toBe(true);

		const resSinHora = await generarActividadSeguimientoApi({
			idClase: "c-1",
			titulo: "Tarea 2",
			idPlantilla: "p-1",
			fechaVencimiento: "2026-10-15",
			horaVencimiento: "",
		});
		expect(resSinHora).toBe(true);

		const resSinFecha = await generarActividadSeguimientoApi({
			idClase: "c-1",
			titulo: "Tarea 3",
			idPlantilla: "p-1",
			fechaVencimiento: "",
		});
		expect(resSinFecha).toBe(true);
	});

	it("generarActividadSeguimientoApi retorna false si res.ok es false", async () => {
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

		const res = await generarActividadSeguimientoApi({
			idClase: "c-1",
			titulo: "Tarea",
			idPlantilla: "p-1",
			fechaVencimiento: "2026-10-15",
		});
		expect(res).toBe(false);
	});
});
