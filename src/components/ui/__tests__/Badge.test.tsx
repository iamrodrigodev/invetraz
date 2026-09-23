// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/Badge.tsx";

describe("Badge", () => {
	it("renderiza correctamente con texto y estilos por defecto", () => {
		render(<Badge>Activo</Badge>);
		const badge = screen.getByText("Activo");
		expect(badge).toBeDefined();
		expect(badge.className).toContain("bg-primary-50");
	});

	it("aplica estilos segun la variante especificada", () => {
		const { rerender } = render(<Badge variant="success">Exito</Badge>);
		let badge = screen.getByText("Exito");
		expect(badge.className).toContain("bg-emerald-50");

		rerender(<Badge variant="warning">Alerta</Badge>);
		badge = screen.getByText("Alerta");
		expect(badge.className).toContain("bg-amber-50");

		rerender(<Badge variant="destructive">Peligro</Badge>);
		badge = screen.getByText("Peligro");
		expect(badge.className).toContain("bg-red-50");

		rerender(<Badge variant="slate">Neutro</Badge>);
		badge = screen.getByText("Neutro");
		expect(badge.className).toContain("bg-slate-100");

		rerender(<Badge variant="blue">Azul</Badge>);
		badge = screen.getByText("Azul");
		expect(badge.className).toContain("bg-primary text-white");
	});
});
