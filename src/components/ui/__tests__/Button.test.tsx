// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/Button.tsx";

describe("Button", () => {
	it("renderiza correctamente con texto y estilos por defecto", () => {
		render(<Button>Click me</Button>);
		const btn = screen.getByRole("button", { name: /click me/iu });
		expect(btn).toBeDefined();
		expect(btn.getAttribute("type")).toBe("button");
	});

	it("aplica diferentes variantes y tamaños", () => {
		const { rerender } = render(
			<Button variant="destructive" size="lg">
				Eliminar
			</Button>,
		);
		let btn = screen.getByRole("button", { name: /eliminar/iu });
		expect(btn.className).toContain("bg-red-600");
		expect(btn.className).toContain("h-11");

		rerender(
			<Button variant="outline" size="sm">
				Borde
			</Button>,
		);
		btn = screen.getByRole("button", { name: /borde/iu });
		expect(btn.className).toContain("border-slate-200");
		expect(btn.className).toContain("h-7");

		rerender(
			<Button variant="secondary" size="icon">
				Icono
			</Button>,
		);
		btn = screen.getByRole("button", { name: /icono/iu });
		expect(btn.className).toContain("bg-slate-100");
		expect(btn.className).toContain("w-9");

		rerender(
			<Button variant="ghost" size="icon-sm">
				Fantasma
			</Button>,
		);
		btn = screen.getByRole("button", { name: /fantasma/iu });
		expect(btn.className).toContain("text-slate-600");
		expect(btn.className).toContain("w-7");

		rerender(<Button variant="link">Enlace</Button>);
		btn = screen.getByRole("button", { name: /enlace/iu });
		expect(btn.className).toContain("underline-offset-4");
	});

	it("muestra spinner de carga y deshabilita cuando isLoading es true", () => {
		render(<Button isLoading={true}>Guardando</Button>);
		const btn = screen.getByRole("button", { name: /guardando/iu });
		expect(btn.hasAttribute("disabled")).toBe(true);
		expect(btn.getAttribute("aria-busy")).toBe("true");
	});

	it("dispara evento onClick cuando no esta deshabilitado", () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Accion</Button>);
		const btn = screen.getByRole("button", { name: /accion/iu });
		fireEvent.click(btn);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
