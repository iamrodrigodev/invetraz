import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BadgeNotificacionEnvio } from "@/features/actividades/components/BadgeNotificacionEnvio.tsx";

describe("BadgeNotificacionEnvio", () => {
	it("no renderiza nada cuando visible es false", () => {
		const { container } = render(
			<BadgeNotificacionEnvio visible={false} estado="enviando" tituloTarea="Tarea Demo" />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza estado enviando correctamente", () => {
		render(<BadgeNotificacionEnvio visible={true} estado="enviando" tituloTarea="Tarea Demo" />);

		expect(screen.getByText("Enviando tarea:")).toBeDefined();
		expect(screen.getByText('"Tarea Demo"')).toBeDefined();
	});

	it("renderiza estado exito y se oculta tras timeout", async () => {
		vi.useFakeTimers();
		const onOcultar = vi.fn();

		render(
			<BadgeNotificacionEnvio
				visible={true}
				estado="exito"
				tituloTarea="Tarea Finalizada"
				onOcultar={onOcultar}
			/>,
		);

		expect(screen.getByText("Tarea enviada:")).toBeDefined();
		expect(screen.getByText('"Tarea Finalizada"')).toBeDefined();

		act(() => {
			vi.advanceTimersByTime(3000);
		});

		expect(onOcultar).toHaveBeenCalled();
		vi.useRealTimers();
	});

	it("renderiza estado error correctamente", () => {
		render(<BadgeNotificacionEnvio visible={true} estado="error" tituloTarea="Tarea Fallida" />);

		expect(screen.getByText("Error al enviar:")).toBeDefined();
		expect(screen.getByText('"Tarea Fallida"')).toBeDefined();
	});
});
