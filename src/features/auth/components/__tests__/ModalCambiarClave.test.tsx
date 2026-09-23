// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cambiarPassword, verificarPasswordActual } from "@/features/auth/api/auth.api.ts";
import { ModalCambiarClave } from "@/features/auth/components/ModalCambiarClave.tsx";

vi.mock("@/features/auth/api/auth.api", () => ({
	verificarPasswordActual: vi.fn(),
	cambiarPassword: vi.fn(),
}));

vi.mock("framer-motion", () => ({
	AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
	motion: {
		div: ({
			children,
			ref,
			...props
		}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
			<div ref={ref} {...props}>
				{children}
			</div>
		),
	},
}));

describe("ModalCambiarClave", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("no renderiza nada cuando abierto es false", () => {
		render(<ModalCambiarClave abierto={false} alCerrar={vi.fn()} />);
		expect(screen.queryByText("Cambiar contraseña")).toBeNull();
	});

	it("renderiza paso 1, permite alternar visibilidad de contraseña y cancelar", () => {
		const alCerrar = vi.fn();
		render(<ModalCambiarClave abierto={true} alCerrar={alCerrar} />);

		expect(screen.getByText("Cambiar contraseña")).toBeDefined();
		const inputClave = screen.getByPlaceholderText(
			"Ingresa tu contraseña actual",
		) as HTMLInputElement;
		expect(inputClave.type).toBe("password");

		const toggleBtn = screen.getByRole("button", { name: "Ver contraseña" });
		fireEvent.click(toggleBtn);
		expect(inputClave.type).toBe("text");

		const cancelBtn = screen.getByRole("button", { name: "Cancelar" });
		fireEvent.click(cancelBtn);
		expect(alCerrar).toHaveBeenCalledTimes(1);
	});

	it("muestra error en paso 1 si la contraseña actual es rechazada y permite cerrarlo", async () => {
		vi.mocked(verificarPasswordActual).mockRejectedValueOnce(new Error("Contraseña incorrecta"));

		render(<ModalCambiarClave abierto={true} alCerrar={vi.fn()} />);

		const inputClave = screen.getByPlaceholderText("Ingresa tu contraseña actual");
		await act(async () => {
			fireEvent.change(inputClave, { target: { value: "MiClave123" } });
		});

		const form = document.querySelector("form")!;
		await act(async () => {
			fireEvent.submit(form);
		});

		await waitFor(() => {
			expect(screen.getByText("Contraseña incorrecta")).toBeDefined();
		});

		const closeAlertBtn = screen.getByRole("button", {
			name: "Cerrar notificación",
		});
		fireEvent.click(closeAlertBtn);
		expect(screen.queryByText("Contraseña incorrecta")).toBeNull();
	});

	it("avanza a paso 2 tras verificar contraseña, permite volver atras y actualizar exitosamente", async () => {
		vi.mocked(verificarPasswordActual).mockResolvedValue(undefined);
		vi.mocked(cambiarPassword).mockResolvedValue(undefined);
		const alCerrar = vi.fn();

		render(<ModalCambiarClave abierto={true} alCerrar={alCerrar} />);

		const inputClave1 = screen.getByPlaceholderText("Ingresa tu contraseña actual");
		await act(async () => {
			fireEvent.change(inputClave1, { target: { value: "ActualClave1" } });
		});

		const formPaso1 = document.querySelector("form");
		if (formPaso1) {
			await act(async () => {
				fireEvent.submit(formPaso1);
			});
		}

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Crea tu nueva contraseña")).toBeDefined();
		});

		const btnAtras = screen.getByRole("button", { name: "Atrás" });
		fireEvent.click(btnAtras);

		expect(screen.getByPlaceholderText("Ingresa tu contraseña actual")).toBeDefined();

		const formPaso2 = document.querySelector("form");
		if (formPaso2) {
			await act(async () => {
				fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña actual"), {
					target: { value: "ActualClave1" },
				});
				fireEvent.submit(formPaso2);
			});
		}

		await waitFor(() => {
			expect(screen.getByPlaceholderText("Crea tu nueva contraseña")).toBeDefined();
		});

		const inputNueva = screen.getByPlaceholderText("Crea tu nueva contraseña");
		const inputConfirmar = screen.getByPlaceholderText("Confirma la nueva contraseña");

		const toggleBtns = screen.getAllByRole("button", {
			name: "Ver contraseña",
		});
		const toggle0 = toggleBtns[0];
		const toggle1 = toggleBtns[1];
		if (toggle0 && toggle1) {
			fireEvent.click(toggle0);
			fireEvent.click(toggle1);
		}

		await act(async () => {
			fireEvent.change(inputNueva, { target: { value: "NuevaClave123" } });
			fireEvent.change(inputConfirmar, { target: { value: "NuevaClave123" } });
		});

		const formPaso3 = document.querySelector("form");
		if (formPaso3) {
			await act(async () => {
				fireEvent.submit(formPaso3);
			});
		}

		await waitFor(() => {
			expect(screen.getByText("Contraseña actualizada")).toBeDefined();
		});

		await act(async () => {
			await new Promise((r) => setTimeout(r, 2200));
		});
		expect(alCerrar).toHaveBeenCalled();
	});
});
