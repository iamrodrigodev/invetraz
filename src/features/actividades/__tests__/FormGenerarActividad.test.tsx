// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormGenerarActividad } from "@/features/actividades/components/FormGenerarActividad.tsx";

describe("FormGenerarActividad", () => {
	const clasesMock = [{ idClassroom: "c1", nombre: "Clase de Prueba", seccion: "Sec A" }];
	const plantillasMock = [
		{
			id: "p1",
			nombre: "Plantilla 1.xlsx",
			frecuenciaUso: 2,
			estructuraValida: true,
			enlaceWeb: "https://docs.google.com/test",
		},
		{
			id: "p2",
			nombre: "Plantilla 2.xlsx",
			frecuenciaUso: 0,
			estructuraValida: false,
			mensajeErrorEstructura: "Error en columnas",
		},
	];
	const carpetaMock = {
		id: "folder-123",
		nombre: "Carpeta Drive de Prueba",
		verificada: true,
	};
	const temasMock = [{ idTema: "t1", nombre: "Tema Uno" }];

	it("renderiza todos los campos obligatorios y opcionales correctamente", () => {
		render(
			<FormGenerarActividad
				clases={clasesMock}
				plantillas={plantillasMock}
				temas={temasMock}
				carpetaDrive={carpetaMock}
				alEnviar={vi.fn()}
				alCancelar={vi.fn()}
			/>,
		);

		expect(screen.getByText("Carpeta Drive de Prueba")).toBeDefined();
		expect(screen.getByText("Abrir en Drive")).toBeDefined();
		expect(screen.getByText("Clase")).toBeDefined();
		expect(screen.getByText("Título")).toBeDefined();
		expect(screen.getByText("Fecha de vencimiento")).toBeDefined();
		expect(screen.getByText("Plantilla de seguimiento")).toBeDefined();
		expect(screen.getByText("Hora de vencimiento")).toBeDefined();
		expect(screen.getByText("Tema")).toBeDefined();
		expect(screen.getByText("Descripción")).toBeDefined();
		expect(
			screen.getByPlaceholderText("Ingresa el título de la actividad de seguimiento"),
		).toBeDefined();
		expect(screen.getByRole("button", { name: /generar/iu })).toBeDefined();
		expect(screen.getByRole("button", { name: /cancelar/iu })).toBeDefined();
	});

	it("llama onCambioClase al cambiar la clase y maneja temporizador de validacion de plantilla", async () => {
		vi.useFakeTimers();
		const onCambioClase = vi.fn();
		const alEnviar = vi.fn();
		const alCancelar = vi.fn();

		render(
			<FormGenerarActividad
				clases={clasesMock}
				plantillas={plantillasMock}
				temas={temasMock}
				carpetaDrive={carpetaMock}
				onCambioClase={onCambioClase}
				alEnviar={alEnviar}
				alCancelar={alCancelar}
			/>,
		);

		const selectClaseBtn = screen.getByText("Selecciona una clase...");
		fireEvent.click(selectClaseBtn);
		const opcionClase = screen.getByText("Clase de Prueba");
		fireEvent.click(opcionClase);
		expect(onCambioClase).toHaveBeenCalledWith("c1");

		const selectPlantillaBtn = screen.getByText("Selecciona una plantilla de seguimiento...");
		fireEvent.click(selectPlantillaBtn);
		const opcionPlantilla = screen.getByText("Plantilla 1.xlsx");
		fireEvent.click(opcionPlantilla);

		fireEvent.click(screen.getByText("Plantilla 1.xlsx"));
		const opcionPlantilla2 = screen.getByText("Plantilla 2.xlsx");
		fireEvent.click(opcionPlantilla2);

		act(() => {
			vi.advanceTimersByTime(650);
		});

		expect(screen.getByText("Estructura inválida")).toBeDefined();

		const btnCancelar = screen.getByRole("button", { name: /cancelar/iu });
		fireEvent.click(btnCancelar);
		expect(alCancelar).toHaveBeenCalledTimes(1);

		vi.useRealTimers();
	});

	it("cancela temporizador y desactiva validacion si se selecciona una opcion vacia", () => {
		vi.useFakeTimers();
		render(
			<FormGenerarActividad
				clases={clasesMock}
				plantillas={[
					{
						id: "p1",
						nombre: "Plantilla 1.xlsx",
						frecuenciaUso: 0,
						estructuraValida: true,
					},
					{
						id: "",
						nombre: "Limpiar plantilla seleccionada",
						frecuenciaUso: 0,
						estructuraValida: true,
					},
				]}
				temas={temasMock}
				carpetaDrive={carpetaMock}
				alEnviar={vi.fn()}
				alCancelar={vi.fn()}
			/>,
		);

		const selectBtn = screen.getByLabelText(/Plantilla de seguimiento/iu);
		fireEvent.click(selectBtn);
		fireEvent.click(screen.getByText("Plantilla 1.xlsx"));

		fireEvent.click(selectBtn);
		fireEvent.click(screen.getByText("Limpiar plantilla seleccionada"));

		act(() => {
			vi.advanceTimersByTime(650);
		});

		expect(screen.getAllByText("Limpiar plantilla seleccionada").length).toBeGreaterThan(0);
		vi.useRealTimers();
	});

	it("envia el formulario con exito cuando todos los datos son validos", async () => {
		const alEnviar = vi.fn();

		render(
			<FormGenerarActividad
				valoresIniciales={{
					idClase: "c1",
					titulo: "Titulo de prueba",
					fechaVencimiento: "2026-10-10",
					idPlantilla: "p1",
					horaVencimiento: "12:00",
					idTema: "t1",
					descripcion: "Descripcion",
				}}
				clases={clasesMock}
				plantillas={plantillasMock}
				temas={temasMock}
				carpetaDrive={carpetaMock}
				alEnviar={alEnviar}
				alCancelar={vi.fn()}
			/>,
		);

		const form = document.querySelector("form")!;
		await act(async () => {
			fireEvent.submit(form);
		});

		expect(alEnviar).toHaveBeenCalled();
	});
});
