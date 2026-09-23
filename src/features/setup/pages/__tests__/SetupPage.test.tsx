// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { login } from "@/features/auth/api/auth.api.ts";
import { crearAdmin } from "@/features/setup/api/setup.api.ts";
import { SetupPage } from "@/features/setup/pages/SetupPage.tsx";
import { CrearAdminPeticionSchema } from "@/features/setup/types/CrearAdminPeticion.ts";
import { EstadoSetupRespuestaSchema } from "@/features/setup/types/EstadoSetupRespuesta.ts";
import { useAppStore } from "@/store/useAppStore.ts";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("@/features/auth/api/auth.api", () => ({
	login: vi.fn(),
}));

vi.mock("@/features/setup/api/setup.api", () => ({
	crearAdmin: vi.fn(),
	verificarSetup: vi.fn(),
}));

describe("SetupPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("permite alternar visibilidad de las contraseñas", () => {
		const { container } = render(<SetupPage />);

		const passInput = screen.getByPlaceholderText("Crea tu contraseña") as HTMLInputElement;
		const confirmInput = screen.getByPlaceholderText("Confirma tu contraseña") as HTMLInputElement;

		expect(passInput.type).toBe("password");
		expect(confirmInput.type).toBe("password");

		const eyeButtons = container.querySelectorAll("button.cursor-pointer.text-primary\\/70");
		const eye0 = eyeButtons[0];
		const eye1 = eyeButtons[1];
		if (eye0 && eye1) {
			fireEvent.click(eye0);
			fireEvent.click(eye1);
		}

		expect(passInput.type).toBe("text");
		expect(confirmInput.type).toBe("text");
	});

	it("crea administrador exitosamente e inicia sesion redirigiendo a /", async () => {
		const mockSetConfigurado = vi.fn();
		const mockSetAutenticado = vi.fn();
		useAppStore.setState({
			setConfigurado: mockSetConfigurado,
			setAutenticado: mockSetAutenticado,
		});

		vi.mocked(crearAdmin).mockResolvedValueOnce(undefined);
		vi.mocked(login).mockResolvedValueOnce({ tokenAcceso: "setup-token" });

		const { container } = render(<SetupPage />);

		const emailInput = screen.getByPlaceholderText("admin@ulasalle.edu.pe");
		const passInput = screen.getByPlaceholderText("Crea tu contraseña");
		const confirmInput = screen.getByPlaceholderText("Confirma tu contraseña");

		await act(async () => {
			fireEvent.change(emailInput, {
				target: { value: "admin@ulasalle.edu.pe" },
			});
			fireEvent.change(passInput, {
				target: { value: "AdminPassword1" },
			});
			fireEvent.change(confirmInput, {
				target: { value: "AdminPassword1" },
			});
		});

		const form = container.querySelector("form");
		if (form) {
			await act(async () => {
				fireEvent.submit(form);
			});
		}

		await waitFor(() => {
			expect(crearAdmin).toHaveBeenCalledWith({
				email: "admin@ulasalle.edu.pe",
				password: "AdminPassword1",
			});
			expect(login).toHaveBeenCalledWith({
				email: "admin@ulasalle.edu.pe",
				password: "AdminPassword1",
			});
			expect(mockSetConfigurado).toHaveBeenCalledWith(true);
			expect(mockSetAutenticado).toHaveBeenCalledWith(true, "admin@ulasalle.edu.pe", "setup-token");
			expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
		});
	});

	it("redirige a /login cuando el sistema ya ha sido configurado previamente", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		const mockSetConfigurado = vi.fn();
		useAppStore.setState({ setConfigurado: mockSetConfigurado });

		vi.mocked(crearAdmin).mockRejectedValueOnce(new Error("El sistema ya ha sido configurado"));

		const { container } = render(<SetupPage />);

		const emailInput = screen.getByPlaceholderText("admin@ulasalle.edu.pe");
		const passInput = screen.getByPlaceholderText("Crea tu contraseña");
		const confirmInput = screen.getByPlaceholderText("Confirma tu contraseña");

		await act(async () => {
			fireEvent.change(emailInput, {
				target: { value: "admin@ulasalle.edu.pe" },
			});
			fireEvent.change(passInput, {
				target: { value: "AdminPassword1" },
			});
			fireEvent.change(confirmInput, {
				target: { value: "AdminPassword1" },
			});
		});

		const form = container.querySelector("form");
		if (form) {
			await act(async () => {
				fireEvent.submit(form);
			});
		}

		await waitFor(() => {
			expect(screen.getByText("El sistema ya ha sido configurado")).toBeDefined();
			expect(mockSetConfigurado).toHaveBeenCalledWith(true);
		});

		act(() => {
			vi.advanceTimersByTime(1600);
		});

		expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
		vi.useRealTimers();
	});

	it("muestra mensaje de error generico y permite cerrarlo", async () => {
		vi.mocked(crearAdmin).mockRejectedValueOnce("Error desconocido");

		const { container } = render(<SetupPage />);

		const emailInput = screen.getByPlaceholderText("admin@ulasalle.edu.pe");
		const passInput = screen.getByPlaceholderText("Crea tu contraseña");
		const confirmInput = screen.getByPlaceholderText("Confirma tu contraseña");

		await act(async () => {
			fireEvent.change(emailInput, {
				target: { value: "admin@ulasalle.edu.pe" },
			});
			fireEvent.change(passInput, {
				target: { value: "AdminPassword1" },
			});
			fireEvent.change(confirmInput, {
				target: { value: "AdminPassword1" },
			});
		});

		const formErr = container.querySelector("form");
		if (formErr) {
			await act(async () => {
				fireEvent.submit(formErr);
			});
		}

		await waitFor(() => {
			expect(screen.getByText("Error al crear la cuenta")).toBeDefined();
		});

		const closeAlertBtn = screen.getByRole("button", {
			name: "Cerrar notificación",
		});
		fireEvent.click(closeAlertBtn);
		expect(screen.queryByText("Error al crear la cuenta")).toBeNull();
	});

	it("valida schemas auxiliares de setup", () => {
		expect(CrearAdminPeticionSchema).toBeDefined();
		expect(EstadoSetupRespuestaSchema).toBeDefined();
	});
});
