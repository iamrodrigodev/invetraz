// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
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
