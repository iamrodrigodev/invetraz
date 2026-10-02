import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { CampoCredencial } from "@/features/configuracion/components/CampoCredencial.tsx";

describe("CampoCredencial", () => {
	it("renderiza label, asterisco de obligatorio y descripcion", () => {
		const idCampo = "campo-test";
		render(
			<CampoCredencial
				id={idCampo}
				label="Mi Credencial"
				descripcion="Texto de ayuda"
				obligatorio={true}
			/>,
		);

		expect(screen.getByText("Mi Credencial")).toBeDefined();
		expect(screen.getByText("*")).toBeDefined();
		expect(screen.getByText("Texto de ayuda")).toBeDefined();
	});

	it("no renderiza asterisco cuando obligatorio es false", () => {
		const idCampo = "campo-test-opcional";
		render(<CampoCredencial id={idCampo} label="Credencial Opcional" obligatorio={false} />);

		expect(screen.getByText("Credencial Opcional")).toBeDefined();
		expect(screen.queryByText("*")).toBeNull();
	});

	it("permite alternar visibilidad cuando esSensible es true", () => {
		const idCampo = "campo-sensible";
		render(<CampoCredencial id={idCampo} label="Clave Secreta" esSensible={true} />);

		const input = screen.getByLabelText(/Clave Secreta/u) as HTMLInputElement;
		expect(input.type).toBe("password");

		const toggleBtn = screen.getByRole("button", { name: "Mostrar contenido" });
		fireEvent.click(toggleBtn);
		expect(input.type).toBe("text");
		expect(screen.getByRole("button", { name: "Ocultar contenido" })).toBeDefined();

		fireEvent.click(screen.getByRole("button", { name: "Ocultar contenido" }));
		expect(input.type).toBe("password");
		expect(screen.getByRole("button", { name: "Mostrar contenido" })).toBeDefined();
	});

	it("no renderiza boton de alternar cuando esSensible es false y reenvia ref y errorMessage", () => {
		const inputRef = createRef<HTMLInputElement>();
		const idCampo = "campo-normal";
		render(
			<CampoCredencial
				ref={inputRef}
				id={idCampo}
				label="Identificador"
				esSensible={false}
				errorMessage="Formato incorrecto"
			/>,
		);

		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByText("Formato incorrecto")).toBeDefined();
		expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
	});
});
