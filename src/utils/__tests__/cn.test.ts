import { describe, expect, it } from "vitest";
import { cn } from "@/utils/cn.ts";

describe("cn", () => {
	it("retorna string vacio sin argumentos", () => {
		expect(cn()).toBe("");
	});

	it("ignora valores falsy y combina strings y numeros", () => {
		expect(cn("clase-1", null, undefined, false, 0, "clase-2", 42)).toBe("clase-1 clase-2 42");
	});

	it("ignora booleanos true", () => {
		expect(cn("clase-1", true, "clase-2")).toBe("clase-1 clase-2");
	});

	it("soporta arrays anidados recursivos", () => {
		expect(cn(["clase-a", ["clase-b", ["clase-c"]]])).toBe("clase-a clase-b clase-c");
	});

	it("ignora arrays anidados vacios", () => {
		expect(cn(["clase-a", []])).toBe("clase-a");
	});

	it("soporta objetos de clases condicionales", () => {
		expect(
			cn({
				activo: true,
				deshabilitado: false,
				visible: null,
				oculto: undefined,
				resaltado: true,
			}),
		).toBe("activo resaltado");
	});

	it("combina tipos mixtos correctamente", () => {
		expect(cn("base", { "mod-1": true, "mod-2": false }, ["array-1", false, "array-2"], null)).toBe(
			"base mod-1 array-1 array-2",
		);
	});
});
