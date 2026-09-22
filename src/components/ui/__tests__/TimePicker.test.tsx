import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TimePicker } from "../TimePicker";

describe("TimePicker component", () => {
	it("renderiza con placeholder inicial", () => {
		render(<TimePicker placeholder="--:--" />);

		expect(screen.getByText("--:--")).toBeDefined();
	});

	it("abre el selector de hora al hacer clic en el botón", () => {
		render(<TimePicker placeholder="--:--" />);

		const boton = screen.getByRole("button");
		fireEvent.click(boton);

		expect(screen.getByRole("dialog")).toBeDefined();
		expect(screen.getByText("Fin del día (23:59)")).toBeDefined();
	});

	it("muestra hora cuando se le pasa un valor válido", () => {
		render(<TimePicker value="14:30" />);

		expect(screen.getByText("14:30")).toBeDefined();
	});

	it("llama a onChange al hacer clic en fin del día", () => {
		const manejarCambio = vi.fn();
		render(<TimePicker onChange={manejarCambio} />);

		fireEvent.click(screen.getByRole("button"));
		const botonFinDia = screen.getByText("Fin del día (23:59)");
		fireEvent.click(botonFinDia);

		expect(manejarCambio).toHaveBeenCalledWith("23:59");
	});

	it("muestra mensaje de error cuando se le provee", () => {
		render(<TimePicker errorMessage="Hora inválida" />);

		expect(screen.getByText("Hora inválida")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});
});
