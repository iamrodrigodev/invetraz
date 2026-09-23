import { afterEach, describe, expect, it, vi } from "vitest";
import {
	cambiarPassword,
	login,
	logout,
	verificarAutenticacion,
	verificarPasswordActual,
} from "@/features/auth/api/auth.api.ts";

describe("auth.api", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("login ejecuta post y retorna LoginRespuesta", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: { tokenAcceso: "jwt.token.123" },
				}),
			}),
		);

		const res = await login({
			email: "admin@ulasalle.edu.pe",
			password: "Password123",
		});
		expect(res.tokenAcceso).toBe("jwt.token.123");
	});

	it("verificarAutenticacion retorna falso si responde con 401", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: false,
				status: 401,
				headers: new Headers({ "content-type": "application/json" }),
			}),
		);

		const res = await verificarAutenticacion();
		expect(res).toEqual({ autenticado: false });
	});

	it("verificarAutenticacion retorna autenticado y email cuando es 200", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: {
						autenticado: true,
						email: "admin@ulasalle.edu.pe",
					},
				}),
			}),
		);

		const res = await verificarAutenticacion();
		expect(res).toEqual({
			autenticado: true,
			email: "admin@ulasalle.edu.pe",
		});
	});

	it("verificarAutenticacion normaliza email a null si no viene en respuesta", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: {
						autenticado: true,
					},
				}),
			}),
		);

		const res = await verificarAutenticacion();
		expect(res).toEqual({
			autenticado: true,
			email: null,
		});
	});

	it("logout ejecuta peticion post sin retornar valor", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await expect(logout()).resolves.toBeUndefined();
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/auth/logout"),
			expect.objectContaining({ method: "POST" }),
		);
	});

	it("verificarPasswordActual ejecuta peticion post con contraseña", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await expect(verificarPasswordActual("Password123")).resolves.toBeUndefined();
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/auth/verificar-password"),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ password: "Password123" }),
			}),
		);
	});

	it("cambiarPassword ejecuta peticion put con clave actual y nueva", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		await expect(cambiarPassword("ClaveVieja123", "ClaveNueva123")).resolves.toBeUndefined();
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/auth/cambiar-password"),
			expect.objectContaining({
				method: "PUT",
				body: JSON.stringify({
					passwordActual: "ClaveVieja123",
					passwordNueva: "ClaveNueva123",
				}),
			}),
		);
	});
});
