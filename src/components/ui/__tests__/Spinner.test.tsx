// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "@/components/ui/Spinner.tsx";

describe("Spinner", () => {
	it("renderiza spinner basico con role status", () => {
		render(<Spinner />);
		const spinner = screen.getByRole("status");
		expect(spinner).toBeDefined();
		expect(spinner.getAttribute("aria-label")).toBe("Cargando...");
	});

	it("aplica diferentes tamaños y colores", () => {
		const { rerender } = render(<Spinner size="sm" color="white" />);
		let spinner = screen.getByRole("status");
		expect(spinner.className).toContain("h-4");
		expect(spinner.className).toContain("border-white");

		rerender(<Spinner size="lg" color="slate" />);
		spinner = screen.getByRole("status");
		expect(spinner.className).toContain("h-10");
		expect(spinner.className).toContain("border-slate-400");

		rerender(<Spinner size="xl" color="primary" />);
		spinner = screen.getByRole("status");
		expect(spinner.className).toContain("h-14");
		expect(spinner.className).toContain("border-primary");
	});

	it("muestra mensaje descriptivo y contenedor completo", () => {
		render(<Spinner mensaje="Cargando datos del sistema..." fullContainer={true} />);
		expect(screen.getByText("Cargando datos del sistema...")).toBeDefined();
		expect(screen.getByRole("status").getAttribute("aria-label")).toBe(
			"Cargando datos del sistema...",
		);
	});
});
