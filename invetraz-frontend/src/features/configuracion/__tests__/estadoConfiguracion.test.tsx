import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useVerificacionConexion } from "@/features/configuracion/hooks/useVerificacionConexion.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

const api = vi.hoisted(() => ({
	actualizarConfiguracion: vi.fn(),
	verificarConfiguracion: vi.fn(),
	obtenerConfiguracion: vi.fn(),
}));
vi.mock("@/features/configuracion/api/configuracion.api", () => api);

const datos = {
	googleClientId: "id",
	googleClientSecret: "secret",
	googleRefreshToken: "token",
	googleDriveFolderId: null,
	googleDriveFolderName: null,
	googleVerificado: false,
	driveVerificado: false,
};

beforeEach(() => {
	vi.clearAllMocks();
	useConfiguracionStore.getState().limpiar();
});

describe("guardado de configuración", () => {
	it("guarda una sola vez como pendiente cuando falla la verificación", async () => {
		api.verificarConfiguracion.mockRejectedValue(new Error("Sin acceso"));
		api.actualizarConfiguracion.mockResolvedValue(undefined);

		const resultado = await useConfiguracionStore.getState().guardarConfiguracion(datos);

		expect(resultado.valido).toBe(false);
		expect(api.actualizarConfiguracion).toHaveBeenCalledOnce();
		expect(api.actualizarConfiguracion).toHaveBeenCalledWith({
			...datos,
			googleVerificado: false,
		});
		expect(useConfiguracionStore.getState().cargando).toBe(false);
	});

	it("apaga el estado de carga si falla la persistencia", async () => {
		api.verificarConfiguracion.mockResolvedValue({
			valido: true,
			mensaje: "OK",
		});
		api.actualizarConfiguracion.mockRejectedValue(new Error("No se pudo guardar"));

		await expect(useConfiguracionStore.getState().guardarConfiguracion(datos)).rejects.toThrow(
			"No se pudo guardar",
		);
		expect(api.actualizarConfiguracion).toHaveBeenCalledOnce();
		expect(useConfiguracionStore.getState().cargando).toBe(false);
	});
});

describe("estado visual de conexión", () => {
	it("deja de mostrar conectado al editar un valor verificado", () => {
		const opciones = (valorActual: string) => ({
			valorActual,
			valorGuardado: "original",
			sonIguales: (a: string | null | undefined, b: string | null | undefined) => a === b,
			esValido: true,
			tieneValorGuardado: true,
			valorGuardadoVerificado: true,
			onVerificar: async () => "OK",
			onGuardar: async () => "OK",
		});
		const { result, rerender } = renderHook(
			({ actual }) => useVerificacionConexion(opciones(actual)),
			{ initialProps: { actual: "original" } },
		);
		expect(result.current.estadoVisual).toBe("conectado");
		rerender({ actual: "editado" });
		expect(result.current.estadoVisual).not.toBe("conectado");
	});
});
