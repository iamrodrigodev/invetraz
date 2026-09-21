import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DashboardLayout } from "../DashboardLayout";

describe("navegación del sidebar", () => {
	it("no navega otra vez al pulsar el módulo activo", () => {
		const cambiarModulo = vi.fn();
		render(
			<MemoryRouter>
				<DashboardLayout
					moduloActivo="actividades"
					alCambiarModulo={cambiarModulo}
				>
					<div>Contenido</div>
				</DashboardLayout>
			</MemoryRouter>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Actividades de seguimiento" }),
		);
		expect(cambiarModulo).not.toHaveBeenCalled();

		fireEvent.click(screen.getByRole("button", { name: "Reportes" }));
		expect(cambiarModulo).toHaveBeenCalledTimes(1);
		expect(cambiarModulo).toHaveBeenCalledWith("reportes");
	});
});
