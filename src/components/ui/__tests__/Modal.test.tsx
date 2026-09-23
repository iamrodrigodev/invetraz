// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "@/components/ui/Modal.tsx";

describe("Modal", () => {
	it("no renderiza nada cuando abierto es false", () => {
		render(
			<Modal abierto={false} alCerrar={vi.fn()} titulo="Mi Modal">
				<p>Contenido oculto</p>
			</Modal>,
		);
		expect(screen.queryByText("Contenido oculto")).toBeNull();
	});

	it("renderiza titulo, contenido y boton cerrar cuando abierto es true", () => {
		const handleCerrar = vi.fn();
		render(
			<Modal abierto={true} alCerrar={handleCerrar} titulo="Mi Modal">
				<p>Contenido visible</p>
			</Modal>,
		);

		expect(screen.getByText("Mi Modal")).toBeDefined();
		expect(screen.getByText("Contenido visible")).toBeDefined();

		const closeBtn = screen.getByRole("button", { name: /cerrar/iu });
		fireEvent.click(closeBtn);
		expect(handleCerrar).toHaveBeenCalledTimes(1);
	});

	it("cierra al presionar Escape", () => {
		const handleCerrar = vi.fn();
		render(
			<Modal abierto={true} alCerrar={handleCerrar} titulo="Escape Modal">
				<button type="button">Foco</button>
			</Modal>,
		);

		document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		expect(handleCerrar).toHaveBeenCalledTimes(1);
	});

	it("atrapa el foco con tabulacion ciclica", () => {
		const handleCerrar = vi.fn();
		render(
			<Modal abierto={true} alCerrar={handleCerrar}>
				<button type="button">Primero</button>
				<button type="button">Ultimo</button>
			</Modal>,
		);

		const primero = screen.getByRole("button", { name: /primero/iu });
		const ultimo = screen.getByRole("button", { name: /ultimo/iu });

		primero.focus();
		document.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "Tab",
				shiftKey: true,
				cancelable: true,
			}),
		);
		expect(document.activeElement).toBe(ultimo);

		ultimo.focus();
		document.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "Tab",
				shiftKey: false,
				cancelable: true,
			}),
		);
		expect(document.activeElement).toBe(primero);
	});

	it("previene tabulacion cuando no hay elementos enfocables", () => {
		render(
			<Modal abierto={true} alCerrar={vi.fn()}>
				<div>Sin elementos interactivos</div>
			</Modal>,
		);

		const eventoTab = new KeyboardEvent("keydown", {
			key: "Tab",
			cancelable: true,
		});
		document.dispatchEvent(eventoTab);
		expect(eventoTab.defaultPrevented).toBe(true);
	});

	it("restaura el overflow del body al cerrar", () => {
		const { rerender } = render(
			<Modal abierto={true} alCerrar={vi.fn()}>
				<p>Modal</p>
			</Modal>,
		);
		expect(document.body.style.overflow).toBe("hidden");

		rerender(
			<Modal abierto={false} alCerrar={vi.fn()}>
				<p>Modal</p>
			</Modal>,
		);
		expect(document.body.style.overflow).toBe("");
	});
});
