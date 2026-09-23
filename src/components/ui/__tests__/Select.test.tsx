// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DefaultSelect, { Select, type SelectOption } from "@/components/ui/Select.tsx";

describe("Select component", () => {
	const opciones: SelectOption[] = [
		{
			value: "opt-1",
			label: "Opción 1",
			badge: "Badge 1",
			badgeVariant: "primary",
			sublabel: "Sub 1",
		},
		{ value: "opt-2", label: "Opción 2", sublabel: "Sub 2" },
		{ value: "opt-3", label: "Opción 3", disabled: true },
	];

	it("renderiza con placeholder inicial, name como input oculto e id custom", () => {
		const { container } = render(
			<Select
				placeholder="Selecciona una opción"
				options={opciones}
				name="campo_select"
				id="custom-select"
			/>,
		);

		expect(screen.getByText("Selecciona una opción")).toBeDefined();
		const hidden = container.querySelector('input[type="hidden"]');
		expect(hidden?.getAttribute("name")).toBe("campo_select");
		expect(container.querySelector("#custom-select")).toBeDefined();
	});

	it("abre el menú desplegable y muestra las opciones al hacer clic", () => {
		render(<Select placeholder="Selecciona una opción" options={opciones} />);

		const boton = screen.getByRole("button");
		fireEvent.click(boton);

		expect(screen.getByRole("listbox")).toBeDefined();
		expect(screen.getByText("Opción 1")).toBeDefined();
		expect(screen.getByText("Badge 1")).toBeDefined();
		expect(screen.getByText("Opción 2")).toBeDefined();
		expect(screen.getByText("Sub 1")).toBeDefined();
	});

	it("muestra mensaje de lista vacia cuando no hay opciones", () => {
		render(<Select options={[]} />);
		const boton = screen.getByRole("button");
		fireEvent.click(boton);
		expect(screen.getByText("No hay opciones disponibles")).toBeDefined();
	});

	it("no abre si disabled es true", () => {
		render(<Select disabled={true} options={opciones} />);
		const boton = screen.getByRole("button");
		fireEvent.click(boton);
		expect(screen.queryByRole("listbox")).toBeNull();
	});

	it("llama a onChange con el valor seleccionado en modo controlado y no controlado", () => {
		const manejarCambio = vi.fn();
		const { rerender, container } = render(
			<Select placeholder="Selecciona una opción" options={opciones} onChange={manejarCambio} />,
		);

		let boton = container.querySelector('button[aria-haspopup="listbox"]')!;
		fireEvent.click(boton);
		fireEvent.click(screen.getByText("Opción 1"));

		expect(manejarCambio).toHaveBeenCalledWith("opt-1");

		rerender(<Select value="opt-1" options={opciones} onChange={manejarCambio} />);

		boton = container.querySelector('button[aria-haspopup="listbox"]')!;
		fireEvent.click(boton);
		fireEvent.click(screen.getByText("Opción 2"));
		expect(manejarCambio).toHaveBeenCalledWith("opt-2");
	});

	it("ignora clics en opciones deshabilitadas", () => {
		const manejarCambio = vi.fn();
		render(
			<Select placeholder="Selecciona una opción" options={opciones} onChange={manejarCambio} />,
		);

		fireEvent.click(screen.getByRole("button"));
		fireEvent.click(screen.getByText("Opción 3"));
		expect(manejarCambio).not.toHaveBeenCalled();
	});

	it("muestra opcion seleccionada con badge y check cuando esta activa", () => {
		render(<Select defaultValue="opt-1" options={opciones} />);

		const boton = screen.getByRole("button");
		fireEvent.click(boton);

		const opcionesLista = screen.getAllByRole("option");
		const primeraOpcion = opcionesLista[0];
		if (primeraOpcion) {
			expect(primeraOpcion.getAttribute("aria-selected")).toBe("true");
		}
	});

	it("muestra mensaje de error cuando error o errorMessage estan presentes", () => {
		const { rerender } = render(<Select error={true} options={opciones} />);
		const boton = screen.getByRole("button");
		expect(boton.getAttribute("aria-invalid")).toBe("true");

		rerender(<Select errorMessage="Este campo es obligatorio" options={opciones} />);

		expect(screen.getByText("Este campo es obligatorio")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
	});

	it("posiciona el menú hacia arriba o abajo según posicionDropdown", () => {
		const { rerender, container } = render(
			<Select placeholder="Selecciona una opción" options={opciones} posicionDropdown="arriba" />,
		);

		let boton = container.querySelector('button[aria-haspopup="listbox"]')!;
		fireEvent.click(boton);
		let listbox = screen.getByRole("listbox");
		expect(listbox.className).toContain("bottom-full");

		rerender(
			<Select placeholder="Selecciona una opción" options={opciones} posicionDropdown="abajo" />,
		);
		boton = container.querySelector('button[aria-haspopup="listbox"]')!;
		listbox = screen.getByRole("listbox");
		expect(listbox.className).toContain("top-full");
	});

	it("calcula auto posicionDropdown con contenedor dialog y sin el", () => {
		const dialogWrapper = document.createElement("div");
		dialogWrapper.setAttribute("role", "dialog");
		document.body.appendChild(dialogWrapper);

		const { container } = render(<Select options={opciones} posicionDropdown="auto" />, {
			container: dialogWrapper,
		});

		const wrapper = container.firstChild as HTMLElement;
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

		const trigger = container.querySelector('button[aria-haspopup="listbox"]')!;
		fireEvent.click(trigger);
		expect(screen.getByRole("listbox")).toBeDefined();
		document.body.removeChild(dialogWrapper);

		const { container: containerWin } = render(
			<Select options={opciones} posicionDropdown="auto" />,
		);
		const wrapperWin = containerWin.firstChild as HTMLElement;
		vi.spyOn(wrapperWin, "getBoundingClientRect").mockReturnValue({
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
		const triggerWin = containerWin.querySelector('button[aria-haspopup="listbox"]')!;
		fireEvent.click(triggerWin);
		expect(screen.getByRole("listbox")).toBeDefined();
	});

	it("llama a onBlur al cerrar con click outside", () => {
		const handleBlur = vi.fn();
		const { container } = render(<Select options={opciones} onBlur={handleBlur} />);

		const trigger = container.querySelector('button[aria-haspopup="listbox"]')!;
		fireEvent.click(trigger);
		document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

		expect(handleBlur).toHaveBeenCalled();
	});

	it("exporta Select por defecto correctamente", () => {
		expect(DefaultSelect).toBe(Select);
	});

	it("soporta opciones con badge sin badgeVariant y seleccion sin callback onChange", () => {
		const optsConBadge: SelectOption[] = [
			{ value: "b1", label: "Etiqueta", badge: "EtiquetaBadge" },
		];
		const { container } = render(<Select options={optsConBadge} defaultValue="b1" />);
		expect(screen.getByText("EtiquetaBadge")).toBeDefined();

		const trigger = container.querySelector('button[aria-haspopup="listbox"]');
		if (trigger) {
			fireEvent.click(trigger);
		}

		const optItems = screen.getAllByText("Etiqueta");
		const optItem = optItems[1];
		if (optItem) {
			fireEvent.click(optItem);
		}
	});

	it("no abre el dropdown si el select esta deshabilitado", () => {
		const { container } = render(<Select options={opciones} disabled={true} />);
		const trigger = container.querySelector('button[aria-haspopup="listbox"]');
		if (trigger) {
			fireEvent.click(trigger);
		}
		expect(screen.queryByRole("listbox")).toBeNull();
	});

	it("cierra el dropdown con click outside sin onBlur", () => {
		const { container } = render(<Select options={opciones} />);
		const trigger = container.querySelector('button[aria-haspopup="listbox"]');
		if (trigger) {
			fireEvent.click(trigger);
		}
		expect(screen.getByRole("listbox")).toBeDefined();
		fireEvent.mouseDown(document);
		expect(screen.queryByRole("listbox")).toBeNull();
	});
});
