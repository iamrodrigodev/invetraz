import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalConfirmarGeneracion } from "@/features/actividades/components/ModalConfirmarGeneracion.tsx";
import type { ResumenConfirmacionActividad } from "@/features/actividades/types/actividades.types.ts";

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

		expect(screen.getByText("Confirmar actividad de seguimiento")).toBeDefined();
		expect(screen.getByText("Investigación Formativa A")).toBeDefined();
		expect(screen.getByText("Entrega de Avance Metodológico")).toBeDefined();
		expect(screen.getByText("Matriz_Seguimiento_2026.xlsx")).toBeDefined();
		expect(screen.getByText("Estructura válida")).toBeDefined();
		expect(screen.getByText(/11:59 pm/iu)).toBeDefined();
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

		fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
		expect(alCerrar).toHaveBeenCalledTimes(2);
	});

	it("soporta estado cargando deshabilitando botones y previene alCerrar", () => {
		const alCerrar = vi.fn();
		render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={true}
				resumen={resumenPrueba}
				alConfirmar={vi.fn()}
				alCerrar={alCerrar}
			/>,
		);

		expect(screen.getByText("Generando actividad de seguimiento")).toBeDefined();
		const btnConfirmar = screen.getByRole("button", {
			name: /Generando actividad de seguimiento/iu,
		});
		expect(btnConfirmar.getAttribute("disabled")).not.toBeNull();

		const closeBtn = screen.getByRole("button", { name: "Cerrar" });
		fireEvent.click(closeBtn);
		expect(alCerrar).not.toHaveBeenCalled();
	});

	it("maneja fallbacks en formateo de hora y fecha", () => {
		const resumenInvalido: ResumenConfirmacionActividad = {
			...resumenPrueba,
			fechaVencimiento: "fecha-invalida",
			horaVencimiento: "hora-invalida",
			nombreTema: undefined,
			descripcion: undefined,
		};

		render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={resumenInvalido}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		expect(screen.getByText(/fecha-invalida a las hora-invalida/u)).toBeDefined();
	});

	it("maneja fecha vacia y horas am/pm", () => {
		const resumenHoras: ResumenConfirmacionActividad = {
			...resumenPrueba,
			fechaVencimiento: "",
			horaVencimiento: "08:30",
		};

		const { rerender } = render(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={resumenHoras}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		expect(screen.getByText("-")).toBeDefined();

		rerender(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={{
					...resumenPrueba,
					fechaVencimiento: "2026-10-15",
					horaVencimiento: "00:00",
				}}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);
		expect(screen.getByText(/12:00 am/iu)).toBeDefined();

		rerender(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={{
					...resumenPrueba,
					fechaVencimiento: "2026-10-15",
					horaVencimiento: "12:00",
				}}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);
		expect(screen.getByText(/12:00 pm/iu)).toBeDefined();

		rerender(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={{
					...resumenPrueba,
					fechaVencimiento: "2026-10-15",
					horaVencimiento: "",
				}}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		rerender(
			<ModalConfirmarGeneracion
				abierto={true}
				cargando={false}
				resumen={{
					...resumenPrueba,
					fechaVencimiento: "fecha-invalida",
					horaVencimiento: "",
				}}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);
		expect(screen.getByText("fecha-invalida")).toBeDefined();
	});
});
