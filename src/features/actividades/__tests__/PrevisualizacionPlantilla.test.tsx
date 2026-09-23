import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrevisualizacionPlantilla } from "@/features/actividades/components/PrevisualizacionPlantilla.tsx";

describe("PrevisualizacionPlantilla", () => {
	it("no renderiza nada si no hay plantilla seleccionada", () => {
		const { container } = render(<PrevisualizacionPlantilla plantilla={null} />);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza correctamente cuando la estructura es válida", () => {
		render(
			<PrevisualizacionPlantilla
				plantilla={{
					id: "p1",
					nombre: "Formato A.xlsx",
					frecuenciaUso: 3,
					estructuraValida: true,
					enlaceWeb: "https://docs.google.com/test",
				}}
			/>,
		);

		expect(screen.getByText("Formato A.xlsx")).toBeDefined();
		expect(screen.getByText("Estructura válida")).toBeDefined();
		expect(screen.getByText("Abrir plantilla")).toBeDefined();
		expect(screen.getByText(/3 veces/iu)).toBeDefined();
	});

	it("muestra estado de validación cuando validando es true", () => {
		render(
			<PrevisualizacionPlantilla
				plantilla={{
					id: "p1",
					nombre: "Formato A.xlsx",
					frecuenciaUso: 1,
					estructuraValida: true,
				}}
				validando={true}
			/>,
		);

		expect(screen.getByText("Verificando estructura de la plantilla")).toBeDefined();
	});

	it("muestra el estado inválido con errores de estructura", () => {
		render(
			<PrevisualizacionPlantilla
				plantilla={{
					id: "p2",
					nombre: "Formato Invalido.xlsx",
					frecuenciaUso: 0,
					estructuraValida: false,
					mensajeErrorEstructura: "Faltan columnas requeridas",
					erroresEstructura: [
						"No se encontraron los marcadores obligatorios {{ESTUDIANTE}} y {{CRITERIO}}.",
						"Falta la hoja principal Matriz de Seguimiento.",
					],
					enlaceWeb: "https://docs.google.com/test-invalido",
				}}
			/>,
		);

		expect(screen.getByText("Formato Invalido.xlsx")).toBeDefined();
		expect(screen.getByText("Estructura inválida")).toBeDefined();
		expect(screen.getByText("Faltan columnas requeridas")).toBeDefined();
		expect(
			screen.getByText(
				"No se encontraron los marcadores obligatorios {{ESTUDIANTE}} y {{CRITERIO}}.",
			),
		).toBeDefined();
		expect(screen.getByText("Falta la hoja principal Matriz de Seguimiento.")).toBeDefined();
		expect(screen.getByText("Abrir plantilla")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});

	it("muestra 1 vez en singular y usa mensaje por defecto cuando no se proveen errores o enlace", () => {
		const { unmount } = render(
			<PrevisualizacionPlantilla
				plantilla={{
					id: "p1",
					nombre: "Formato Unico.xlsx",
					frecuenciaUso: 1,
					estructuraValida: true,
				}}
			/>,
		);
		expect(screen.getByText(/1 vez/iu)).toBeDefined();
		unmount();

		render(
			<PrevisualizacionPlantilla
				plantilla={{
					id: "p2",
					nombre: "Formato Defecto.xlsx",
					frecuenciaUso: 0,
					estructuraValida: false,
				}}
			/>,
		);
		expect(
			screen.getByText(
				"La plantilla seleccionada no cumple con la estructura requerida para la actividad de seguimiento.",
			),
		).toBeDefined();
		expect(screen.queryByText("Abrir plantilla")).toBeNull();
	});
});
