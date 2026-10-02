import { describe, expect, it, vi } from "vitest";
import { entorno } from "@/config/entorno.ts";

describe("entorno", () => {
	it("proporciona las variables de entorno requeridas con valores por defecto o definidos", () => {
		expect(typeof entorno.VITE_API_BASE_URL).toBe("string");
		expect(entorno.VITE_API_BASE_URL.length).toBeGreaterThan(0);
		expect(typeof entorno.DEV).toBe("boolean");
		expect(typeof entorno.PROD).toBe("boolean");
	});

	it("usa la api productiva cuando la app se compila para produccion", async () => {
		vi.resetModules();
		(import.meta.env as unknown as Record<string, unknown>).DEV = false;
		(import.meta.env as unknown as Record<string, unknown>).PROD = true;

		const mod = await import("@/config/entorno.ts");

		expect(mod.entorno.VITE_API_BASE_URL).toBe("https://api-investigacion.iamrodrigo.dev/api/v1");
	});

	it("usa la api local cuando la app no se compila para produccion", async () => {
		vi.resetModules();
		(import.meta.env as unknown as Record<string, unknown>).DEV = true;
		(import.meta.env as unknown as Record<string, unknown>).PROD = false;

		const mod = await import("@/config/entorno.ts");

		expect(mod.entorno.VITE_API_BASE_URL).toBe("http://localhost:8080/api/v1");
	});
});
