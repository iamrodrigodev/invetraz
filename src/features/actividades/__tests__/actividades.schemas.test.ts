import { describe, expect, it } from "vitest";
import { GenerarActividadSchema } from "@/features/actividades/schemas/actividades.schemas.ts";

describe("GenerarActividadSchema", () => {
	const fechaHoy = new Date();
	const anio = fechaHoy.getFullYear();
	const mes = String(fechaHoy.getMonth() + 1).padStart(2, "0");
	const dia = String(fechaHoy.getDate()).padStart(2, "0");
	const fechaValida = `${anio}-${mes}-${dia}`;

	it("acepta un título de 1 carácter", () => {
		const datos = {
			idClase: "c-101",
			titulo: "A",
			fechaVencimiento: fechaValida,
			idPlantilla: "p-1",
		};

		const resultado = GenerarActividadSchema.safeParse(datos);
		expect(resultado.success).toBe(true);
	});

	it("acepta un título de 3000 caracteres", () => {
		const datos = {
			idClase: "c-101",
			titulo: "T".repeat(3000),
			fechaVencimiento: fechaValida,
			idPlantilla: "p-1",
		};

		const resultado = GenerarActividadSchema.safeParse(datos);
		expect(resultado.success).toBe(true);
	});

	it("rechaza un título vacío o con solo espacios", () => {
		const datosVacio = {
			idClase: "c-101",
			titulo: "",
			fechaVencimiento: fechaValida,
			idPlantilla: "p-1",
		};

		const resultadoVacio = GenerarActividadSchema.safeParse(datosVacio);
		expect(resultadoVacio.success).toBe(false);

		const datosEspacios = {
			idClase: "c-101",
			titulo: "   ",
			fechaVencimiento: fechaValida,
			idPlantilla: "p-1",
		};

		const resultadoEspacios = GenerarActividadSchema.safeParse(datosEspacios);
		expect(resultadoEspacios.success).toBe(false);
	});

	it("rechaza un título de 3001 caracteres", () => {
		const datos = {
			idClase: "c-101",
			titulo: "T".repeat(3001),
			fechaVencimiento: fechaValida,
			idPlantilla: "p-1",
		};

		const resultado = GenerarActividadSchema.safeParse(datos);
		expect(resultado.success).toBe(false);
	});

	it("rechaza fecha con formato invalido sin anio mes dia", () => {
		const datos = {
			idClase: "c-101",
			titulo: "Actividad",
			fechaVencimiento: "invalido",
			idPlantilla: "p-1",
		};
		const resultado = GenerarActividadSchema.safeParse(datos);
		expect(resultado.success).toBe(false);

		const datosCero = {
			idClase: "c-101",
			titulo: "Actividad",
			fechaVencimiento: "2026-00-10",
			idPlantilla: "p-1",
		};
		expect(GenerarActividadSchema.safeParse(datosCero).success).toBe(false);
	});

	it("rechaza fecha anterior a hoy", () => {
		const datos = {
			idClase: "c-101",
			titulo: "Actividad",
			fechaVencimiento: "2020-01-01",
			idPlantilla: "p-1",
		};
		const resultado = GenerarActividadSchema.safeParse(datos);
		expect(resultado.success).toBe(false);
		expect(resultado.error?.issues[0]?.message).toBe(
			"La fecha de vencimiento no puede ser anterior al día de hoy",
		);
	});

	it("rechaza idClase o idPlantilla vacios", () => {
		expect(
			GenerarActividadSchema.safeParse({
				idClase: "",
				titulo: "T",
				fechaVencimiento: fechaValida,
				idPlantilla: "p-1",
			}).success,
		).toBe(false);

		expect(
			GenerarActividadSchema.safeParse({
				idClase: "c-1",
				titulo: "T",
				fechaVencimiento: fechaValida,
				idPlantilla: "",
			}).success,
		).toBe(false);
	});

	it("valida descripcion opcional y longitud maxima", () => {
		expect(
			GenerarActividadSchema.safeParse({
				idClase: "c-1",
				titulo: "T",
				fechaVencimiento: fechaValida,
				idPlantilla: "p-1",
				descripcion: "d".repeat(2000),
				horaVencimiento: "14:00",
				idTema: "tema-1",
			}).success,
		).toBe(true);

		expect(
			GenerarActividadSchema.safeParse({
				idClase: "c-1",
				titulo: "T",
				fechaVencimiento: fechaValida,
				idPlantilla: "p-1",
				descripcion: "d".repeat(2001),
			}).success,
		).toBe(false);
	});
});
