import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DefaultApp from "@/App.tsx";
import { AppRouter } from "@/AppRouter.tsx";
import { useAppStore } from "@/store/useAppStore.ts";
import * as sesionUtils from "@/utils/sesion.ts";

vi.mock("@/features/setup/pages/SetupPage", () => ({
	SetupPage: () => <div data-testid="setup-page">Setup Page</div>,
}));

vi.mock("@/features/auth/pages/LoginPage", () => ({
	LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock("@/features/actividades/pages/ActividadesSeguimientoPage", () => ({
	ActividadesSeguimientoPage: () => <div data-testid="actividades-page">Actividades Page</div>,
	default: () => <div data-testid="actividades-page">Actividades Page</div>,
}));

vi.mock("@/features/plantillas/pages/PlantillasSeguimientoPage", () => ({
	PlantillasSeguimientoPage: () => <div data-testid="plantillas-page">Plantillas Page</div>,
	default: () => <div data-testid="plantillas-page">Plantillas Page</div>,
}));

vi.mock("@/features/configuracion/pages/ConfiguracionPage", () => ({
	ConfiguracionPage: () => <div data-testid="configuracion-page">Configuracion Page</div>,
	default: () => <div data-testid="configuracion-page">Configuracion Page</div>,
}));

vi.mock("@/features/reportes/pages/ReportesPage", () => ({
	ReportesPage: () => <div data-testid="reportes-page">Reportes Page</div>,
	default: () => <div data-testid="reportes-page">Reportes Page</div>,
}));

vi.mock("@/features/documentacion/pages/DocumentacionPage", () => ({
	DocumentacionPage: () => <div data-testid="documentacion-page">Documentacion Page</div>,
	default: () => <div data-testid="documentacion-page">Documentacion Page</div>,
}));

vi.mock("@/layouts/DashboardLayout", async () => {
	const { Outlet } = await import("react-router-dom");
	return {
		DashboardLayout: () => (
			<div data-testid="dashboard-layout">
				<Outlet />
			</div>
		),
	};
});

describe("AppRouter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
		localStorage.clear();
		useAppStore.setState({
			configurado: false,
			autenticado: false,
			estadoVerificado: false,
			errorVerificacion: null,
			verificarEstadoGlobal: vi.fn(),
		});
	});

	it("reexporta AppRouter desde App.tsx por defecto", () => {
		expect(DefaultApp).toBe(AppRouter);
	});

	it("muestra pantalla de error cuando estadoVerificado es true y configurado es null", () => {
		const verificar = vi.fn();
		useAppStore.setState({
			estadoVerificado: true,
			configurado: null,
			errorVerificacion: "Fallo crítico al conectar con el servidor",
			verificarEstadoGlobal: verificar,
		});

		render(<AppRouter />);

		expect(screen.getByText("Fallo crítico al conectar con el servidor")).toBeDefined();

		const btnReintentar = screen.getByRole("button", { name: "Reintentar" });
		fireEvent.click(btnReintentar);
		expect(verificar).toHaveBeenCalled();

		const btnOffline = screen.getByRole("button", {
			name: "Continuar en Modo Offline (Demo)",
		});
		fireEvent.click(btnOffline);
		expect(useAppStore.getState().configurado).toBe(true);
	});

	it("muestra fallback de texto de error cuando errorVerificacion es vacio", () => {
		useAppStore.setState({
			estadoVerificado: true,
			configurado: null,
			errorVerificacion: null,
		});

		render(<AppRouter />);
		expect(screen.getByText("No se pudo verificar el estado del sistema.")).toBeDefined();
	});

	it("muestra AuthCardSkeleton cuando no esta verificado y no tiene sesion previa", () => {
		vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(false);
		window.history.pushState({}, "", "/login");

		useAppStore.setState({
			estadoVerificado: false,
		});

		const { container } = render(<AppRouter />);
		expect(container.querySelector(".animate-pulse")).toBeDefined();
	});

	it("muestra DashboardSkeleton cuando no esta verificado pero tiene sesion previa y no es ruta auth", () => {
		vi.spyOn(sesionUtils, "esSesionValida").mockReturnValue(true);
		window.history.pushState({}, "", "/actividades");

		useAppStore.setState({
			estadoVerificado: false,
		});

		const { container } = render(<AppRouter />);
		expect(container.querySelector(".animate-pulse")).toBeDefined();
	});

	it("navega a /setup cuando el sistema no esta configurado", () => {
		window.history.pushState({}, "", "/setup");
		useAppStore.setState({
			estadoVerificado: true,
			configurado: false,
			autenticado: false,
		});

		render(<AppRouter />);
		expect(screen.getByTestId("setup-page")).toBeDefined();
	});

	it("redirecciona a /actividades si intenta acceder a /setup estando ya configurado y autenticado", () => {
		window.history.pushState({}, "", "/setup");
		useAppStore.setState({
			estadoVerificado: true,
			configurado: true,
			autenticado: true,
		});

		render(<AppRouter />);
		expect(screen.getByTestId("actividades-page")).toBeDefined();
	});

	it("navega a /login cuando el sistema esta configurado pero no autenticado", () => {
		window.history.pushState({}, "", "/login");
		useAppStore.setState({
			estadoVerificado: true,
			configurado: true,
			autenticado: false,
		});

		render(<AppRouter />);
		expect(screen.getByTestId("login-page")).toBeDefined();
	});

	it("redirecciona a /actividades si accede a /login estando autenticado", () => {
		window.history.pushState({}, "", "/login");
		useAppStore.setState({
			estadoVerificado: true,
			configurado: true,
			autenticado: true,
		});

		render(<AppRouter />);
		expect(screen.getByTestId("actividades-page")).toBeDefined();
	});

	it("renderiza modulos en DashboardLayout cuando esta configurado y autenticado", async () => {
		window.history.pushState({}, "", "/actividades");
		useAppStore.setState({
			estadoVerificado: true,
			configurado: true,
			autenticado: true,
		});

		const { unmount } = render(<AppRouter />);
		expect(screen.getByTestId("dashboard-layout")).toBeDefined();
		expect(screen.getByTestId("actividades-page")).toBeDefined();
		unmount();

		window.history.pushState({}, "", "/plantillas");
		const { unmount: unmountPlantillas } = render(<AppRouter />);
		await waitFor(() => {
			expect(screen.getByTestId("plantillas-page")).toBeDefined();
		});
		unmountPlantillas();

		window.history.pushState({}, "", "/configuracion");
		const { unmount: unmountConfig } = render(<AppRouter />);
		await waitFor(() => {
			expect(screen.getByTestId("configuracion-page")).toBeDefined();
		});
		unmountConfig();

		window.history.pushState({}, "", "/reportes");
		const { unmount: unmountReportes } = render(<AppRouter />);
		await waitFor(() => {
			expect(screen.getByTestId("reportes-page")).toBeDefined();
		});
		unmountReportes();

		window.history.pushState({}, "", "/documentacion");
		const { unmount: unmountDoc } = render(<AppRouter />);
		await waitFor(() => {
			expect(screen.getByTestId("documentacion-page")).toBeDefined();
		});
		unmountDoc();

		window.history.pushState({}, "", "/ruta-desconocida");
		const { unmount: unmountFallback } = render(<AppRouter />);
		await waitFor(() => {
			expect(screen.getByTestId("actividades-page")).toBeDefined();
		});
		unmountFallback();
	});
});
