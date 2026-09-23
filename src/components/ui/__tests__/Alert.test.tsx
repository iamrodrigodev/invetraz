// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "@/components/ui/Alert.tsx";

describe("Alert", () => {
	it("renderiza correctamente el mensaje y variante error por defecto", () => {
		render(<Alert message="Ocurrió un error inesperado" />);
		const alerta = screen.getByRole("alert");
		expect(alerta).toBeDefined();
		expect(alerta.className).toContain("bg-red-50");
		expect(screen.getByText("Ocurrió un error inesperado")).toBeDefined();
	});

	it("aplica estilos segun las diferentes variantes", () => {
		const { rerender } = render(<Alert message="Operación exitosa" variant="success" />);
		let alerta = screen.getByRole("alert");
		expect(alerta.className).toContain("bg-emerald-50");

		rerender(<Alert message="Advertencia" variant="warning" />);
		alerta = screen.getByRole("alert");
		expect(alerta.className).toContain("bg-amber-50");

		rerender(<Alert message="Información general" variant="info" />);
		alerta = screen.getByRole("alert");
		expect(alerta.className).toContain("bg-blue-50");
	});

	it("muestra boton de cierre y ejecuta onClose al hacer clic", () => {
		const handleClose = vi.fn();
		render(<Alert message="Alerta descartable" variant="warning" onClose={handleClose} />);

		const closeBtn = screen.getByRole("button", {
			name: /cerrar notificación/iu,
		});
		expect(closeBtn).toBeDefined();
		fireEvent.click(closeBtn);
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
