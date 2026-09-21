import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TarjetaCarpetaVinculada } from "../TarjetaCarpetaVinculada";

describe("TarjetaCarpetaVinculada", () => {
	it("renderiza correctamente cuando el estado es verificando", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Carpeta de Investigación"
				estado="verificando"
			/>,
		);

		expect(screen.getByText("Carpeta de Investigación")).toBeDefined();
		expect(screen.getByText("Verificando...")).toBeDefined();
		expect(screen.getByText("folder-abc-123")).toBeDefined();
		expect(screen.getByText("Abrir en Drive")).toBeDefined();
	});

	it("renderiza correctamente en estado verificada", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Carpeta Verificada"
				estado="verificada"
			/>,
		);

		expect(screen.getByText("Carpeta Verificada")).toBeDefined();
		expect(screen.getByText("Carpeta vinculada")).toBeDefined();
	});

	it("renderiza correctamente en estado pendiente", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Carpeta Sin Verificar"
				estado="pendiente"
			/>,
		);

		expect(screen.getByText(/carpeta guardada sin verificar/i)).toBeDefined();
		expect(screen.getByText("Guardada, no verificada")).toBeDefined();
	});
});
