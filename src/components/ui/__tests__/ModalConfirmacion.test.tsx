// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
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
