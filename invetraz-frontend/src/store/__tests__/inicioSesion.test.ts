import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
	verificarAutenticacion: vi.fn(),
	verificarEstadoSistema: vi.fn(),
	esSesionValida: vi.fn(),
}));

vi.mock("@/features/auth/api/auth.api", () => ({
	verificarAutenticacion: api.verificarAutenticacion,
	logout: vi.fn(),
}));
vi.mock("@/features/setup/api/setup.api", () => ({
	verificarEstadoSistema: api.verificarEstadoSistema,
}));
vi.mock("@/utils/sesion", () => ({
	esSesionValida: api.esSesionValida,
	guardarSesion: vi.fn(),
	limpiarSesion: vi.fn(),
	programarExpiracionAutomatica: vi.fn(),
}));

import { useAppStore } from "@/store/useAppStore.ts";

beforeEach(() => {
	vi.clearAllMocks();
	api.esSesionValida.mockReturnValue(false);
	useAppStore.setState({
		configurado: null,
		autenticado: false,
		usuarioEmail: null,
		estadoVerificado: false,
		errorVerificacion: null,
	});
});

describe("verificación inicial", () => {
	it("consulta solo setup cuando no hay sesión previa y comparte la petición concurrente", async () => {
		api.verificarEstadoSistema.mockResolvedValue(true);

		await Promise.all([
			useAppStore.getState().verificarEstadoGlobal(),
			useAppStore.getState().verificarEstadoGlobal(),
		]);

		expect(api.verificarEstadoSistema).toHaveBeenCalledOnce();
		expect(api.verificarAutenticacion).not.toHaveBeenCalled();
		expect(useAppStore.getState().configurado).toBe(true);
	});

	it("consulta solo la sesión si ya está autenticada", async () => {
		api.esSesionValida.mockReturnValue(true);
		api.verificarAutenticacion.mockResolvedValue({
			autenticado: true,
			email: "admin@ulasalle.edu.pe",
		});

		await useAppStore.getState().verificarEstadoGlobal();

		expect(api.verificarAutenticacion).toHaveBeenCalledOnce();
		expect(api.verificarEstadoSistema).not.toHaveBeenCalled();
		expect(useAppStore.getState().autenticado).toBe(true);
	});

	it("una verificación antigua no revierte un login reciente", async () => {
		let terminarConsulta: (valor: boolean) => void = () => {};
		api.verificarEstadoSistema.mockReturnValue(
			new Promise<boolean>((resolve) => {
				terminarConsulta = resolve;
			}),
		);

		const pendiente = useAppStore.getState().verificarEstadoGlobal();
		useAppStore.getState().setAutenticado(true, "nuevo@ulasalle.edu.pe");
		terminarConsulta(false);
		await pendiente;

		expect(useAppStore.getState().autenticado).toBe(true);
		expect(useAppStore.getState().usuarioEmail).toBe("nuevo@ulasalle.edu.pe");
	});
});
