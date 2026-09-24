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
	precalentarConexion: vi.fn(),
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
