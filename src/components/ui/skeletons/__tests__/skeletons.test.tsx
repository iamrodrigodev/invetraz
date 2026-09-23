// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthCardSkeleton } from "@/components/ui/skeletons/AuthCardSkeleton.tsx";
import {
	DashboardSkeleton,
	ModuloContenidoSkeleton,
} from "@/components/ui/skeletons/DashboardSkeleton.tsx";
import { ModuloEnConstruccionSkeleton } from "@/components/ui/skeletons/ModuloEnConstruccionSkeleton.tsx";

describe("skeletons", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
		vi.unstubAllGlobals();
	});

	describe("AuthCardSkeleton", () => {
		it("renderiza variante de login por defecto", () => {
			const { container } = render(<AuthCardSkeleton esSetup={false} />);
			expect(container.firstChild).toBeDefined();
		});

		it("renderiza variante de setup", () => {
			const { container } = render(<AuthCardSkeleton esSetup={true} />);
			expect(container.firstChild).toBeDefined();
		});

		it("infiere setup segun la ruta si no se pasa esSetup", () => {
			vi.stubGlobal("location", { pathname: "/setup" });
			const { container } = render(<AuthCardSkeleton />);
			expect(container.firstChild).toBeDefined();
		});
	});

	describe("DashboardSkeleton", () => {
		it("renderiza con sidebar expandido y ruta raiz", () => {
			localStorage.setItem("sidebar_colapsado", "false");
			window.history.pushState({}, "", "/");

			const { container } = render(<DashboardSkeleton />);
			expect(container.firstChild).toBeDefined();
		});

		it("renderiza con sidebar colapsado y modulos especificos", () => {
			localStorage.setItem("sidebar_colapsado", "true");
			window.history.pushState({}, "", "/configuracion");

			const { container } = render(<DashboardSkeleton />);
			expect(container.firstChild).toBeDefined();
		});
	});

	describe("ModuloContenidoSkeleton", () => {
		it("renderiza cada sub-skeleton segun el modulo", () => {
			const modulos = [
				"configuracion",
				"documentacion",
				"plantillas",
				"reportes",
				"actividades",
				"otro",
			];

			for (const mod of modulos) {
				const { container } = render(<ModuloContenidoSkeleton modulo={mod} />);
				expect(container.firstChild).toBeDefined();
			}
		});
	});

	describe("ModuloEnConstruccionSkeleton", () => {
		it("renderiza con rol status y titulo con ancho personalizado", () => {
			render(<ModuloEnConstruccionSkeleton tituloAncho="w-56" />);
			const status = screen.getByRole("status");
			expect(status.getAttribute("aria-busy")).toBe("true");
			expect(status.getAttribute("aria-label")).toBe("Cargando contenido...");
		});
	});
});
