import { describe, expect, it, vi } from "vitest";

const programarMock = vi.fn();

vi.mock("@/utils/sesion", () => ({
	esSesionValida: () => true,
	guardarSesion: vi.fn(),
	limpiarSesion: vi.fn(),
	programarExpiracionAutomatica: programarMock,
}));
vi.mock("@/features/auth/api/auth.api", () => ({
	verificarAutenticacion: vi.fn(),
	logout: vi.fn(),
}));
vi.mock("@/features/setup/api/setup.api", () => ({
	verificarEstadoSistema: vi.fn(),
}));

describe("sesionPreviaActiva", () => {
	it("programa expiracion automatica al cargar el store con sesion activa", async () => {
		const mod = await import("@/store/useAppStore.ts");
		expect(programarMock).toHaveBeenCalled();
		expect(mod.useAppStore.getState().autenticado).toBe(true);
	});
});
