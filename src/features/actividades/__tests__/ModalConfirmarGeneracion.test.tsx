import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalConfirmarGeneracion } from "../components/ModalConfirmarGeneracion";
import type { ResumenConfirmacionActividad } from "../types/actividades.types";

const resumenPrueba: ResumenConfirmacionActividad = {
	nombreClase: "Investigación Formativa A",
	titulo: "Entrega de Avance Metodológico",
	nombrePlantilla: "Matriz_Seguimiento_2026.xlsx",
	fechaVencimiento: "2026-10-15",
	horaVencimiento: "23:59",
	nombreTema: "Tema 1: Métodos",
	descripcion: "Revisar avance de literatura",
	enlacePlantillaWeb: "https://docs.google.com/spreadsheets/d/test-sheet",
};

describe("ModalConfirmarGeneracion", () => {
	it("no renderiza nada si resumen es null", () => {
		const { container } = render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={null}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza correctamente los datos del resumen y el botón Abrir plantilla", () => {
		render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={resumenPrueba}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		expect(
			screen.getByText("Confirmar actividad de seguimiento"),
		).toBeDefined();
		expect(screen.getByText("Investigación Formativa A")).toBeDefined();
		expect(screen.getByText("Entrega de Avance Metodológico")).toBeDefined();
		expect(screen.getByText("Matriz_Seguimiento_2026.xlsx")).toBeDefined();
		expect(screen.getByText("Estructura válida")).toBeDefined();
		expect(screen.getByText(/11:59 pm/i)).toBeDefined();
		expect(screen.getByText("Abrir plantilla")).toBeDefined();

		const enlaceSheet = screen.getByText("Abrir plantilla").closest("a");
		expect(enlaceSheet).not.toBeNull();
		expect(enlaceSheet?.getAttribute("href")).toBe(
			"https://docs.google.com/spreadsheets/d/test-sheet",
		);
		expect(enlaceSheet?.getAttribute("target")).toBe("_blank");
	});

	it("no renderiza el botón Abrir plantilla si no hay enlace", () => {
		render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={{ ...resumenPrueba, enlacePlantillaWeb: undefined }}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		expect(screen.queryByText("Abrir plantilla")).toBeNull();
	});

	it("ejecuta alConfirmar y alCerrar según las acciones", () => {
		const alConfirmar = vi.fn();
		const alCerrar = vi.fn();

		render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={resumenPrueba}
				alConfirmar={alConfirmar}
				alCerrar={alCerrar}
			/>,
		);

		fireEvent.click(screen.getByText("Confirmar"));
		expect(alConfirmar).toHaveBeenCalledTimes(1);

		fireEvent.click(screen.getByText("Cancelar"));
		expect(alCerrar).toHaveBeenCalledTimes(1);
	});
});
