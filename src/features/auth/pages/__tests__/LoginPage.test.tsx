// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { login } from "@/features/auth/api/auth.api.ts";
import { LoginPage } from "@/features/auth/pages/LoginPage.tsx";
import { LoginPeticionSchema } from "@/features/auth/types/LoginPeticion.ts";
import { LoginRespuestaSchema } from "@/features/auth/types/LoginRespuesta.ts";
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

describe("LoginPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		sessionStorage.clear();
	});

	it("elimina motivo_salida de sessionStorage al montar", () => {
		sessionStorage.setItem("motivo_salida", "sesion_expirada");
		render(<LoginPage />);
		expect(sessionStorage.getItem("motivo_salida")).toBeNull();
	});

	it("permite alternar visibilidad de la contraseña", () => {
		const { container } = render(<LoginPage />);

		const passInput = screen.getByPlaceholderText("Ingresa tu contraseña") as HTMLInputElement;
		expect(passInput.type).toBe("password");

		const toggleBtn = container.querySelector("button.cursor-pointer.text-primary\\/70")!;
		fireEvent.click(toggleBtn);
		expect(passInput.type).toBe("text");

		fireEvent.click(toggleBtn);
		expect(passInput.type).toBe("password");
	});

	it("inicia sesion exitosamente y redirige a /actividades", async () => {
		const mockSetAutenticado = vi.fn();
		useAppStore.setState({ setAutenticado: mockSetAutenticado });
		vi.mocked(login).mockResolvedValueOnce({
			tokenAcceso: "fake-jwt-token",
		});

		const { container } = render(<LoginPage />);

		const emailInput = screen.getByPlaceholderText("admin@ulasalle.edu.pe");
		const passInput = screen.getByPlaceholderText("Ingresa tu contraseña");

		await act(async () => {
			fireEvent.change(emailInput, {
				target: { value: "admin@ulasalle.edu.pe" },
			});
			fireEvent.change(passInput, {
				target: { value: "password123" },
			});
		});

		const form = container.querySelector("form")!;
		await act(async () => {
			fireEvent.submit(form);
		});

		await waitFor(() => {
			expect(login).toHaveBeenCalledWith({
				email: "admin@ulasalle.edu.pe",
				password: "password123",
			});
			expect(mockSetAutenticado).toHaveBeenCalledWith(
				true,
				"admin@ulasalle.edu.pe",
				"fake-jwt-token",
			);
			expect(mockNavigate).toHaveBeenCalledWith("/actividades", {
				replace: true,
			});
		});
	});

	it("muestra mensaje de error cuando la API rechaza las credenciales y permite cerrarlo", async () => {
		vi.mocked(login).mockRejectedValueOnce(new Error("Usuario no encontrado"));

		const { container } = render(<LoginPage />);

		const emailInput = screen.getByPlaceholderText("admin@ulasalle.edu.pe");
		const passInput = screen.getByPlaceholderText("Ingresa tu contraseña");

		await act(async () => {
			fireEvent.change(emailInput, {
				target: { value: "error@ulasalle.edu.pe" },
			});
			fireEvent.change(passInput, {
				target: { value: "pass12345" },
			});
		});

		const form = container.querySelector("form")!;
		await act(async () => {
			fireEvent.submit(form);
		});

		await waitFor(() => {
			expect(screen.getByText("Usuario no encontrado")).toBeDefined();
		});

		const closeAlertBtn = screen.getByRole("button", {
			name: "Cerrar notificación",
		});
		fireEvent.click(closeAlertBtn);
		expect(screen.queryByText("Usuario no encontrado")).toBeNull();
	});

	it("muestra mensaje por defecto si el error no es instancia de Error", async () => {
		vi.mocked(login).mockRejectedValueOnce("Error desconocido");

		const { container } = render(<LoginPage />);

		const emailInput = screen.getByPlaceholderText("admin@ulasalle.edu.pe");
		const passInput = screen.getByPlaceholderText("Ingresa tu contraseña");

		await act(async () => {
			fireEvent.change(emailInput, {
				target: { value: "fallo@ulasalle.edu.pe" },
			});
			fireEvent.change(passInput, {
				target: { value: "pass12345" },
			});
		});

		const form = container.querySelector("form")!;
		await act(async () => {
			fireEvent.submit(form);
		});

		await waitFor(() => {
			expect(screen.getByText("Credenciales inválidas")).toBeDefined();
		});
	});

	it("valida schemas auxiliares de auth", () => {
		expect(LoginPeticionSchema).toBeDefined();
		expect(LoginRespuestaSchema).toBeDefined();
	});
});
