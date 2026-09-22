import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TarjetaCarpetaDrive } from "../components/TarjetaCarpetaDrive";

describe("TarjetaCarpetaDrive", () => {
	it("no muestra alerta de advertencia cuando Google Cloud está en estado 'verificando'", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Mis Plantillas"
				carpetaVerificadaInicial={true}
				estadoCredencialesGoogle="verificando"
			/>,
		);

		expect(
			screen.queryByText(/tampoco lo estarán en las plantillas/i),
		).toBeNull();

		expect(screen.queryByText("Conexión activa con Google")).toBeNull();
		expect(screen.getByText("Verificando conexión...")).toBeDefined();

		const botonVerificar = screen.getByRole("button", {
			name: /Verificar Conexión/i,
		});
		expect(botonVerificar.getAttribute("title")).toBe(
			"Espera a que finalice la verificación de Google Cloud",
		);
	});

	it("muestra alerta de advertencia y estado 'No se puede usar' cuando Google Cloud está en 'guardado_pendiente'", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Mis Plantillas"
				carpetaVerificadaInicial={false}
				estadoCredencialesGoogle="guardado_pendiente"
			/>,
		);

		expect(
			screen.getByText(/tampoco lo estarán en las plantillas/i),
		).toBeDefined();

		expect(screen.getByText("Mis Plantillas")).toBeDefined();
		const badgesNoDisponible = screen.getAllByText("No se puede usar");
		expect(badgesNoDisponible.length).toBeGreaterThan(0);
	});

	it("muestra carpeta vinculada correctamente cuando las credenciales están conectadas", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Plantillas Verificadas"
				carpetaVerificadaInicial={true}
				estadoCredencialesGoogle="conectado"
			/>,
		);

		expect(screen.getByText("Plantillas Verificadas")).toBeDefined();
		expect(screen.getByText("Carpeta vinculada")).toBeDefined();
		expect(
			screen.queryByText(/tampoco lo estarán en las plantillas/i),
		).toBeNull();
	});
});
