import { fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { ModalErrorGeneracion } from "@/features/actividades/components/ModalErrorGeneracion.tsx";

vi.mock("framer-motion", () => ({
	AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
	motion: {
		div: ({
			children,
			ref,
			...props
		}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
			<div ref={ref} {...props}>
				{children}
			</div>
		),
	},
}));

describe("ModalErrorGeneracion", () => {
	it("no renderiza cuando abierto es false", () => {
		const { container } = render(<ModalErrorGeneracion abierto={false} alAceptar={vi.fn()} />);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza con mensaje por defecto y permite cerrar desde el boton Entendido y la X", () => {
		const alAceptar = vi.fn();
		const { rerender } = render(<ModalErrorGeneracion abierto={true} alAceptar={alAceptar} />);

		expect(screen.getByText("Error al generar actividad")).toBeDefined();
		expect(
			screen.getByText(
				"Ocurrió un inconveniente al generar la actividad de seguimiento. Por favor, verifica tu conexión e inténtalo nuevamente.",
			),
		).toBeDefined();

		const btnEntendido = screen.getByRole("button", { name: "Entendido" });
		fireEvent.click(btnEntendido);
		expect(alAceptar).toHaveBeenCalledTimes(1);

		const btnX = screen.getByRole("button", { name: "Cerrar modal" });
		fireEvent.click(btnX);
		expect(alAceptar).toHaveBeenCalledTimes(2);

		rerender(
			<ModalErrorGeneracion
				abierto={true}
				mensaje="Error personalizado de prueba"
				alAceptar={alAceptar}
			/>,
		);
		expect(screen.getByText("Error personalizado de prueba")).toBeDefined();
	});
});
