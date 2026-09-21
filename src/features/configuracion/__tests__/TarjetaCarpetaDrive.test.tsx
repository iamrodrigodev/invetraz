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
			screen.queryByText(/Google Cloud está guardado, pero no verificado/i),
		).toBeNull();

		// No debe decir 'Conexión activa con Google' prematuramente mientras Google Cloud verifica
		expect(screen.queryByText("Conexión activa con Google")).toBeNull();
		expect(screen.getByText("Verificando conexión...")).toBeDefined();

		// El botón de verificación debe indicar que espera a Google Cloud
		const botonVerificar = screen.getByRole("button", {
			name: /Verificar Conexión/i,
		});
		expect(botonVerificar.getAttribute("title")).toBe(
			"Espera a que finalice la verificación de Google Cloud",
		);
	});

	it("muestra alerta de advertencia cuando Google Cloud está en 'guardado_pendiente'", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Mis Plantillas"
				carpetaVerificadaInicial={false}
				estadoCredencialesGoogle="guardado_pendiente"
			/>,
		);

		expect(
			screen.getByText(/Google Cloud está guardado, pero no verificado/i),
		).toBeDefined();
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
			screen.queryByText(/Google Cloud está guardado, pero no verificado/i),
		).toBeNull();
	});
});
