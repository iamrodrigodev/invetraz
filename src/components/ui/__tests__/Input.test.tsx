import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "@/components/ui/Input.tsx";

describe("Input", () => {
	it("renderiza el input correctamente con sus atributos", () => {
		render(<Input placeholder="Ingresa texto" />);
		const input = screen.getByPlaceholderText("Ingresa texto");
		expect(input).toBeDefined();
		expect(input.getAttribute("type")).toBe("text");
	});

	it("muestra mensaje de error y aria-invalid cuando hay error", () => {
		render(<Input placeholder="Email" error={true} errorMessage="El campo es obligatorio" />);
		const input = screen.getByPlaceholderText("Email");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(screen.getByRole("alert").textContent).toContain("El campo es obligatorio");
	});

	it("renderiza rightElement en la posicion derecha", () => {
		render(<Input placeholder="Contraseña" rightElement={<button type="button">Ver</button>} />);
		expect(screen.getByRole("button", { name: /ver/iu })).toBeDefined();
	});

	it("muestra conteo de caracteres si showCount y maxLength estan activados", () => {
		const { rerender } = render(
			<Input placeholder="Texto" showCount={true} maxLength={50} defaultValue="Hola" />,
		);
		expect(screen.getByText("4 / 50")).toBeDefined();

		const input = screen.getByPlaceholderText("Texto") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "Hola Mundo" } });
		expect(screen.getByText("10 / 50")).toBeDefined();

		rerender(
			<Input
				placeholder="Texto"
				showCount={true}
				maxLength={50}
				value="Controlado"
				charCount={10}
				onChange={() => {}}
			/>,
		);
		expect(screen.getByText("10 / 50")).toBeDefined();

		rerender(
			<Input
				placeholder="Texto"
				showCount={true}
				maxLength={50}
				value="Cadena"
				onChange={() => {}}
			/>,
		);
		expect(screen.getByText("6 / 50")).toBeDefined();
	});

	it("llama al callback onChange al escribir", () => {
		const handleChange = vi.fn();
		render(<Input placeholder="Nombre" onChange={handleChange} />);
		const input = screen.getByPlaceholderText("Nombre");
		fireEvent.change(input, { target: { value: "A" } });
		expect(handleChange).toHaveBeenCalled();
	});
});
