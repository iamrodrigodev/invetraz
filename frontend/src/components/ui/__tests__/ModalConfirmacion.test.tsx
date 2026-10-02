import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion.tsx";

describe("ModalConfirmacion", () => {
	it("renderiza titulo, descripcion y botones por defecto", () => {
		render(
			<ModalConfirmacion
				abierto={true}
				titulo="¿Cerrar sesión?"
				descripcion="Perderás los cambios no guardados"
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		expect(screen.getByText("¿Cerrar sesión?")).toBeDefined();
		expect(screen.getByText("Perderás los cambios no guardados")).toBeDefined();
		expect(screen.getByRole("button", { name: /confirmar/iu })).toBeDefined();
		expect(screen.getByRole("button", { name: /cancelar/iu })).toBeDefined();
	});

	it("dispara alConfirmar y alCerrar al hacer clic en los respectivos botones", () => {
		const handleConfirmar = vi.fn();
		const handleCerrar = vi.fn();

		render(
			<ModalConfirmacion
				abierto={true}
				titulo="Confirmar"
				descripcion="Pregunta"
				textoConfirmar="Aceptar"
				textoCancelar="Volver"
				varianteBoton="primario"
				alConfirmar={handleConfirmar}
				alCerrar={handleCerrar}
			/>,
		);

		const btnConfirmar = screen.getByRole("button", { name: /aceptar/iu });
		const btnCancelar = screen.getByRole("button", { name: /volver/iu });

		fireEvent.click(btnConfirmar);
		expect(handleConfirmar).toHaveBeenCalledTimes(1);

		fireEvent.click(btnCancelar);
		expect(handleCerrar).toHaveBeenCalledTimes(1);
	});

	it("muestra spinner de carga y deshabilita botones cuando cargando es true", () => {
		render(
			<ModalConfirmacion
				abierto={true}
				titulo="Eliminando"
				descripcion="Por favor espera"
				cargando={true}
				alConfirmar={vi.fn()}
				alCerrar={vi.fn()}
			/>,
		);

		expect(screen.getByText(/cargando.../iu)).toBeDefined();
		const btnCancelar = screen.getByRole("button", { name: /cancelar/iu });
		expect(btnCancelar.hasAttribute("disabled")).toBe(true);
	});
});
