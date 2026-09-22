import { describe, expect, it, vi } from "vitest";
import {
	ejecutarLimpiezaSesion,
	registrarLimpiadorSesion,
} from "../eventosSesion";

describe("eventosSesion", () => {
	it("ejecuta los limpiadores registrados al disparar la limpieza de sesión", () => {
		const limpiador1 = vi.fn();
		const limpiador2 = vi.fn();

		const desuscribir1 = registrarLimpiadorSesion(limpiador1);
		const desuscribir2 = registrarLimpiadorSesion(limpiador2);

		ejecutarLimpiezaSesion();

		expect(limpiador1).toHaveBeenCalledTimes(1);
		expect(limpiador2).toHaveBeenCalledTimes(1);

		desuscribir1();
		ejecutarLimpiezaSesion();

		expect(limpiador1).toHaveBeenCalledTimes(1);
		expect(limpiador2).toHaveBeenCalledTimes(2);

		desuscribir2();
	});

	it("no interrumpe la ejecución si un limpiador lanza un error", () => {
		const limpiadorConFallo = vi.fn(() => {
			throw new Error("Fallo en limpiador");
		});
		const limpiadorExitoso = vi.fn();

		const des1 = registrarLimpiadorSesion(limpiadorConFallo);
		const des2 = registrarLimpiadorSesion(limpiadorExitoso);

		expect(() => ejecutarLimpiezaSesion()).not.toThrow();
		expect(limpiadorConFallo).toHaveBeenCalledTimes(1);
		expect(limpiadorExitoso).toHaveBeenCalledTimes(1);

		des1();
		des2();
	});
});
