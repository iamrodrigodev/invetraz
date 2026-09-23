import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "@/components/ui/Textarea.tsx";

describe("Textarea component", () => {
	it("renderiza con placeholder y contador de caracteres en modo controlado", () => {
		const { rerender } = render(
			<Textarea
				placeholder="Escribe aquí"
				maxLength={100}
				showCount={true}
				value="Hola"
				readOnly={true}
			/>,
		);

		expect(screen.getByPlaceholderText("Escribe aquí")).toBeDefined();
		expect(screen.getByText("4 / 100")).toBeDefined();

		rerender(
			<Textarea
				placeholder="Escribe aquí"
				maxLength={100}
				showCount={true}
				value="Hola Mundo"
				readOnly={true}
			/>,
		);
		expect(screen.getByText("10 / 100")).toBeDefined();
	});

	it("inicializa el contador con defaultValue y actualiza al escribir", () => {
		const manejarCambio = vi.fn();
		render(
			<Textarea
				defaultValue="Texto inicial"
				showCount={true}
				maxLength={50}
				onChange={manejarCambio}
			/>,
		);

		expect(screen.getByText("13 / 50")).toBeDefined();

		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "Nuevo" } });

		expect(manejarCambio).toHaveBeenCalled();
		expect(screen.getByText("5 / 50")).toBeDefined();
	});

	it("usa charCount explícito si se le provee", () => {
		render(
			<Textarea
				showCount={true}
				maxLength={100}
				charCount={42}
				value="Otro texto"
				readOnly={true}
			/>,
		);

		expect(screen.getByText("42 / 100")).toBeDefined();
	});

	it("maneja cambio sin showCount ni maxLength", () => {
		const manejarCambio = vi.fn();
		render(<Textarea onChange={manejarCambio} />);

		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "Prueba" } });

		expect(manejarCambio).toHaveBeenCalled();
	});

	it("muestra mensaje de error y estilo de error", () => {
		const idPersonalizado = "custom-textarea";
		const { rerender } = render(<Textarea error={true} id={idPersonalizado} />);
		const textarea = screen.getByRole("textbox");
		expect(textarea.getAttribute("aria-invalid")).toBe("true");
		expect(textarea.getAttribute("id")).toBe(idPersonalizado);

		rerender(
			<Textarea
				errorMessage="Texto inválido"
				showCount={true}
				maxLength={100}
				value=""
				readOnly={true}
			/>,
		);

		expect(screen.getByText("Texto inválido")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
		expect(screen.getByText("0 / 100")).toBeDefined();
	});

	it("soporta ref forwarding", () => {
		const ref = createRef<HTMLTextAreaElement>();
		render(<Textarea ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
	});

	it("soporta escribir sin callback onChange proporcionado", () => {
		render(<Textarea showCount={true} maxLength={20} />);
		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "SinHandler" } });
		expect(screen.getByText("10 / 20")).toBeDefined();
	});
});
