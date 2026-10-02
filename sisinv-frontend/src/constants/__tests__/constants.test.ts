import { describe, expect, it } from "vitest";
import { ELEMENTOS_NAVEGACION } from "@/constants/navigation.ts";
import { VALIDATION_LIMITS } from "@/constants/validations.ts";

describe("constants", () => {
	it("contiene los 5 elementos de navegacion principales del sistema", () => {
		expect(ELEMENTOS_NAVEGACION).toHaveLength(5);
		const ids = ELEMENTOS_NAVEGACION.map((item) => item.id);
		expect(ids).toEqual([
			"actividades",
			"reportes",
			"plantillas",
			"configuracion",
			"documentacion",
		]);

		for (const item of ELEMENTOS_NAVEGACION) {
			expect(item.id).toBeTruthy();
			expect(item.titulo).toBeTruthy();
			expect(item.etiquetaMenu).toBeTruthy();
			expect(item.icono).toBeDefined();
			expect(item.descripcion).toBeTruthy();
		}
	});

	it("define los limites de validacion esperados", () => {
		expect(VALIDATION_LIMITS.MAX_EMAIL).toBe(150);
		expect(VALIDATION_LIMITS.MIN_PASSWORD).toBe(8);
		expect(VALIDATION_LIMITS.MAX_PASSWORD).toBe(255);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_ID).toBe(500);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_CLIENT_SECRET).toBe(1000);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_REFRESH_TOKEN).toBe(1000);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID).toBe(255);
		expect(VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_NAME).toBe(255);
	});
});
