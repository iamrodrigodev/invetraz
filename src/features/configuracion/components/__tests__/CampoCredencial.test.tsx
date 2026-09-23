// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { CampoCredencial } from "@/features/configuracion/components/CampoCredencial.tsx";

describe("CampoCredencial", () => {
	it("renderiza label, asterisco de obligatorio y descripcion", () => {
		render(
			<CampoCredencial
				id="campo-test"
				label="Mi Credencial"
				descripcion="Texto de ayuda"
				obligatorio={true}
			/>,
		);

		expect(screen.getByText("Mi Credencial")).toBeDefined();
		expect(screen.getByText("*")).toBeDefined();
		expect(screen.getByText("Texto de ayuda")).toBeDefined();
	});

	it("no renderiza asterisco cuando obligatorio es false", () => {
		render(
			<CampoCredencial id="campo-test-opcional" label="Credencial Opcional" obligatorio={false} />,
		);

		expect(screen.getByText("Credencial Opcional")).toBeDefined();
		expect(screen.queryByText("*")).toBeNull();
	});

	it("permite alternar visibilidad cuando esSensible es true", () => {
		render(<CampoCredencial id="campo-sensible" label="Clave Secreta" esSensible={true} />);

		const input = screen.getByLabelText(/Clave Secreta/u) as HTMLInputElement;
		expect(input.type).toBe("password");

		const toggleBtn = screen.getByRole("button", { name: "Mostrar contenido" });
		fireEvent.click(toggleBtn);
		expect(input.type).toBe("text");
		expect(screen.getByRole("button", { name: "Ocultar contenido" })).toBeDefined();

		fireEvent.click(screen.getByRole("button", { name: "Ocultar contenido" }));
		expect(input.type).toBe("password");
		expect(screen.getByRole("button", { name: "Mostrar contenido" })).toBeDefined();
	});

	it("no renderiza boton de alternar cuando esSensible es false y reenvia ref y errorMessage", () => {
		const inputRef = createRef<HTMLInputElement>();
		render(
			<CampoCredencial
				ref={inputRef}
				id="campo-normal"
				label="Identificador"
				esSensible={false}
				errorMessage="Formato incorrecto"
			/>,
		);

		expect(screen.queryByRole("button")).toBeNull();
		expect(screen.getByText("Formato incorrecto")).toBeDefined();
		expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
	});
});
