import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { precargarTodosLosModulos } from "@/components/navigation/precargaModulos.ts";
import { DashboardLayout } from "@/layouts/DashboardLayout.tsx";
import { useAppStore } from "@/store/useAppStore.ts";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("@/components/navigation/precargaModulos", () => ({
	precargarTodosLosModulos: vi.fn(),
	precargarModulo: vi.fn(),
}));

vi.mock("framer-motion", () => ({
	AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
	motion: {
		div: ({
			children,
			ref,
			...props
		}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
			<div ref={ref} {...props}>
				{children}
			</div>
		),
	},
}));

describe("DashboardLayout", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			writable: true,
			value: 1024,
		});
	});

	it("no navega otra vez al pulsar el módulo activo y navega con alCambiarModulo", () => {
		const cambiarModulo = vi.fn();
		render(
			<MemoryRouter initialEntries={["/actividades"]}>
				<DashboardLayout moduloActivo="actividades" alCambiarModulo={cambiarModulo}>
					<div>Contenido</div>
				</DashboardLayout>
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Actividades de seguimiento" }));
		expect(cambiarModulo).not.toHaveBeenCalled();

		fireEvent.click(screen.getByRole("button", { name: "Reportes" }));
		expect(cambiarModulo).toHaveBeenCalledTimes(1);
		expect(cambiarModulo).toHaveBeenCalledWith("reportes");
	});

	it("navega usando router cuando no se pasa alCambiarModulo", () => {
		render(
			<MemoryRouter initialEntries={["/plantillas"]}>
				<DashboardLayout>
					<div>Hijo</div>
				</DashboardLayout>
			</MemoryRouter>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Reportes" }));
		expect(mockNavigate).toHaveBeenCalledWith("/reportes");
	});

	it("lee estado colapsado desde localStorage y permite alternarlo", () => {
		localStorage.setItem("sidebar_colapsado", "true");
		render(
			<MemoryRouter initialEntries={["/actividades"]}>
				<DashboardLayout />
			</MemoryRouter>,
		);

		const btnExpandir = screen.getByLabelText("Expandir barra lateral");
		expect(btnExpandir).toBeDefined();

		fireEvent.click(btnExpandir);
		expect(localStorage.getItem("sidebar_colapsado")).toBe("false");
	});

	it("abre y cierra el menú lateral móvil al hacer clic en el backdrop", () => {
		window.innerWidth = 390;
		render(
			<MemoryRouter initialEntries={["/actividades"]}>
				<DashboardLayout />
			</MemoryRouter>,
		);

		const btnHamburguesa = screen.getByLabelText("Abrir menú de navegación");
		fireEvent.click(btnHamburguesa);

		const backdrop = screen.getByLabelText("Cerrar menú lateral");
		expect(backdrop).toBeDefined();

		fireEvent.click(backdrop);
		expect(screen.queryByLabelText("Cerrar menú lateral")).toBeNull();
	});

	it("en móvil nunca está colapsado y permite cerrarse con el botón X", () => {
		localStorage.setItem("sidebar_colapsado", "true");
		window.innerWidth = 390;
		render(
			<MemoryRouter initialEntries={["/actividades"]}>
				<DashboardLayout />
			</MemoryRouter>,
		);

		const btnHamburguesa = screen.getByLabelText("Abrir menú de navegación");
		fireEvent.click(btnHamburguesa);

		expect(screen.getByText("Investigación")).toBeDefined();
		expect(screen.getByText("Actividades")).toBeDefined();
		expect(screen.getByText("Reportes")).toBeDefined();

		const btnCerrar = screen.getByLabelText("Cerrar menú");
		fireEvent.click(btnCerrar);
		expect(screen.queryByLabelText("Cerrar menú lateral")).toBeNull();
	});

	it("en tablet muestra sidebar colapsado sin boton hamburguesa", () => {
		window.innerWidth = 820;
		render(
			<MemoryRouter initialEntries={["/actividades"]}>
				<DashboardLayout />
			</MemoryRouter>,
		);

		expect(screen.queryByLabelText("Abrir menú de navegación")).toBeNull();
		expect(screen.queryByLabelText("Expandir barra lateral")).toBeNull();
		expect(
			screen.getByRole("heading", {
				name: "Actividades de seguimiento",
			}),
		).toBeDefined();
	});

	it("abre modal y confirma cierre de sesión desde sidebar", async () => {
		const mockCerrarSesion = vi.fn().mockResolvedValue(undefined);
		useAppStore.setState({ cerrarSesion: mockCerrarSesion });

		render(
			<MemoryRouter initialEntries={["/configuracion"]}>
				<DashboardLayout />
			</MemoryRouter>,
		);

		const btnsLogout = screen.getAllByRole("button", { name: "Cerrar Sesión" });
		const primerLogout = btnsLogout[0];
		if (primerLogout) {
			await act(async () => {
				fireEvent.click(primerLogout);
			});
		}

		expect(screen.getByText("¿Estás seguro de que deseas salir?")).toBeDefined();

		const btnConfirmar = screen.getByRole("button", {
			name: "Sí, cerrar sesión",
		});

		await act(async () => {
			fireEvent.click(btnConfirmar);
		});

		expect(mockCerrarSesion).toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
	});

	it("solicita cerrar sesion desde TopBar y permite cancelar", async () => {
		const { container } = render(
			<MemoryRouter initialEntries={["/actividades"]}>
				<DashboardLayout />
			</MemoryRouter>,
		);

		const userTrigger = container.querySelector(".rounded-2xl");
		if (userTrigger) {
			fireEvent.click(userTrigger);
		}

		const btnLogoutTopBar = screen.getAllByRole("button", {
			name: "Cerrar Sesión",
		});
		const ultimoLogout = btnLogoutTopBar.at(-1);
		if (ultimoLogout) {
			await act(async () => {
				fireEvent.click(ultimoLogout);
			});
		}

		expect(screen.getByText("¿Estás seguro de que deseas salir?")).toBeDefined();

		const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
		await act(async () => {
			fireEvent.click(btnCancelar);
		});

		expect(screen.queryByText("¿Estás seguro de que deseas salir?")).toBeNull();
	});

	it("renderiza Suspense y Outlet y ejecuta temporizador de precarga", async () => {
		render(
			<MemoryRouter initialEntries={["/reportes"]}>
				<Routes>
					<Route path="/" element={<DashboardLayout />}>
						<Route path="reportes" element={<div>Ruta anidada Outlet</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Ruta anidada Outlet")).toBeDefined();

		await act(async () => {
			await new Promise((r) => setTimeout(r, 120));
		});

		expect(precargarTodosLosModulos).toHaveBeenCalled();
	});

	it("calcula modulo actividades cuando la ruta es la raiz '/'", () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<DashboardLayout>
					<div>Contenido Raiz</div>
				</DashboardLayout>
			</MemoryRouter>,
		);

		expect(screen.getByText("Contenido Raiz")).toBeDefined();
	});
});
