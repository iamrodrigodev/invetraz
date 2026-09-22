import { describe, expect, it } from "vitest";
import { GenerarActividadSchema } from "../schemas/actividades.schemas";

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
});
