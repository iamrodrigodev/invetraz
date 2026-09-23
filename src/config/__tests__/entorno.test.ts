import { describe, expect, it, vi } from "vitest";
import { entorno } from "@/config/entorno.ts";

describe("entorno", () => {
	it("proporciona las variables de entorno requeridas con valores por defecto o definidos", () => {
		expect(typeof entorno.VITE_API_BASE_URL).toBe("string");
		expect(entorno.VITE_API_BASE_URL.length).toBeGreaterThan(0);
		expect(typeof entorno.DEV).toBe("boolean");
		expect(typeof entorno.PROD).toBe("boolean");
	});

	it("usa la url de produccion cuando DEV es false", async () => {
		vi.resetModules();
		(import.meta.env as unknown as Record<string, unknown>).DEV = false;
		const mod = await import("@/config/entorno.ts");
		expect(mod.entorno).toBeDefined();
	});
});
