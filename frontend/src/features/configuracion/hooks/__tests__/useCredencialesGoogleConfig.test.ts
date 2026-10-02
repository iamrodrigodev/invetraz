import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCredencialesGoogleConfig } from "@/features/configuracion/hooks/useCredencialesGoogleConfig.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

describe("useCredencialesGoogleConfig", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		useConfiguracionStore.getState().limpiar();
	});

	it("inicializa el formulario con valores del store", () => {
		useConfiguracionStore.setState({
			credenciales: {
				googleClientId: "client-123",
				googleClientSecret: "secret-123",
				googleRefreshToken: "token-123",
				googleDriveFolderId: null,
				googleDriveFolderName: null,
				googleVerificado: true,
				driveVerificado: true,
			},
		});

		const { result } = renderHook(() => useCredencialesGoogleConfig());
		expect(result.current.campos.clientId).toBe("client-123");
		expect(result.current.campos.clientSecret).toBe("secret-123");
		expect(result.current.campos.refreshToken).toBe("token-123");
	});

	it("detecta validaciones incompletas y muestra mensaje multiple o unico", async () => {
		const { result } = renderHook(() => useCredencialesGoogleConfig());

		await act(async () => {
			await result.current.probarConexion();
		});

		expect(result.current.mensajeErrorBanner).toBe(
			"Por favor, completa todos los campos requeridos antes de continuar.",
		);

		await act(async () => {
			result.current.form.setValue("googleClientId", "id");
			result.current.form.setValue("googleClientSecret", "sec");
			await result.current.form.trigger();
		});

		expect(result.current.mensajeErrorBanner).toBe("El Refresh Token es obligatorio");
	});

	it("prueba conexion exitosamente cuando los campos son validos", async () => {
		const spyVerificar = vi
			.spyOn(useConfiguracionStore.getState(), "verificarConexion")
			.mockResolvedValue({ valido: true, mensaje: "Conectado OK" });

		const { result } = renderHook(() => useCredencialesGoogleConfig());

		await act(async () => {
			result.current.form.setValue("googleClientId", "client-id");
			result.current.form.setValue("googleClientSecret", "client-secret");
			result.current.form.setValue("googleRefreshToken", "refresh-token");
			await result.current.form.trigger();
		});

		await act(async () => {
			await result.current.probarConexion();
		});

		expect(spyVerificar).toHaveBeenCalled();
		expect(result.current.conexion.mensajeExito).toBe("Conectado OK");
	});

	it("prueba conexion con mensaje por defecto si la respuesta de verificacion no trae mensaje", async () => {
		vi.spyOn(useConfiguracionStore.getState(), "verificarConexion").mockResolvedValue({
			valido: true,
			mensaje: "",
		});

		const { result } = renderHook(() => useCredencialesGoogleConfig());

		await act(async () => {
			result.current.form.setValue("googleClientId", "client-id");
			result.current.form.setValue("googleClientSecret", "client-secret");
			result.current.form.setValue("googleRefreshToken", "refresh-token");
			await result.current.form.trigger();
		});

		await act(async () => {
			await result.current.probarConexion();
		});

		expect(result.current.conexion.mensajeExito).toBe(
			"¡Conexión verificada exitosamente con Google Classroom!",
		);
	});

	it("guarda el formulario con exito cuando es valido", async () => {
		const spyGuardar = vi
			.spyOn(useConfiguracionStore.getState(), "guardarConfiguracion")
			.mockResolvedValue({ valido: true, mensaje: "Guardado OK" });

		const { result } = renderHook(() => useCredencialesGoogleConfig());

		await act(async () => {
			result.current.form.setValue("googleClientId", "client-id");
			result.current.form.setValue("googleClientSecret", "client-secret");
			result.current.form.setValue("googleRefreshToken", "refresh-token");
			await result.current.form.trigger();
		});

		await act(async () => {
			await result.current.guardarFormulario();
		});

		expect(spyGuardar).toHaveBeenCalled();
		expect(result.current.conexion.mensajeExito).toBe("Guardado OK");
	});

	it("guarda formulario con mensaje por defecto si res.mensaje no viene", async () => {
		vi.spyOn(useConfiguracionStore.getState(), "guardarConfiguracion").mockResolvedValue({
			valido: true,
			mensaje: "",
		});

		const { result } = renderHook(() => useCredencialesGoogleConfig());

		await act(async () => {
			result.current.form.setValue("googleClientId", "client-id");
			result.current.form.setValue("googleClientSecret", "client-secret");
			result.current.form.setValue("googleRefreshToken", "refresh-token");
			await result.current.form.trigger();
		});

		await act(async () => {
			await result.current.guardarFormulario();
		});

		expect(result.current.conexion.mensajeExito).toBe(
			"Credenciales verificadas con Google y guardadas exitosamente.",
		);
	});

	it("marca tocado al intentar guardar con campos invalidos", async () => {
		const { result } = renderHook(() => useCredencialesGoogleConfig());

		await act(async () => {
			await result.current.guardarFormulario();
		});

		expect(result.current.mensajeErrorBanner).toBeTruthy();
	});

	it("limpia error al llamar a limpiarError", () => {
		const { result } = renderHook(() => useCredencialesGoogleConfig());

		act(() => {
			result.current.limpiarError();
		});
		expect(result.current.mensajeErrorBanner).toBeNull();

		act(() => {
			result.current.conexion.setMensajeError("Fallo");
		});
		expect(result.current.mensajeErrorBanner).toBe("Fallo");

		act(() => {
			result.current.limpiarError();
		});
		expect(result.current.mensajeErrorBanner).toBeNull();
	});
});
