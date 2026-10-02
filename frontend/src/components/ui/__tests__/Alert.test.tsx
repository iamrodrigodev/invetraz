import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "@/components/ui/Alert.tsx";

describe("Alert", () => {
	it("renderiza correctamente el mensaje y variante error por defecto", () => {
		render(<Alert message="Ocurrió un error inesperado" />);
		const alerta = screen.getByRole("alert");
		expect(alerta).toBeDefined();
		expect(alerta.className).toContain("bg-red-50");
		expect(screen.getByText("Ocurrió un error inesperado")).toBeDefined();
	});

	it("aplica estilos segun las diferentes variantes", () => {
		const { rerender } = render(<Alert message="Operación exitosa" variant="success" />);
		let alerta = screen.getByRole("alert");
		expect(alerta.className).toContain("bg-emerald-50");

		rerender(<Alert message="Advertencia" variant="warning" />);
		alerta = screen.getByRole("alert");
		expect(alerta.className).toContain("bg-amber-50");

		rerender(<Alert message="Información general" variant="info" />);
		alerta = screen.getByRole("alert");
		expect(alerta.className).toContain("bg-blue-50");
	});

	it("muestra boton de cierre y ejecuta onClose al hacer clic", () => {
		const handleClose = vi.fn();
		render(<Alert message="Alerta descartable" variant="warning" onClose={handleClose} />);

		const closeBtn = screen.getByRole("button", {
			name: /cerrar notificación/iu,
		});
		expect(closeBtn).toBeDefined();
		fireEvent.click(closeBtn);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
