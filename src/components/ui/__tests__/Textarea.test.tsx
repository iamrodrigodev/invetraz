// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "@/components/ui/Textarea.tsx";

describe("Textarea component", () => {
	it("renderiza con placeholder y contador de caracteres en modo controlado", () => {
		const { rerender } = render(
			<Textarea
				placeholder="Escribe aquí"
				maxLength={100}
				showCount={true}
				value="Hola"
				readOnly={true}
			/>,
		);

		expect(screen.getByPlaceholderText("Escribe aquí")).toBeDefined();
		expect(screen.getByText("4 / 100")).toBeDefined();

		rerender(
			<Textarea
				placeholder="Escribe aquí"
				maxLength={100}
				showCount={true}
				value="Hola Mundo"
				readOnly={true}
			/>,
		);
		expect(screen.getByText("10 / 100")).toBeDefined();
	});

	it("inicializa el contador con defaultValue y actualiza al escribir", () => {
		const manejarCambio = vi.fn();
		render(
			<Textarea
				defaultValue="Texto inicial"
				showCount={true}
				maxLength={50}
				onChange={manejarCambio}
			/>,
		);

		expect(screen.getByText("13 / 50")).toBeDefined();

		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "Nuevo" } });

		expect(manejarCambio).toHaveBeenCalled();
		expect(screen.getByText("5 / 50")).toBeDefined();
	});

	it("usa charCount explícito si se le provee", () => {
		render(
			<Textarea
				showCount={true}
				maxLength={100}
				charCount={42}
				value="Otro texto"
				readOnly={true}
			/>,
		);

		expect(screen.getByText("42 / 100")).toBeDefined();
	});

	it("maneja cambio sin showCount ni maxLength", () => {
		const manejarCambio = vi.fn();
		render(<Textarea onChange={manejarCambio} />);

		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "Prueba" } });

		expect(manejarCambio).toHaveBeenCalled();
	});

	it("muestra mensaje de error y estilo de error", () => {
		const { rerender } = render(<Textarea error={true} id="custom-textarea" />);
		const textarea = screen.getByRole("textbox");
		expect(textarea.getAttribute("aria-invalid")).toBe("true");
		expect(textarea.getAttribute("id")).toBe("custom-textarea");

		rerender(
			<Textarea
				errorMessage="Texto inválido"
				showCount={true}
				maxLength={100}
				value=""
				readOnly={true}
			/>,
		);

		expect(screen.getByText("Texto inválido")).toBeDefined();
		expect(screen.getByRole("alert")).toBeDefined();
		expect(screen.getByText("0 / 100")).toBeDefined();
	});

	it("soporta ref forwarding", () => {
		const ref = createRef<HTMLTextAreaElement>();
		render(<Textarea ref={ref} />);

		expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
	});

	it("soporta escribir sin callback onChange proporcionado", () => {
		render(<Textarea showCount={true} maxLength={20} />);
		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "SinHandler" } });
		expect(screen.getByText("10 / 20")).toBeDefined();
	});
});
