import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "../Select";

describe("Select component", () => {
	it("renderiza con opciones y placeholder", () => {
		render(
			<Select
				placeholder="Selecciona una opción"
				options={[
					{ value: "opt-1", label: "Opción 1" },
					{ value: "opt-2", label: "Opción 2" },
				]}
			/>,
		);

		expect(screen.getByText("Selecciona una opción")).toBeDefined();
		expect(screen.getByText("Opción 1")).toBeDefined();
		expect(screen.getByText("Opción 2")).toBeDefined();
	});

	it("muestra mensaje de error cuando se le provee", () => {
		render(
			<Select
				errorMessage="Este campo es obligatorio"
				options={[{ value: "1", label: "Item" }]}
			/>,
		);

		expect(screen.getByText("Este campo es obligatorio")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});
});
