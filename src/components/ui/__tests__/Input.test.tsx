// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "@/components/ui/Input.tsx";

describe("Input", () => {
	it("renderiza el input correctamente con sus atributos", () => {
		render(<Input placeholder="Ingresa texto" />);
		const input = screen.getByPlaceholderText("Ingresa texto");
		expect(input).toBeDefined();
		expect(input.getAttribute("type")).toBe("text");
	});

	it("muestra mensaje de error y aria-invalid cuando hay error", () => {
		render(<Input placeholder="Email" error={true} errorMessage="El campo es obligatorio" />);
		const input = screen.getByPlaceholderText("Email");
		expect(input.getAttribute("aria-invalid")).toBe("true");
		expect(screen.getByRole("alert").textContent).toContain("El campo es obligatorio");
	});

	it("renderiza rightElement en la posicion derecha", () => {
		render(<Input placeholder="Contraseña" rightElement={<button type="button">Ver</button>} />);
		expect(screen.getByRole("button", { name: /ver/iu })).toBeDefined();
	});

	it("muestra conteo de caracteres si showCount y maxLength estan activados", () => {
		const { rerender } = render(
			<Input placeholder="Texto" showCount={true} maxLength={50} defaultValue="Hola" />,
		);
		expect(screen.getByText("4 / 50")).toBeDefined();

		const input = screen.getByPlaceholderText("Texto") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "Hola Mundo" } });
		expect(screen.getByText("10 / 50")).toBeDefined();

		rerender(
			<Input
				placeholder="Texto"
				showCount={true}
				maxLength={50}
				value="Controlado"
				charCount={10}
				onChange={() => {}}
			/>,
		);
		expect(screen.getByText("10 / 50")).toBeDefined();

		rerender(
			<Input
				placeholder="Texto"
				showCount={true}
				maxLength={50}
				value="Cadena"
				onChange={() => {}}
			/>,
		);
		expect(screen.getByText("6 / 50")).toBeDefined();
	});

	it("llama al callback onChange al escribir", () => {
		const handleChange = vi.fn();
		render(<Input placeholder="Nombre" onChange={handleChange} />);
		const input = screen.getByPlaceholderText("Nombre");
		fireEvent.change(input, { target: { value: "A" } });
		expect(handleChange).toHaveBeenCalled();
	});
});
