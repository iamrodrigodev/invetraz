// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
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
