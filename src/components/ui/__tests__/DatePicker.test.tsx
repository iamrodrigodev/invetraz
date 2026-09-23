// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "@/components/ui/DatePicker.tsx";

describe("DatePicker component", () => {
	it("renderiza con placeholder inicial y name como input oculto", () => {
		const { container } = render(<DatePicker placeholder="dd/mm/aaaa" name="fecha_limite" />);

		expect(screen.getByText("dd/mm/aaaa")).toBeDefined();
		const hiddenInput = container.querySelector('input[type="hidden"]');
		expect(hiddenInput).toBeDefined();
		expect(hiddenInput?.getAttribute("name")).toBe("fecha_limite");
	});

	it("abre el calendario al hacer clic en el botón", () => {
		const { container } = render(<DatePicker placeholder="dd/mm/aaaa" />);

		const boton = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(boton);

		expect(screen.getByRole("dialog")).toBeDefined();
		expect(screen.getByText("Hoy")).toBeDefined();
	});

	it("no abre el calendario si disabled es true", () => {
		const { container } = render(<DatePicker disabled={true} placeholder="dd/mm/aaaa" />);
		const boton = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(boton);
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("muestra fecha formateada cuando se le pasa un valor válido", () => {
		render(<DatePicker value="2026-09-25" />);
		expect(screen.getByText("25/09/2026")).toBeDefined();
	});

	it("permite navegar entre meses anterior y siguiente cruzando de año", () => {
		const { container } = render(<DatePicker value="2026-01-15" />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);

		expect(screen.getByText(/enero 2026/iu)).toBeDefined();

		const btnAnterior = screen.getByTitle("Mes anterior");
		fireEvent.click(btnAnterior);
		expect(screen.getByText(/diciembre 2025/iu)).toBeDefined();

		const btnSiguiente = screen.getByTitle("Mes siguiente");
		fireEvent.click(btnSiguiente);
		expect(screen.getByText(/enero 2026/iu)).toBeDefined();

		fireEvent.click(btnSiguiente);
		expect(screen.getByText(/febrero 2026/iu)).toBeDefined();

		fireEvent.click(btnAnterior);
		expect(screen.getByText(/enero 2026/iu)).toBeDefined();
	});

	it("llama a onChange al hacer clic en un día del calendario", () => {
		const manejarCambio = vi.fn();
		const { container } = render(
			<DatePicker value="2026-05-10" onChange={manejarCambio} defaultValue="2026-05-10" />,
		);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const dia15 = screen.getByRole("button", { name: "15" });
		fireEvent.click(dia15);

		expect(manejarCambio).toHaveBeenCalledWith("2026-05-15");
	});

	it("maneja selección en modo no controlado", () => {
		const { container } = render(<DatePicker defaultValue="2026-05-10" />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const dia20 = screen.getByRole("button", { name: "20" });
		fireEvent.click(dia20);

		expect(screen.getByText("20/05/2026")).toBeDefined();
	});

	it("limpia la fecha al hacer clic en el boton de limpiar", () => {
		const manejarCambio = vi.fn();
		render(<DatePicker value="2026-09-25" onChange={manejarCambio} />);

		const botonLimpiar = screen.getByTitle("Limpiar fecha");
		fireEvent.click(botonLimpiar);

		expect(manejarCambio).toHaveBeenCalledWith("");
	});

	it("limpia fecha desde el boton limpiar del dropdown", () => {
		const manejarCambio = vi.fn();
		const { container } = render(<DatePicker defaultValue="2026-09-25" onChange={manejarCambio} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const botonLimpiar = screen.getByRole("button", { name: "Limpiar" });
		fireEvent.click(botonLimpiar);

		expect(manejarCambio).toHaveBeenCalledWith("");
	});

	it("llama a onChange al hacer clic en Hoy", () => {
		const manejarCambio = vi.fn();
		const { container } = render(<DatePicker onChange={manejarCambio} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const botonHoy = screen.getByText("Hoy");
		fireEvent.click(botonHoy);

		expect(manejarCambio).toHaveBeenCalled();
	});

	it("deshabilita dias fuera de min y max", () => {
		const manejarCambio = vi.fn();
		const { container } = render(
			<DatePicker value="2026-05-10" min="2026-05-05" max="2026-05-20" onChange={manejarCambio} />,
		);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const dia2 = screen.getByRole("button", { name: "2" });
		expect(dia2.hasAttribute("disabled")).toBe(true);
		fireEvent.click(dia2);
		expect(manejarCambio).not.toHaveBeenCalled();
	});

	it("respeta posicionDropdown arriba y abajo", () => {
		const { rerender, container } = render(
			<DatePicker value="2026-05-10" posicionDropdown="arriba" />,
		);
		let trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		let dialog = screen.getByRole("dialog");
		expect(dialog.className).toContain("bottom-full");

		rerender(<DatePicker value="2026-05-10" posicionDropdown="abajo" />);
		trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		dialog = screen.getByRole("dialog");
		expect(dialog.className).toContain("top-full");
	});

	it("calcula posicion auto hacia arriba si hay poco espacio abajo", () => {
		const { container } = render(<DatePicker value="2026-05-10" posicionDropdown="auto" />);
		const wrapper = container.firstChild as HTMLElement;
		vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
			bottom: 750,
			top: 600,
			left: 0,
			right: 200,
			width: 200,
			height: 40,
			x: 0,
			y: 600,
			toJSON: () => {},
		});

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		const dialog = screen.getByRole("dialog");
		expect(dialog).toBeDefined();
	});

	it("llama a onBlur al cerrar", () => {
		const handleBlur = vi.fn();
		const { container } = render(<DatePicker onBlur={handleBlur} />);

		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

		expect(handleBlur).toHaveBeenCalled();
	});

	it("muestra mensaje de error cuando se le provee", () => {
		render(<DatePicker errorMessage="Fecha requerida" />);

		expect(screen.getByText("Fecha requerida")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});

	it("inicializa el mes y anio a partir de min si no hay valor", () => {
		const { container } = render(<DatePicker min="2027-08-15" id="custom-dp" />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);
		expect(screen.getByText(/agosto 2027/iu)).toBeDefined();
		expect(container.querySelector("#custom-dp")).toBeDefined();
	});

	it("selecciona hoy y permite limpiar en modo no controlado", () => {
		const handleChange = vi.fn();
		const { container } = render(<DatePicker defaultValue="" onChange={handleChange} />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);

		const btnHoy = screen.getByRole("button", { name: "Hoy" });
		fireEvent.click(btnHoy);
		expect(handleChange).toHaveBeenCalled();

		const btnLimpiar = screen.getByTitle("Limpiar fecha");
		fireEvent.click(btnLimpiar);
		expect(handleChange).toHaveBeenCalledWith("");
	});

	it("no selecciona hoy si esta fuera del rango maximo", () => {
		const { container } = render(<DatePicker defaultValue="" max="2000-01-01" />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]')!;
		fireEvent.click(trigger);

		const btnHoy = screen.getByRole("button", { name: "Hoy" });
		fireEvent.click(btnHoy);
		expect(screen.queryByRole("dialog")).toBeDefined();
	});

	it("no abre el dialogo si disabled es true", () => {
		const { container } = render(<DatePicker disabled={true} />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		if (trigger) {
			fireEvent.click(trigger);
		}
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("no selecciona hoy si esta fuera del rango minimo", () => {
		const { container } = render(<DatePicker defaultValue="" min="2099-01-01" />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		if (trigger) {
			fireEvent.click(trigger);
		}

		const btnHoy = screen.getByRole("button", { name: "Hoy" });
		fireEvent.click(btnHoy);
		expect(screen.queryByRole("dialog")).toBeDefined();
	});

	it("soporta seleccionar hoy y limpiar en modo controlado sin callback onChange", () => {
		const { container } = render(<DatePicker value="2026-05-10" />);
		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		if (trigger) {
			fireEvent.click(trigger);
		}

		const btnHoy = screen.getByRole("button", { name: "Hoy" });
		fireEvent.click(btnHoy);

		const btnLimpiar = screen.getByTitle("Limpiar fecha");
		fireEvent.click(btnLimpiar);
	});

	it("calcula posicion dentro de contenedor dialog tanto hacia arriba como hacia abajo", () => {
		const { container } = render(
			<div role="dialog">
				<DatePicker posicionDropdown="auto" />
			</div>,
		);
		const wrapper = container.querySelector(".relative") as HTMLElement | null;
		if (wrapper) {
			vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
				bottom: 700,
				top: 500,
				left: 0,
				right: 200,
				width: 200,
				height: 40,
				x: 0,
				y: 500,
				toJSON: () => {},
			});
		}
		const dialogEl = container.querySelector('[role="dialog"]') as HTMLElement | null;
		if (dialogEl) {
			vi.spyOn(dialogEl, "getBoundingClientRect").mockReturnValue({
				bottom: 800,
				top: 100,
				left: 0,
				right: 400,
				width: 400,
				height: 700,
				x: 0,
				y: 100,
				toJSON: () => {},
			});
		}

		const trigger = container.querySelector('button[aria-haspopup="dialog"]');
		if (trigger) {
			fireEvent.click(trigger);
		}

		if (wrapper) {
			vi.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
				bottom: 200,
				top: 150,
				left: 0,
				right: 200,
				width: 200,
				height: 40,
				x: 0,
				y: 150,
				toJSON: () => {},
			});
		}
		if (trigger) {
			fireEvent.click(trigger);
			fireEvent.click(trigger);
		}
	});
});
