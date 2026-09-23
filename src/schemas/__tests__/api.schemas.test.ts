import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
	crearApiRespuestaSchema,
	EstadoSetupRespuestaSchema,
	LoginRespuestaSchema,
	VerificarAutenticacionRespuestaSchema,
} from "@/schemas/api.schemas.ts";

describe("api.schemas", () => {
	describe("VerificarAutenticacionRespuestaSchema", () => {
		it("valida respuestas autenticadas y no autenticadas con email opcional o null", () => {
			expect(
				VerificarAutenticacionRespuestaSchema.safeParse({
					autenticado: true,
					email: "user@ulasalle.edu.pe",
				}).success,
			).toBe(true);

			expect(
				VerificarAutenticacionRespuestaSchema.safeParse({
					autenticado: false,
					email: null,
				}).success,
			).toBe(true);

			expect(
				VerificarAutenticacionRespuestaSchema.safeParse({
					autenticado: false,
				}).success,
			).toBe(true);
		});
	});

	describe("LoginRespuestaSchema", () => {
		it("valida token no vacio", () => {
			expect(LoginRespuestaSchema.safeParse({ tokenAcceso: "jwt.token.aquí" }).success).toBe(true);
			expect(LoginRespuestaSchema.safeParse({ tokenAcceso: "" }).success).toBe(false);
		});
	});

	describe("EstadoSetupRespuestaSchema", () => {
		it("valida bandera configurado", () => {
			expect(EstadoSetupRespuestaSchema.safeParse({ configurado: true }).success).toBe(true);
			expect(EstadoSetupRespuestaSchema.safeParse({ configurado: false }).success).toBe(true);
		});
	});

	describe("crearApiRespuestaSchema", () => {
		const TestSchema = crearApiRespuestaSchema(z.object({ id: z.number() }));

		it("valida la estructura estandar de respuesta del backend", () => {
			const res = TestSchema.safeParse({
				estado: 200,
				mensaje: "OK",
				idRastreo: "trace-123",
				ruta: "/api/test",
				fechaHora: "2026-09-23T10:00:00Z",
				datos: { id: 10 },
				errores: null,
			});
			expect(res.success).toBe(true);
		});

		it("permite omitir campos opcionales", () => {
			const res = TestSchema.safeParse({
				datos: { id: 5 },
			});
			expect(res.success).toBe(true);
		});
	});
});
