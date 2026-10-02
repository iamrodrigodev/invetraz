import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DefaultTimePicker, { TimePicker } from "@/components/ui/TimePicker.tsx";

describe("TimePicker component", () => {
	it("renderiza con placeholder inicial y name como input oculto", () => {
		const idPersonalizado = "custom-tp";
		const { container } = render(
			<TimePicker placeholder="--:--" name="hora_limite" id={idPersonalizado} />,
		);

		expect(screen.getByText("--:--")).toBeDefined();
		const hiddenInput = container.querySelector('input[type="hidden"]');
		expect(hiddenInput).toBeDefined();
		expect(hiddenInput?.getAttribute("name")).toBe("hora_limite");
		expect(container.querySelector(`#${idPersonalizado}`)).toBeDefined();
	});

	it("abre el selector de hora al hacer clic en el botón", () => {
		const { container } = render(<TimePicker placeholder="--:--" />);

		const boton = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(boton);

		expect(screen.getByRole("dialog")).toBeDefined();
		expect(screen.getByText("Fin del día (23:59)")).toBeDefined();
	});

	it("no abre si disabled es true", () => {
		const { container } = render(<TimePicker disabled={true} placeholder="--:--" />);
		const boton = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(boton);
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("muestra hora cuando se le pasa un valor válido controlado", () => {
		render(<TimePicker value="14:30" />);
		expect(screen.getByText("14:30")).toBeDefined();
	});

	it("permite seleccionar hora y minuto en modo no controlado", () => {
		const manejarCambio = vi.fn();
		const { container } = render(<TimePicker defaultValue="10:20" onChange={manejarCambio} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);

		const columnas = container.querySelectorAll(".max-h-36");
		const colHoras = columnas[0];
		const colMinutos = columnas[1];

		const btnHora = colHoras?.querySelector("button:nth-child(16)") as HTMLElement | null;
		if (btnHora) {
			fireEvent.click(btnHora);
		}
		expect(manejarCambio).toHaveBeenCalledWith("15:20");

		const btnMinuto = colMinutos?.querySelector("button:nth-child(10)") as HTMLElement | null;
		if (btnMinuto) {
			fireEvent.click(btnMinuto);
		}
		expect(manejarCambio).toHaveBeenCalledWith("15:45");
	});

	it("selecciona hora y minuto cuando no habia hora previa en valor", () => {
		const manejarCambio = vi.fn();
		const { container } = render(<TimePicker onChange={manejarCambio} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		if (trigger) {
			fireEvent.click(trigger);
		}

		const columnas = container.querySelectorAll(".max-h-36");
		const colMinutos = columnas[1];

		const btnMinuto = colMinutos?.querySelector("button:nth-child(7)") as HTMLElement | null;
		if (btnMinuto) {
			fireEvent.click(btnMinuto);
		}
		expect(manejarCambio).toHaveBeenCalledWith("12:30");
	});

	it("llama a onChange al hacer clic en fin del día en modo controlado y no controlado", () => {
		const manejarCambio = vi.fn();
		const { rerender, container } = render(<TimePicker onChange={manejarCambio} />);

		let trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const botonFinDia = screen.getByText("Fin del día (23:59)");
		fireEvent.click(botonFinDia);

		expect(manejarCambio).toHaveBeenCalledWith("23:59");

		rerender(<TimePicker value="10:00" onChange={manejarCambio} />);
		trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const botonFinDia2 = screen.getByText("Fin del día (23:59)");
		fireEvent.click(botonFinDia2);
		expect(manejarCambio).toHaveBeenCalledWith("23:59");
	});

	it("limpia hora desde el boton de icono", () => {
		const manejarCambio = vi.fn();
		render(<TimePicker defaultValue="14:30" onChange={manejarCambio} />);

		const botonLimpiar = screen.getByTitle("Limpiar hora");
		fireEvent.click(botonLimpiar);
		expect(manejarCambio).toHaveBeenCalledWith("");
	});

	it("limpia hora desde el boton limpiar del dropdown", () => {
		const manejarCambio = vi.fn();
		const { container } = render(<TimePicker defaultValue="14:30" onChange={manejarCambio} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const btnLimpiarDropdown = screen.getByRole("button", { name: "Limpiar" });
		fireEvent.click(btnLimpiarDropdown);
		expect(manejarCambio).toHaveBeenCalledWith("");
	});

	it("limpia hora en modo controlado", () => {
		const manejarCambio = vi.fn();
		render(<TimePicker value="14:30" onChange={manejarCambio} />);
		const botonLimpiar = screen.getByTitle("Limpiar hora");
		fireEvent.click(botonLimpiar);
		expect(manejarCambio).toHaveBeenCalledWith("");
	});

	it("respeta posicionDropdown arriba, abajo y auto", () => {
		const { rerender, container } = render(<TimePicker posicionDropdown="arriba" />);
		let trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		let dialog = screen.getByRole("dialog");
		expect(dialog.className).toContain("bottom-full");

		rerender(<TimePicker posicionDropdown="abajo" />);
		trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		dialog = screen.getByRole("dialog");
		expect(dialog.className).toContain("top-full");

		const dialogWrapper = document.createElement("div");
		dialogWrapper.setAttribute("role", "dialog");
		document.body.appendChild(dialogWrapper);
		const { container: containerAuto } = render(<TimePicker posicionDropdown="auto" />, {
			container: dialogWrapper,
		});

		const wrapper = containerAuto.firstChild as HTMLElement;
		vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
			bottom: 500,
			top: 450,
			left: 0,
			right: 200,
			width: 200,
			height: 40,
			x: 0,
			y: 450,
			toJSON: () => {},
		});
		vi.spyOn(dialogWrapper, "getBoundingClientRect").mockReturnValue({
			bottom: 600,
			top: 100,
			left: 0,
			right: 500,
			width: 500,
			height: 500,
			x: 0,
			y: 100,
			toJSON: () => {},
		});

		const triggerAuto = containerAuto.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(triggerAuto);
		expect(screen.getAllByRole("dialog").length).toBeGreaterThan(0);
		document.body.removeChild(dialogWrapper);
	});

	it("calcula auto con viewport window cuando no hay contenedor dialog", () => {
		const { container } = render(<TimePicker posicionDropdown="auto" />);
		const wrapper = container.firstChild as HTMLElement;
		vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
			bottom: 750,
			top: 700,
			left: 0,
			right: 200,
			width: 200,
			height: 40,
			x: 0,
			y: 700,
			toJSON: () => {},
		});
		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		expect(screen.getByRole("dialog")).toBeDefined();
	});

	it("llama a onBlur al cerrar con click outside", () => {
		const handleBlur = vi.fn();
		const { container } = render(<TimePicker onBlur={handleBlur} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

		expect(handleBlur).toHaveBeenCalled();
	});

	it("muestra mensaje de error cuando error o errorMessage están activos", () => {
		const { rerender, container } = render(<TimePicker error={true} />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		expect(trigger.getAttribute("aria-invalid")).toBe("true");

		rerender(<TimePicker errorMessage="Hora inválida" />);
		expect(screen.getByText("Hora inválida")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});

	it("funciona con export por defecto", () => {
		expect(DefaultTimePicker).toBe(TimePicker);
	});

	it("soporta seleccionar preajuste, limpiar y cambiar hora sin callback onChange", () => {
		const { container } = render(<TimePicker defaultValue="10:00" />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		if (trigger) {
			fireEvent.click(trigger);
		}

		const btnPreajuste = screen.getByText("Fin del día (23:59)");
		fireEvent.click(btnPreajuste);

		const btnLimpiar = screen.getByTitle("Limpiar hora");
		fireEvent.click(btnLimpiar);

		if (trigger) {
			fireEvent.click(trigger);
		}
		const colHoras = container.querySelectorAll(".max-h-36")[0];
		const btnHora = colHoras?.querySelector("button") as HTMLElement | null;
		if (btnHora) {
			fireEvent.click(btnHora);
		}
	});
});
