import { afterEach, describe, expect, it, vi } from "vitest";
import { verificarEstadoSistema } from "@/features/setup/api/setup.api";

afterEach(() => vi.unstubAllGlobals());

describe("verificarEstadoSistema", () => {
	it("no convierte un fallo de red en sistema configurado", async () => {
		localStorage.setItem("sistema_configurado", "true");
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new Error("sin conexión")),
		);

		await expect(verificarEstadoSistema()).rejects.toThrow();
	});
});
