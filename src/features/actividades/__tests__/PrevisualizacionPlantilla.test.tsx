import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrevisualizacionPlantilla } from "../components/PrevisualizacionPlantilla";

describe("PrevisualizacionPlantilla", () => {
	it("no renderiza nada si no hay plantilla seleccionada", () => {
		const { container } = render(
			<PrevisualizacionPlantilla plantilla={null} />,
		);
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
		expect(screen.getByText("Ver plantilla en Google Sheets")).toBeDefined();
		expect(screen.getByText(/3 veces/i)).toBeDefined();
	});

	it("muestra alerta cuando la estructura no es válida", () => {
		render(
			<PrevisualizacionPlantilla
				plantilla={{
					id: "p2",
					nombre: "Formato Invalido.xlsx",
					frecuenciaUso: 0,
					estructuraValida: false,
					mensajeErrorEstructura: "Faltan columnas requeridas",
				}}
			/>,
		);

		expect(screen.getByText("Faltan columnas requeridas")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});
});
