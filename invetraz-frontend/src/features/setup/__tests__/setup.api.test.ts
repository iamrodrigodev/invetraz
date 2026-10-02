import { afterEach, describe, expect, it, vi } from "vitest";
import { crearAdmin, verificarEstadoSistema } from "@/features/setup/api/setup.api.ts";

afterEach(() => {
	vi.unstubAllGlobals();
	localStorage.clear();
});

describe("setup.api", () => {
	describe("verificarEstadoSistema", () => {
		it("no convierte un fallo de red en sistema configurado", async () => {
			localStorage.setItem("sistema_configurado", "true");
			vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("sin conexión")));

			await expect(verificarEstadoSistema()).rejects.toThrow();
		});

		it("guarda sistema_configurado en localStorage cuando configurado es true", async () => {
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue({
					ok: true,
					status: 200,
					headers: new Headers({ "content-type": "application/json" }),
					json: async () => ({ datos: { configurado: true } }),
				}),
			);

			const configurado = await verificarEstadoSistema();
			expect(configurado).toBe(true);
			expect(localStorage.getItem("sistema_configurado")).toBe("true");
		});

		it("remueve sistema_configurado de localStorage cuando configurado es false", async () => {
			localStorage.setItem("sistema_configurado", "true");
			vi.stubGlobal(
				"fetch",
				vi.fn().mockResolvedValue({
					ok: true,
					status: 200,
					headers: new Headers({ "content-type": "application/json" }),
					json: async () => ({ datos: { configurado: false } }),
				}),
			);

			const configurado = await verificarEstadoSistema();
			expect(configurado).toBe(false);
			expect(localStorage.getItem("sistema_configurado")).toBeNull();
		});

		it("funciona en entorno sin window sin fallar", async () => {
			const originalWindow = globalThis.window;
			try {
				(globalThis as { window?: unknown }).window = undefined;
				vi.stubGlobal(
					"fetch",
					vi.fn().mockResolvedValue({
						ok: true,
						status: 200,
						headers: new Headers({ "content-type": "application/json" }),
						json: async () => ({ datos: { configurado: true } }),
					}),
				);

				const configurado = await verificarEstadoSistema();
				expect(configurado).toBe(true);
			} finally {
				globalThis.window = originalWindow;
			}
		});
	});

	describe("crearAdmin", () => {
		it("ejecuta post con las credenciales del nuevo administrador", async () => {
			const mockFetch = vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
			});
			vi.stubGlobal("fetch", mockFetch);

			const peticion = {
				email: "admin@ulasalle.edu.pe",
				password: "Password123",
			};
			await expect(crearAdmin(peticion)).resolves.toBeUndefined();
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("/setup/crear-admin"),
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(peticion),
				}),
			);
		});
	});
});
