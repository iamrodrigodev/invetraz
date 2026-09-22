import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "../Textarea";

describe("Textarea component", () => {
	it("renderiza con placeholder y contador de caracteres", () => {
		render(
			<Textarea
				placeholder="Escribe aquí"
				maxLength={100}
				showCount
				value="Hola"
				readOnly
			/>,
		);

		expect(screen.getByPlaceholderText("Escribe aquí")).toBeDefined();
		expect(screen.getByText("4 / 100")).toBeDefined();
	});

	it("muestra mensaje de error", () => {
		render(<Textarea errorMessage="Texto inválido" />);

		expect(screen.getByText("Texto inválido")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});
});
