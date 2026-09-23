import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as authApi from "@/features/auth/api/auth.api.ts";
import * as setupApi from "@/features/setup/api/setup.api.ts";
import { useAppStore } from "@/store/useAppStore.ts";
import { fetchSeguro } from "@/utils/fetch.ts";
import * as sesionUtils from "@/utils/sesion.ts";

describe("useAppStore", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.restoreAllMocks();
		useAppStore.setState({
			configurado: null,
			autenticado: false,
			usuarioEmail: null,
			estadoVerificado: false,
			errorVerificacion: null,
		});
	});

	afterEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.unstubAllGlobals();
	});

	it("setConfigurado actualiza estado y almacena en localStorage si es true", () => {
		useAppStore.getState().setConfigurado(true);
		expect(useAppStore.getState().configurado).toBe(true);
		expect(localStorage.getItem("sistema_configurado")).toBe("true");

		useAppStore.getState().setConfigurado(false);
		expect(useAppStore.getState().configurado).toBe(false);
	});

	it("setAutenticado guarda sesion cuando es true", () => {
		useAppStore.getState().setAutenticado(true, "docente@ulasalle.edu.pe", "token");
		expect(useAppStore.getState().autenticado).toBe(true);
		expect(useAppStore.getState().usuarioEmail).toBe("docente@ulasalle.edu.pe");
	});

	it("setAutenticado limpia sesion cuando es false", () => {
		useAppStore.getState().setAutenticado(true, "user@test.com");
		useAppStore.getState().setAutenticado(false);
		expect(useAppStore.getState().autenticado).toBe(false);
	});

	it("setAutenticado conserva usuarioEmail previo si email es undefined", () => {
		useAppStore.setState({ usuarioEmail: "previo@ulasalle.edu.pe" });
		useAppStore.getState().setAutenticado(true);
		expect(useAppStore.getState().usuarioEmail).toBe("previo@ulasalle.edu.pe");
	});

	it("cerrarSesion ejecuta logout en api y resetea estado aun si api falla", async () => {
		vi.spyOn(authApi, "logout").mockRejectedValueOnce(new Error("Fallo de red"));

		await useAppStore.getState().cerrarSesion();
		expect(useAppStore.getState().autenticado).toBe(false);
		expect(useAppStore.getState().usuarioEmail).toBeNull();
	});

	it("maneja expiracion proactiva al recibir 401 en fetchSeguro", async () => {
		useAppStore.setState({
			autenticado: true,
			usuarioEmail: "user@ulasalle.edu.pe",
		});
		const replaceSpy = vi.fn();
		vi.stubGlobal("location", {
			pathname: "/plantillas",
			replace: replaceSpy,
		});
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

		await fetchSeguro("/api/otra-ruta");

		expect(useAppStore.getState().autenticado).toBe(false);
		expect(useAppStore.getState().usuarioEmail).toBeNull();
		expect(replaceSpy).toHaveBeenCalledWith("/login");
	});

	it("no redirige si ya se encuentra en /login durante expiracion proactiva", async () => {
		useAppStore.setState({
			autenticado: true,
			usuarioEmail: "user@ulasalle.edu.pe",
		});
		const replaceSpy = vi.fn();
		vi.stubGlobal("location", {
			pathname: "/login",
			replace: replaceSpy,
		});
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

		await fetchSeguro("/api/otra-ruta");

		expect(replaceSpy).not.toHaveBeenCalled();
	});

	describe("verificarEstadoGlobal", () => {
		it("reutiliza la misma promesa si ya hay una verificacion en curso", async () => {
			let resolver: (v: boolean) => void = () => {};
			const pendiente = new Promise<boolean>((resolve) => {
				resolver = resolve;
			});
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(false);
			vi.spyOn(setupApi, "verificarEstadoSistema").mockReturnValue(pendiente);

			const p1 = useAppStore.getState().verificarEstadoGlobal();
			const p2 = useAppStore.getState().verificarEstadoGlobal();
			expect(p1).toBe(p2);

			resolver(true);
			await p1;
		});

		it("procesa autenticacion exitosa si habia sesion activa", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(true);
			vi.spyOn(authApi, "verificarAutenticacion").mockResolvedValue({
				autenticado: true,
				email: "admin@ulasalle.edu.pe",
			});

			await useAppStore.getState().verificarEstadoGlobal();

			expect(useAppStore.getState().configurado).toBe(true);
			expect(useAppStore.getState().autenticado).toBe(true);
			expect(useAppStore.getState().usuarioEmail).toBe("admin@ulasalle.edu.pe");
			expect(useAppStore.getState().estadoVerificado).toBe(true);
			expect(localStorage.getItem("sistema_configurado")).toBe("true");
		});

		it("verifica setup del sistema si no habia sesion activa", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(false);
			vi.spyOn(setupApi, "verificarEstadoSistema").mockResolvedValue(true);

			await useAppStore.getState().verificarEstadoGlobal();

			expect(useAppStore.getState().configurado).toBe(true);
			expect(useAppStore.getState().autenticado).toBe(false);
			expect(useAppStore.getState().usuarioEmail).toBeNull();
			expect(useAppStore.getState().estadoVerificado).toBe(true);
		});

		it("captura errores de excepcion y guarda mensaje en errorVerificacion", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(false);
			vi.spyOn(setupApi, "verificarEstadoSistema").mockRejectedValue(
				new Error("Error conectando al backend"),
			);

			await useAppStore.getState().verificarEstadoGlobal();

			expect(useAppStore.getState().configurado).toBeNull();
			expect(useAppStore.getState().estadoVerificado).toBe(true);
			expect(useAppStore.getState().errorVerificacion).toBe("Error conectando al backend");
		});

		it("captura errores que no son instancias de Error", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(false);
			vi.spyOn(setupApi, "verificarEstadoSistema").mockRejectedValue("Error string");

			await useAppStore.getState().verificarEstadoGlobal();

			expect(useAppStore.getState().errorVerificacion).toBe(
				"No se pudo verificar el estado del sistema",
			);
		});

		it("descarta el resultado si la sesion fue modificada concurrentemente", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(true);
			vi.spyOn(authApi, "verificarAutenticacion").mockImplementation(async () => {
				useAppStore.getState().setConfigurado(false);
				return { autenticado: true, email: "otro@test.com" };
			});

			await useAppStore.getState().verificarEstadoGlobal();
			expect(useAppStore.getState().autenticado).toBe(false);
		});

		it("descarta el error si la sesion fue modificada concurrentemente durante fallo", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(false);
			vi.spyOn(setupApi, "verificarEstadoSistema").mockImplementation(async () => {
				useAppStore.getState().setConfigurado(false);
				throw new Error("Fallo");
			});

			await useAppStore.getState().verificarEstadoGlobal();
			expect(useAppStore.getState().errorVerificacion).toBeNull();
		});

		it("limpia sesion con sesion_expirada si habia sesion pero autenticacion retorna false", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(true);
			vi.spyOn(authApi, "verificarAutenticacion").mockResolvedValue({
				autenticado: false,
			});
			vi.spyOn(setupApi, "verificarEstadoSistema").mockResolvedValue(true);
			const limpiarSesionSpy = vi.spyOn(sesionUtils, "limpiarSesion");

			await useAppStore.getState().verificarEstadoGlobal();

			expect(limpiarSesionSpy).toHaveBeenCalledWith("sesion_expirada");
			expect(useAppStore.getState().autenticado).toBe(false);
		});

		it("guarda sesion cuando autenticado es true pero email es null", async () => {
			vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(true);
			vi.spyOn(authApi, "verificarAutenticacion").mockResolvedValue({
				autenticado: true,
				email: null,
			});

			await useAppStore.getState().verificarEstadoGlobal();

			expect(useAppStore.getState().autenticado).toBe(true);
			expect(useAppStore.getState().usuarioEmail).toBeNull();
		});
	});
});
