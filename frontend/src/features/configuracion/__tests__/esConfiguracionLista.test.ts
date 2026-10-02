import { describe, expect, it } from "vitest";
import { esConfiguracionListaParaActividades } from "@/features/configuracion/store/useConfiguracionStore.ts";
import type { ActualizarCredencialesPeticion } from "@/features/configuracion/types/ActualizarCredencialesPeticion.ts";

describe("esConfiguracionListaParaActividades", () => {
	const credencialesCompletas: ActualizarCredencialesPeticion = {
		googleClientId: "client-123",
		googleClientSecret: "secret-123",
		googleRefreshToken: "token-123",
		googleDriveFolderId: "1NQkD03a9be_XTW2PjKrFKBXEucdInBtM",
		googleDriveFolderName: "Carpeta Tesis",
		googleVerificado: true,
		driveVerificado: true,
	};

	it("retorna true cuando Google y Drive están verificados y conectados", () => {
		expect(esConfiguracionListaParaActividades(credencialesCompletas, "conectado")).toBe(true);
	});

	it("retorna false si el estado de conexión no es conectado", () => {
		expect(esConfiguracionListaParaActividades(credencialesCompletas, "guardado_pendiente")).toBe(
			false,
		);

		expect(esConfiguracionListaParaActividades(credencialesCompletas, "no_configurado")).toBe(
			false,
		);
	});

	it("retorna false si Google no está verificado", () => {
		const sinGoogleVerificado = {
			...credencialesCompletas,
			googleVerificado: false,
		};
		expect(esConfiguracionListaParaActividades(sinGoogleVerificado, "conectado")).toBe(false);
	});

	it("retorna false si no hay ID de carpeta de Drive", () => {
		const sinCarpeta = {
			...credencialesCompletas,
			googleDriveFolderId: null,
		};
		expect(esConfiguracionListaParaActividades(sinCarpeta, "conectado")).toBe(false);
	});

	it("retorna false si la carpeta de Drive no está verificada", () => {
		const sinDriveVerificado = {
			...credencialesCompletas,
			driveVerificado: false,
		};
		expect(esConfiguracionListaParaActividades(sinDriveVerificado, "conectado")).toBe(false);
	});

	it("retorna false si credenciales es nulo o indefinido", () => {
		expect(esConfiguracionListaParaActividades(null, "conectado")).toBe(false);
	});
});
