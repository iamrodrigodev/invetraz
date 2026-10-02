import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthCardSkeleton } from "@/components/ui/skeletons/AuthCardSkeleton.tsx";
import {
	DashboardSkeleton,
	ModuloContenidoSkeleton,
} from "@/components/ui/skeletons/DashboardSkeleton.tsx";
import { ModuloEnConstruccionSkeleton } from "@/components/ui/skeletons/ModuloEnConstruccionSkeleton.tsx";

describe("skeletons", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
		vi.unstubAllGlobals();
	});

	describe("AuthCardSkeleton", () => {
		it("renderiza variante de login por defecto", () => {
			const { container } = render(<AuthCardSkeleton esSetup={false} />);
			expect(container.firstChild).toBeDefined();
		});

		it("renderiza variante de setup", () => {
			const { container } = render(<AuthCardSkeleton esSetup={true} />);
			expect(container.firstChild).toBeDefined();
		});

		it("infiere setup segun la ruta si no se pasa esSetup", () => {
			vi.stubGlobal("location", { pathname: "/setup" });
			const { container } = render(<AuthCardSkeleton />);
			expect(container.firstChild).toBeDefined();
		});
	});

	describe("DashboardSkeleton", () => {
		it("renderiza con sidebar expandido y ruta raiz", () => {
			localStorage.setItem("sidebar_colapsado", "false");
			window.history.pushState({}, "", "/");

			const { container } = render(<DashboardSkeleton />);
			expect(container.firstChild).toBeDefined();
		});

		it("renderiza con sidebar colapsado y modulos especificos", () => {
			localStorage.setItem("sidebar_colapsado", "true");
			window.history.pushState({}, "", "/configuracion");

			const { container } = render(<DashboardSkeleton />);
			expect(container.firstChild).toBeDefined();
		});
	});

	describe("ModuloContenidoSkeleton", () => {
		it("renderiza cada sub-skeleton segun el modulo", () => {
			const modulos = [
				"configuracion",
				"documentacion",
				"plantillas",
				"reportes",
				"actividades",
				"otro",
			];

			for (const mod of modulos) {
				const { container } = render(<ModuloContenidoSkeleton modulo={mod} />);
				expect(container.firstChild).toBeDefined();
			}
		});
	});

	describe("ModuloEnConstruccionSkeleton", () => {
		it("renderiza con rol status y titulo con ancho personalizado", () => {
			render(<ModuloEnConstruccionSkeleton tituloAncho="w-56" />);
			const status = screen.getByRole("status");
			expect(status.getAttribute("aria-busy")).toBe("true");
			expect(status.getAttribute("aria-label")).toBe("Cargando contenido...");
		});
	});
});
