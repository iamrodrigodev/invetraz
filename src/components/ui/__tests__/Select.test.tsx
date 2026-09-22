import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "../Select";

describe("Select component", () => {
	const opciones = [
		{ value: "opt-1", label: "Opción 1", badge: "Badge 1" },
		{ value: "opt-2", label: "Opción 2" },
	];

	it("renderiza con placeholder inicial", () => {
		render(<Select placeholder="Selecciona una opción" options={opciones} />);

		expect(screen.getByText("Selecciona una opción")).toBeDefined();
	});

	it("abre el menú desplegable y muestra las opciones al hacer clic", () => {
		render(<Select placeholder="Selecciona una opción" options={opciones} />);

		const boton = screen.getByRole("button");
		fireEvent.click(boton);

		expect(screen.getByRole("listbox")).toBeDefined();
		expect(screen.getByText("Opción 1")).toBeDefined();
		expect(screen.getByText("Badge 1")).toBeDefined();
		expect(screen.getByText("Opción 2")).toBeDefined();
	});

	it("llama a onChange con el valor seleccionado", () => {
		const manejarCambio = vi.fn();
		render(
			<Select
				placeholder="Selecciona una opción"
				options={opciones}
				onChange={manejarCambio}
			/>,
		);

		fireEvent.click(screen.getByRole("button"));
		fireEvent.click(screen.getByText("Opción 1"));

		expect(manejarCambio).toHaveBeenCalledWith("opt-1");
	});

	it("muestra mensaje de error cuando se le provee", () => {
		render(
			<Select errorMessage="Este campo es obligatorio" options={opciones} />,
		);

		expect(screen.getByText("Este campo es obligatorio")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});

	it("posiciona el menú hacia arriba cuando posicionDropdown es arriba", () => {
		render(
			<Select
				placeholder="Selecciona una opción"
				options={opciones}
				posicionDropdown="arriba"
			/>,
		);

		fireEvent.click(screen.getByRole("button"));

		const listbox = screen.getByRole("listbox");
		expect(listbox.className).toContain("bottom-full");
	});
});
