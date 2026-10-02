import { beforeEach, describe, expect, it, vi } from "vitest";
import * as configApi from "@/features/configuracion/api/configuracion.api.ts";
import {
	esConfiguracionListaParaActividades,
	sonCredencialesIguales,
	useConfiguracionStore,
} from "@/features/configuracion/store/useConfiguracionStore.ts";
import { ejecutarLimpiezaSesion } from "@/utils/eventosSesion.ts";

describe("useConfiguracionStore", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		useConfiguracionStore.getState().limpiar();
	});

	describe("sonCredencialesIguales", () => {
		it("retorna false si alguna de las credenciales es nula o indefinida", () => {
			expect(sonCredencialesIguales(null, undefined)).toBe(false);
			expect(
				sonCredencialesIguales(
					{
						googleClientId: "a",
						googleClientSecret: "b",
						googleRefreshToken: "c",
					},
					null,
				),
			).toBe(false);
		});

		it("retorna true cuando todos los campos principales coinciden ignorando espacios", () => {
			const a = {
				googleClientId: " id-1 ",
				googleClientSecret: " sec-1 ",
				googleRefreshToken: " tok-1 ",
			};
			const b = {
				googleClientId: "id-1",
				googleClientSecret: "sec-1",
				googleRefreshToken: "tok-1",
			};
			expect(sonCredencialesIguales(a, b)).toBe(true);
		});

		it("soporta propiedades indefinidas usando fallback de string vacio tanto en a como en b", () => {
			const a = {
				googleClientId: undefined as unknown as string,
				googleClientSecret: undefined as unknown as string,
				googleRefreshToken: undefined as unknown as string,
			};
			const b = {
				googleClientId: "",
				googleClientSecret: "",
				googleRefreshToken: "",
			};
			expect(sonCredencialesIguales(a, b)).toBe(true);
			expect(sonCredencialesIguales(b, a)).toBe(true);
		});

		it("retorna false si algun campo difiere", () => {
			const base = {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
			};
			expect(sonCredencialesIguales(base, { ...base, googleClientId: "otro" })).toBe(false);
			expect(sonCredencialesIguales(base, { ...base, googleClientSecret: "otro" })).toBe(false);
			expect(sonCredencialesIguales(base, { ...base, googleRefreshToken: "otro" })).toBe(false);
		});
	});

	describe("esConfiguracionListaParaActividades", () => {
		it("retorna false si no hay credenciales", () => {
			expect(esConfiguracionListaParaActividades(null, "conectado")).toBe(false);
		});

		it("retorna true solo si esta conectado, googleVerificado es true y driveVerificado con folderId", () => {
			const credsCompletas = {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
				googleVerificado: true,
				googleDriveFolderId: "folder-123",
				driveVerificado: true,
			};

			expect(esConfiguracionListaParaActividades(credsCompletas, "conectado")).toBe(true);
			expect(esConfiguracionListaParaActividades(credsCompletas, "guardado_pendiente")).toBe(false);
			expect(
				esConfiguracionListaParaActividades(
					{ ...credsCompletas, googleVerificado: false },
					"conectado",
				),
			).toBe(false);
			expect(
				esConfiguracionListaParaActividades(
					{ ...credsCompletas, googleDriveFolderId: null },
					"conectado",
				),
			).toBe(false);
			expect(
				esConfiguracionListaParaActividades(
					{ ...credsCompletas, driveVerificado: false },
					"conectado",
				),
			).toBe(false);
		});
	});

	describe("cargarConfiguracion", () => {
		it("retorna credenciales cacheadas si ya estaba cargado y no se fuerza", async () => {
			useConfiguracionStore.setState({
				cargado: true,
				credenciales: {
					googleClientId: "cached",
					googleClientSecret: "sec",
					googleRefreshToken: "tok",
				},
			});

			const spy = vi.spyOn(configApi, "obtenerConfiguracion");
			const creds = await useConfiguracionStore.getState().cargarConfiguracion();
			expect(creds.googleClientId).toBe("cached");
			expect(spy).not.toHaveBeenCalled();
		});

		it("retorna credenciales si cargando es true", async () => {
			useConfiguracionStore.setState({ cargando: true });
			const spy = vi.spyOn(configApi, "obtenerConfiguracion");
			await useConfiguracionStore.getState().cargarConfiguracion(true);
			expect(spy).not.toHaveBeenCalled();
		});

		it("carga configuracion con estado conectado", async () => {
			vi.spyOn(configApi, "obtenerConfiguracion").mockResolvedValue({
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
				googleDriveFolderId: "folder-1",
				googleDriveFolderName: "Carpeta",
				googleVerificado: true,
				driveVerificado: true,
			});

			const creds = await useConfiguracionStore.getState().cargarConfiguracion();
			expect(creds.googleClientId).toBe("id");
			expect(useConfiguracionStore.getState().estadoConexion).toBe("conectado");
			expect(useConfiguracionStore.getState().cargado).toBe(true);
		});

		it("carga configuracion con estado guardado_pendiente si no esta verificado y aplica fallbacks nulos", async () => {
			vi.spyOn(configApi, "obtenerConfiguracion").mockResolvedValue({
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
				googleDriveFolderId: null,
				googleDriveFolderName: null,
				googleVerificado: undefined as unknown as boolean,
				driveVerificado: undefined as unknown as boolean,
			});

			await useConfiguracionStore.getState().cargarConfiguracion(true);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("guardado_pendiente");
			expect(useConfiguracionStore.getState().credenciales.googleVerificado).toBe(false);
			expect(useConfiguracionStore.getState().credenciales.driveVerificado).toBe(false);
		});

		it("determina no_configurado si no contiene credenciales", async () => {
			vi.spyOn(configApi, "obtenerConfiguracion").mockResolvedValue({
				googleClientId: "",
				googleClientSecret: "",
				googleRefreshToken: "",
				googleDriveFolderId: null,
				googleDriveFolderName: null,
				googleVerificado: false,
				driveVerificado: false,
			});

			await useConfiguracionStore.getState().cargarConfiguracion(true);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("no_configurado");
		});

		it("restablece cargando a false si la api arroja error", async () => {
			vi.spyOn(configApi, "obtenerConfiguracion").mockRejectedValue(new Error("Fallo de red"));

			await expect(useConfiguracionStore.getState().cargarConfiguracion(true)).rejects.toThrow(
				"Fallo de red",
			);
			expect(useConfiguracionStore.getState().cargando).toBe(false);
		});
	});

	describe("guardarConfiguracion", () => {
		it("guarda y verifica exitosamente con estado conectado", async () => {
			vi.spyOn(configApi, "verificarConfiguracion").mockResolvedValue({
				valido: true,
				mensaje: "Exito",
			});
			vi.spyOn(configApi, "actualizarConfiguracion").mockResolvedValue();

			const datos = {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
			};
			const res = await useConfiguracionStore.getState().guardarConfiguracion(datos);
			expect(res.valido).toBe(true);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("conectado");
		});

		it("maneja fallo de verificacion pero guarda con estado guardado_pendiente", async () => {
			vi.spyOn(configApi, "verificarConfiguracion").mockRejectedValue(new Error("Token invalido"));
			vi.spyOn(configApi, "actualizarConfiguracion").mockResolvedValue();

			const datos = {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
			};
			const res = await useConfiguracionStore.getState().guardarConfiguracion(datos);
			expect(res.valido).toBe(false);
			expect(res.mensaje).toContain("Token invalido");
			expect(useConfiguracionStore.getState().estadoConexion).toBe("guardado_pendiente");
		});

		it("maneja fallo no Error en verificacion al guardar", async () => {
			vi.spyOn(configApi, "verificarConfiguracion").mockRejectedValue("Error string");
			vi.spyOn(configApi, "actualizarConfiguracion").mockResolvedValue();

			const datos = {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
			};
			const res = await useConfiguracionStore.getState().guardarConfiguracion(datos);
			expect(res.valido).toBe(false);
			expect(res.mensaje).toBe(
				"Credenciales guardadas, pero no verificadas: No se pudo verificar la conexión",
			);
		});

		it("maneja error en actualizarConfiguracion y asigna estado error", async () => {
			vi.spyOn(configApi, "verificarConfiguracion").mockResolvedValue({
				valido: true,
				mensaje: "OK",
			});
			vi.spyOn(configApi, "actualizarConfiguracion").mockRejectedValue(
				new Error("Error guardando"),
			);

			const datos = {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
			};
			await expect(useConfiguracionStore.getState().guardarConfiguracion(datos)).rejects.toThrow(
				"Error guardando",
			);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("error");
		});
	});

	describe("verificarConexion", () => {
		it("actualiza estado a conectado si la verificacion es valida", async () => {
			vi.spyOn(configApi, "verificarConfiguracion").mockResolvedValue({
				valido: true,
				mensaje: "Conectado",
			});

			const res = await useConfiguracionStore.getState().verificarConexion();
			expect(res.valido).toBe(true);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("conectado");
			expect(useConfiguracionStore.getState().credenciales.googleVerificado).toBe(true);
		});

		it("lanza error si la respuesta de verificacion tiene valido false", async () => {
			vi.spyOn(configApi, "verificarConfiguracion").mockResolvedValue({
				valido: false,
				mensaje: "Error de credenciales",
			});

			await expect(useConfiguracionStore.getState().verificarConexion()).rejects.toThrow(
				"Error de credenciales",
			);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("error");
		});
	});

	describe("actualizarCarpetaDrive", () => {
		it("actualiza id y nombre con valor verificado explicito o inferido", () => {
			useConfiguracionStore.getState().actualizarCarpetaDrive("folder-99", "Mi Carpeta", true);
			expect(useConfiguracionStore.getState().credenciales.googleDriveFolderId).toBe("folder-99");
			expect(useConfiguracionStore.getState().credenciales.googleDriveFolderName).toBe(
				"Mi Carpeta",
			);
			expect(useConfiguracionStore.getState().credenciales.driveVerificado).toBe(true);

			useConfiguracionStore.getState().actualizarCarpetaDrive("folder-100", null);
			expect(useConfiguracionStore.getState().credenciales.driveVerificado).toBe(true);
		});
	});

	describe("limpiador de sesion", () => {
		it("limpia el store al disparar la limpieza de sesion global", () => {
			useConfiguracionStore.setState({
				cargado: true,
				estadoConexion: "conectado",
			});
			ejecutarLimpiezaSesion();
			expect(useConfiguracionStore.getState().cargado).toBe(false);
			expect(useConfiguracionStore.getState().estadoConexion).toBe("no_configurado");
		});
	});
});
