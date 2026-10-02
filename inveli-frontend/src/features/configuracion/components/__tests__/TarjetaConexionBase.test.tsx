import { fireEvent, render, screen } from "@testing-library/react";
import { Key } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { TarjetaConexionBase } from "@/features/configuracion/components/TarjetaConexionBase.tsx";

describe("TarjetaConexionBase", () => {
	it("renderiza titulo, descripcion, badges, cabecera extra y botones en modo contenedor", () => {
		const onVerificar = vi.fn();
		const onGuardar = vi.fn();
		const onLimpiarExito = vi.fn();
		const onLimpiarError = vi.fn();

		render(
			<TarjetaConexionBase
				titulo="Conexión Principal"
				descripcion="Descripción de prueba"
				icono={Key}
				estado="conectado"
				mensajeExito="Guardado exitoso"
				varianteMensajeExito="warning"
				mensajeError="Ocurrió un fallo"
				onLimpiarExito={onLimpiarExito}
				onLimpiarError={onLimpiarError}
				tooltipVerificar="Tooltip Probar"
				tooltipGuardar="Tooltip Guardar"
				textoVerificar="Probar enlace"
				textoGuardar="Salvar datos"
				onVerificar={onVerificar}
				onGuardar={onGuardar}
				cabeceraExtra={<div data-testid="cabecera-extra">Extra</div>}
			>
				<div>Contenido Hijo</div>
			</TarjetaConexionBase>,
		);

		expect(screen.getByText("Conexión Principal")).toBeDefined();
		expect(screen.getByText("Descripción de prueba")).toBeDefined();
		expect(screen.getByText("Conexión activa con Google")).toBeDefined();
		expect(screen.getByTestId("cabecera-extra")).toBeDefined();
		expect(screen.getByText("Contenido Hijo")).toBeDefined();

		expect(screen.getByText("Guardado exitoso")).toBeDefined();
		expect(screen.getByText("Ocurrió un fallo")).toBeDefined();

		const closeButtons = screen.getAllByRole("button", {
			name: "Cerrar notificación",
		});
		const btn0 = closeButtons[0];
		if (btn0) {
			fireEvent.click(btn0);
		}
		expect(onLimpiarExito).toHaveBeenCalledTimes(1);

		const btn1 = closeButtons[1];
		if (btn1) {
			fireEvent.click(btn1);
		}
		expect(onLimpiarError).toHaveBeenCalledTimes(1);

		const btnVerificar = screen.getByRole("button", { name: "Probar enlace" });
		expect(btnVerificar.getAttribute("title")).toBe("Tooltip Probar");
		fireEvent.click(btnVerificar);
		expect(onVerificar).toHaveBeenCalledTimes(1);

		const btnGuardar = screen.getByRole("button", { name: "Salvar datos" });
		expect(btnGuardar.getAttribute("title")).toBe("Tooltip Guardar");
		fireEvent.click(btnGuardar);
		expect(onGuardar).toHaveBeenCalledTimes(1);
	});

	it("renderiza modo formulario y soporta estados verificando y guardando", () => {
		const onSubmit = vi.fn((e) => e.preventDefault());

		const { rerender } = render(
			<TarjetaConexionBase
				titulo="Formulario de Acceso"
				descripcion="Descripción"
				icono={Key}
				estado="no_configurado"
				esFormulario={true}
				onSubmit={onSubmit}
				verificando={true}
				guardando={false}
				deshabilitarVerificar={true}
			>
				<input data-testid="input-child" />
			</TarjetaConexionBase>,
		);

		expect(screen.getByText("Verificando...")).toBeDefined();
		const btnVerificar = screen.getByRole("button", { name: "Verificando..." });
		expect(btnVerificar.getAttribute("disabled")).not.toBeNull();

		rerender(
			<TarjetaConexionBase
				titulo="Formulario de Acceso"
				descripcion="Descripción"
				icono={Key}
				estado="no_configurado"
				esFormulario={true}
				onSubmit={onSubmit}
				verificando={false}
				guardando={true}
				deshabilitarGuardar={true}
			>
				<input data-testid="input-child" />
			</TarjetaConexionBase>,
		);

		expect(screen.getByText("Verificando y guardando...")).toBeDefined();
		const form = document.querySelector("form");
		if (form) {
			fireEvent.submit(form);
		}
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("muestra alertas sin funciones de limpieza onClose", () => {
		render(
			<TarjetaConexionBase
				titulo="Alertas sin callback"
				descripcion="Descripción"
				icono={Key}
				estado="conectado"
				mensajeExito="Exito estatico"
				mensajeError="Error estatico"
			>
				<div>Hijo</div>
			</TarjetaConexionBase>,
		);

		expect(screen.getByText("Exito estatico")).toBeDefined();
		expect(screen.getByText("Error estatico")).toBeDefined();
	});
});
