// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useClickOutside } from "@/hooks/useClickOutside.ts";

describe("useClickOutside", () => {
	it("no ejecuta nada si enabled es false", () => {
		const handler = vi.fn();
		const elemento = document.createElement("div");
		document.body.appendChild(elemento);

		renderHook(() => useClickOutside({ current: elemento }, handler, false));

		document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

		expect(handler).not.toHaveBeenCalled();
		elemento.remove();
	});

	it("no ejecuta handler si se hace click dentro del elemento", () => {
		const handler = vi.fn();
		const elemento = document.createElement("div");
		const hijo = document.createElement("span");
		elemento.appendChild(hijo);
		document.body.appendChild(elemento);

		renderHook(() => useClickOutside({ current: elemento }, handler));

		hijo.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		expect(handler).not.toHaveBeenCalled();
		elemento.remove();
	});

	it("ejecuta handler al hacer mousedown o touchstart fuera del elemento", () => {
		const handler = vi.fn();
		const elemento = document.createElement("div");
		const elementoFuera = document.createElement("button");
		document.body.appendChild(elemento);
		document.body.appendChild(elementoFuera);

		renderHook(() => useClickOutside({ current: elemento }, handler));

		elementoFuera.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);

		elementoFuera.dispatchEvent(new TouchEvent("touchstart", { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(2);

		elemento.remove();
		elementoFuera.remove();
	});

	it("no ejecuta si target no es un Node", () => {
		const handler = vi.fn();
		const elemento = document.createElement("div");
		renderHook(() => useClickOutside({ current: elemento }, handler));

		const evento = new MouseEvent("mousedown");
		Object.defineProperty(evento, "target", { value: {} });
		document.dispatchEvent(evento);

		expect(handler).not.toHaveBeenCalled();
	});

	it("no ejecuta si ref.current es null", () => {
		const handler = vi.fn();
		renderHook(() => useClickOutside({ current: null }, handler));

		document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		expect(handler).not.toHaveBeenCalled();
	});

	it("ejecuta handler al presionar Escape pero no con otras teclas", () => {
		const handler = vi.fn();
		const elemento = document.createElement("div");
		renderHook(() => useClickOutside({ current: elemento }, handler));

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
		expect(handler).not.toHaveBeenCalled();

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it("remueve los event listeners al desmontar el hook", () => {
		const handler = vi.fn();
		const elemento = document.createElement("div");
		const { unmount } = renderHook(() => useClickOutside({ current: elemento }, handler));

		unmount();

		document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

		expect(handler).not.toHaveBeenCalled();
	});
});
