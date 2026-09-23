import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "@/components/ui/Spinner.tsx";

describe("Spinner", () => {
	it("renderiza spinner basico con role status", () => {
		render(<Spinner />);
		const spinner = screen.getByRole("status");
		expect(spinner).toBeDefined();
		expect(spinner.getAttribute("aria-label")).toBe("Cargando...");
	});

	it("aplica diferentes tamaños y colores", () => {
		const { rerender } = render(<Spinner size="sm" color="white" />);
		let spinner = screen.getByRole("status");
		expect(spinner.className).toContain("h-4");
		expect(spinner.className).toContain("border-white");

		rerender(<Spinner size="lg" color="slate" />);
		spinner = screen.getByRole("status");
		expect(spinner.className).toContain("h-10");
		expect(spinner.className).toContain("border-slate-400");

		rerender(<Spinner size="xl" color="primary" />);
		spinner = screen.getByRole("status");
		expect(spinner.className).toContain("h-14");
		expect(spinner.className).toContain("border-primary");
	});

	it("muestra mensaje descriptivo y contenedor completo", () => {
		render(<Spinner mensaje="Cargando datos del sistema..." fullContainer={true} />);
		expect(screen.getByText("Cargando datos del sistema...")).toBeDefined();
		expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
			"Cargando datos del sistema...",
		);
	});
});
