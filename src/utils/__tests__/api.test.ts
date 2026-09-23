import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ejecutarAccion, ejecutarPeticion } from "@/utils/api";

describe("api helpers", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const PruebaSchema = z.object({
		nombre: z.string(),
	});

	it("ejecutarPeticion deserializa los datos correctamente", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ datos: { nombre: "Investigación" } }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const resultado = await ejecutarPeticion(
			"/api/test",
			{ method: "GET" },
			PruebaSchema,
			"Error en test",
		);

		expect(resultado).toEqual({ nombre: "Investigación" });
	});

	it("ejecutarPeticion lanza error con el mensaje de la API si status es error", async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({ mensaje: "El recurso solicitado no existe" }),
				{
					status: 404,
					headers: { "Content-Type": "application/json" },
				},
			),
		);

		await expect(
			ejecutarPeticion(
				"/api/test",
				{ method: "GET" },
				PruebaSchema,
				"Error por defecto",
			),
		).rejects.toThrow("El recurso solicitado no existe");
	});

	it("ejecutarAccion completa satisfactoriamente en status 200", async () => {
		fetchMock.mockResolvedValue(
			new Response(null, {
				status: 200,
			}),
		);

		await expect(
			ejecutarAccion("/api/action", { method: "POST" }, "Error de acción"),
		).resolves.toBeUndefined();
	});

	it("ejecutarAccion lanza error si el status no es ok", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error: "No autorizado" }), {
				status: 403,
				headers: { "Content-Type": "application/json" },
			}),
		);

		await expect(
			ejecutarAccion("/api/action", { method: "POST" }, "Error de acción"),
		).rejects.toThrow("No autorizado");
	});
});
