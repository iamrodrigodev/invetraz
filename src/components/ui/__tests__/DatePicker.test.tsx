import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "@/components/ui/DatePicker";

describe("DatePicker component", () => {
	it("renderiza con placeholder inicial", () => {
		render(<DatePicker placeholder="dd/mm/aaaa" />);

		expect(screen.getByText("dd/mm/aaaa")).toBeDefined();
	});

	it("abre el calendario al hacer clic en el botón", () => {
		render(<DatePicker placeholder="dd/mm/aaaa" />);

		const boton = screen.getByRole("button");
		fireEvent.click(boton);

		expect(screen.getByRole("dialog")).toBeDefined();
		expect(screen.getByText("Hoy")).toBeDefined();
	});

	it("muestra fecha formateada cuando se le pasa un valor válido", () => {
		render(<DatePicker value="2026-09-25" />);

		expect(screen.getByText("25/09/2026")).toBeDefined();
	});

	it("llama a onChange al hacer clic en Hoy", () => {
		const manejarCambio = vi.fn();
		render(<DatePicker onChange={manejarCambio} />);

		fireEvent.click(screen.getByRole("button"));
		const botonHoy = screen.getByText("Hoy");
		fireEvent.click(botonHoy);

		expect(manejarCambio).toHaveBeenCalled();
	});

	it("muestra mensaje de error cuando se le provee", () => {
		render(<DatePicker errorMessage="Fecha requerida" />);

		expect(screen.getByText("Fecha requerida")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});
});
