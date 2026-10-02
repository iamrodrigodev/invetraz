import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DefaultTarjetaActividad, {
	TarjetaActividadSeguimiento,
} from "@/features/actividades/components/TarjetaActividadSeguimiento.tsx";

describe("TarjetaActividadSeguimiento", () => {
	it("renderiza actividad publicada con tema, plantilla y abre Classroom", () => {
		const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

		render(
			<TarjetaActividadSeguimiento
				actividad={{
					idTarea: "t-1",
					idClase: "c-1",
					nombreClase: "Metodología de la Investigación",
					titulo: "Entrega 1: Matriz de Consistencia",
					descripcion: "Completar matriz",
					estado: "PUBLISHED",
					nombreTema: "Semana 1",
					idPlantilla: "plan-1",
					nombrePlantilla: "Matriz.xlsx",
					enlacePlantilla: "https://drive.google.com/open?id=plan-1",
					fechaLimite: "2026-10-15T23:59:00",
					enlaceTarea: "https://classroom.google.com/c/1/a/1",
				}}
			/>,
		);

		expect(screen.getByText("Entrega 1: Matriz de Consistencia")).toBeDefined();
		expect(screen.getByText("Completar matriz")).toBeDefined();
		expect(screen.getByText("Publicada")).toBeDefined();
		expect(screen.getByText("Metodología de la Investigación")).toBeDefined();
		expect(screen.getByText("Semana 1")).toBeDefined();
		expect(screen.getByText("Matriz.xlsx")).toBeDefined();

		const btnAbrir = screen.getByRole("button", { name: /abrir en classroom/iu });
		fireEvent.click(btnAbrir);
		expect(openSpy).toHaveBeenCalledWith(
			"https://classroom.google.com/c/1/a/1",
			"_blank",
			"noopener,noreferrer",
		);
		openSpy.mockRestore();
	});

	it("renderiza estado borrador, sin fecha limite ni enlace de plantilla y soporta export default", () => {
		render(
			<TarjetaActividadSeguimiento
				actividad={{
					idTarea: "t-2",
					titulo: "Borrador de Seguimiento",
					estado: "DRAFT",
					fechaLimite: null,
				}}
			/>,
		);

		expect(screen.getByText("Borrador")).toBeDefined();
		expect(screen.getByText("Sin fecha límite")).toBeDefined();
		expect(screen.getByText("Plantilla vinculada")).toBeDefined();
		expect(DefaultTarjetaActividad).toBe(TarjetaActividadSeguimiento);
	});
});
