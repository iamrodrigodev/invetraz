// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { render, screen } from "@testing-library/react";
import { Wrench } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ModuloEnConstruccion } from "@/components/ui/ModuloEnConstruccion.tsx";

describe("ModuloEnConstruccion", () => {
	it("renderiza titulo y descripcion por defecto", () => {
		render(<ModuloEnConstruccion titulo="Módulo de Reportes" />);
		expect(screen.getByText("Módulo de Reportes")).toBeDefined();
		expect(screen.getByText(/estamos trabajando arduamente/iu)).toBeDefined();
	});

	it("renderiza con descripcion e icono personalizados", () => {
		render(
			<ModuloEnConstruccion
				titulo="Módulo Custom"
				descripcion="Pronto estará disponible"
				icono={Wrench}
			/>,
		);
		expect(screen.getByText("Módulo Custom")).toBeDefined();
		expect(screen.getByText("Pronto estará disponible")).toBeDefined();
	});
});
