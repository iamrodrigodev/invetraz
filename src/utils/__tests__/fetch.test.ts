import { afterEach, describe, expect, it, vi } from "vitest";
import { alExpirarSesion, fetchSeguro } from "@/utils/fetch";

afterEach(() => {
	vi.unstubAllGlobals();
	alExpirarSesion(() => {});
});

describe("fetchSeguro", () => {
	it("aplica credenciales sin modificar las opciones recibidas", async () => {
		const llamada = vi
			.fn()
			.mockResolvedValue(new Response(null, { status: 200 }));
		vi.stubGlobal("fetch", llamada);
		const opciones: RequestInit = { method: "GET" };

		await fetchSeguro("/recurso", opciones);

		expect(opciones.credentials).toBeUndefined();
		expect(llamada).toHaveBeenCalledWith("/recurso", {
			method: "GET",
			credentials: "include",
		});
	});

	it("expira en 401, pero conserva la sesión en 403", async () => {
		const expirar = vi.fn();
		alExpirarSesion(expirar);
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(new Response(null, { status: 403 }))
				.mockResolvedValueOnce(new Response(null, { status: 401 })),
		);

		await fetchSeguro("/recurso");
		expect(expirar).not.toHaveBeenCalled();
		await fetchSeguro("/recurso");
		expect(expirar).toHaveBeenCalledOnce();
	});
});
