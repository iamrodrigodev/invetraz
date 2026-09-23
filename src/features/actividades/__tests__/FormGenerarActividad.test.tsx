import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormGenerarActividad } from "@/features/actividades/components/FormGenerarActividad";

describe("FormGenerarActividad (Cascarón Puro)", () => {
	const clasesMock = [{ idClassroom: "c1", nombre: "Clase de Prueba" }];
	const plantillasMock = [
		{
			id: "p1",
			nombre: "Plantilla 1.xlsx",
			frecuenciaUso: 2,
			estructuraValida: true,
			enlaceWeb: "https://docs.google.com/test",
		},
	];
	const carpetaMock = {
		id: "folder-123",
		nombre: "Carpeta Drive de Prueba",
	};

	it("renderiza todos los campos obligatorios y opcionales correctamente", () => {
		render(
			<FormGenerarActividad
				clases={clasesMock}
				plantillas={plantillasMock}
				temas={[]}
				carpetaDrive={carpetaMock}
				alEnviar={vi.fn()}
				alCancelar={vi.fn()}
			/>,
		);

		expect(screen.getByText("Carpeta Drive de Prueba")).toBeDefined();
		expect(screen.getByText("Abrir en Drive")).toBeDefined();
		expect(screen.getByText("Clase")).toBeDefined();
		expect(screen.getByText("Título")).toBeDefined();
		expect(screen.getByText("Fecha de vencimiento")).toBeDefined();
		expect(screen.getByText("Plantilla de seguimiento")).toBeDefined();
		expect(screen.getByText("Hora de vencimiento")).toBeDefined();
		expect(screen.getByText("Tema")).toBeDefined();
		expect(screen.getByText("Descripción")).toBeDefined();
		expect(
			screen.getByPlaceholderText(
				"Ingresa el título de la actividad de seguimiento",
			),
		).toBeDefined();
		expect(screen.getByRole("button", { name: /generar/i })).toBeDefined();
		expect(screen.getByRole("button", { name: /cancelar/i })).toBeDefined();
	});
});
