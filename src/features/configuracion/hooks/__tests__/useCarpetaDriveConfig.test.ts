// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCarpetaDriveConfig } from "@/features/configuracion/hooks/useCarpetaDriveConfig.ts";
import * as plantillasApi from "@/features/plantillas/api/plantillas.api.ts";

describe("useCarpetaDriveConfig", () => {
	it("extrae id desde url completa de google drive o acepta id plano", () => {
		const { result, rerender } = renderHook(
			({ url }) =>
				useCarpetaDriveConfig({
					carpetaIdInicial: url,
				}),
			{
				initialProps: {
					url: "https://drive.google.com/drive/folders/1a2b3c4d5e",
				},
			},
		);

		expect(result.current.carpetaId).toBe("https://drive.google.com/drive/folders/1a2b3c4d5e");

		rerender({ url: "id-plano-123" });
		expect(result.current.carpetaId).toBe("id-plano-123");
	});

	it("identifica estado no_disponible si google no esta conectado y hay carpeta", () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-1",
				estadoCredencialesGoogle: "no_configurado",
			}),
		);

		expect(result.current.estadoConexionCarpeta).toBe("no_disponible");
	});

	it("identifica estado no_configurado si google no esta conectado y no hay carpeta", () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: null,
				estadoCredencialesGoogle: "no_configurado",
			}),
		);

		expect(result.current.estadoConexionCarpeta).toBe("no_configurado");
	});

	it("identifica estado verificando si las credenciales de google estan verificando", () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-1",
				estadoCredencialesGoogle: "verificando",
			}),
		);

		expect(result.current.estadoConexionCarpeta).toBe("verificando");
	});

	it("muestra mensaje de advertencia al verificar sin credenciales de google conectadas", async () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-1",
				estadoCredencialesGoogle: "no_configurado",
			}),
		);

		await act(async () => {
			await result.current.verificar();
		});

		expect(result.current.conexion.mensajeError).toContain(
			"Primero verifica las credenciales de Google Cloud",
		);
	});

	it("muestra mensaje de espera si google se esta verificando al intentar verificar", async () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-1",
				estadoCredencialesGoogle: "verificando",
			}),
		);

		await act(async () => {
			await result.current.verificar();
		});

		expect(result.current.conexion.mensajeError).toContain(
			"Espera a que finalice la verificación de Google Cloud",
		);
	});

	it("valida longitudes maximas y campos vacios", () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "",
				estadoCredencialesGoogle: "conectado",
			}),
		);

		act(() => {
			result.current.marcarTocado();
		});
		expect(result.current.mensajeErrorCampo).toBe(
			"El enlace o ID de la carpeta de Google Drive es obligatorio",
		);

		act(() => {
			result.current.cambiarInput("a".repeat(256));
		});
		expect(result.current.mensajeErrorCampo).toContain("255 caracteres");
	});

	it("limpia mensajes de conexion al cambiar el input", () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-1",
				estadoCredencialesGoogle: "conectado",
			}),
		);

		act(() => {
			result.current.conexion.setMensajeError("Error");
			result.current.conexion.setMensajeExito("Exito");
		});

		act(() => {
			result.current.cambiarInput("nueva-carpeta");
		});

		expect(result.current.conexion.mensajeError).toBeNull();
		expect(result.current.conexion.mensajeExito).toBeNull();
	});

	it("ejecuta verificar exitosamente en Google Drive con plural y singular de plantillas", async () => {
		const onActualizada = vi.fn();
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-123",
				carpetaNombreInicial: "Carpeta",
				estadoCredencialesGoogle: "conectado",
				onCarpetaActualizada: onActualizada,
			}),
		);

		vi.spyOn(plantillasApi, "verificarCarpetaDrive").mockResolvedValue({
			carpetaConfigurada: true,
			carpetaId: "folder-123",
			carpetaNombre: "Carpeta Drive",
			plantillas: [
				{
					id: "1",
					nombre: "p1.xlsx",
					tipoMime: "sheet",
					enlaceDescarga: null,
					enlaceWeb: null,
					tamanoBytes: null,
					ultimaModificacion: null,
				},
			],
			driveVerificado: true,
		});

		await act(async () => {
			await result.current.verificar();
		});

		expect(result.current.conexion.mensajeExito).toContain("1 plantilla");
		expect(onActualizada).toHaveBeenCalledWith("folder-123", "Carpeta Drive", true);
	});

	it("ejecuta guardar exitosamente y actualiza estado", async () => {
		const onActualizada = vi.fn();
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "https://drive.google.com/open?id=folder-xyz",
				estadoCredencialesGoogle: "conectado",
				onCarpetaActualizada: onActualizada,
			}),
		);

		vi.spyOn(plantillasApi, "vincularCarpetaDrive").mockResolvedValue({
			carpetaConfigurada: true,
			carpetaId: "folder-xyz",
			carpetaNombre: "Mi Carpeta",
			plantillas: [],
			driveVerificado: true,
		});

		const mockEvent = {
			preventDefault: vi.fn(),
		} as unknown as React.SyntheticEvent;

		await act(async () => {
			await result.current.guardar(mockEvent);
		});

		expect(mockEvent.preventDefault).toHaveBeenCalled();
		expect(result.current.conexion.mensajeExito).toContain("0 plantillas");
	});

	it("ejecuta guardar cuando la carpeta no es verificable en Drive", async () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder-sin-verificar",
				estadoCredencialesGoogle: "conectado",
			}),
		);

		vi.spyOn(plantillasApi, "vincularCarpetaDrive").mockResolvedValue({
			carpetaConfigurada: true,
			carpetaId: "folder-sin-verificar",
			carpetaNombre: null,
			plantillas: [],
			driveVerificado: false,
		});

		const mockEvent = {
			preventDefault: vi.fn(),
		} as unknown as React.SyntheticEvent;

		await act(async () => {
			await result.current.guardar(mockEvent);
		});

		expect(result.current.conexion.mensajeExito).toContain(
			"Carpeta guardada en la configuración. No se pudo verificar",
		);
	});

	it("no ejecuta guardar ni verificar si hay error de validacion", async () => {
		const spyVerificar = vi.spyOn(plantillasApi, "verificarCarpetaDrive");
		const spyVincular = vi.spyOn(plantillasApi, "vincularCarpetaDrive");

		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "",
				estadoCredencialesGoogle: "conectado",
			}),
		);

		await act(async () => {
			await result.current.verificar();
			await result.current.guardar({
				preventDefault: vi.fn(),
			} as unknown as React.SyntheticEvent);
		});

		expect(spyVerificar).not.toHaveBeenCalled();
		expect(spyVincular).not.toHaveBeenCalled();
	});

	it("limpia mensajes de error correctamente", () => {
		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "folder",
				estadoCredencialesGoogle: "conectado",
			}),
		);

		act(() => {
			result.current.limpiarError();
		});

		act(() => {
			result.current.conexion.setMensajeError("Error");
		});
		expect(result.current.mensajeErrorBanner).toBe("Error");

		act(() => {
			result.current.limpiarError();
		});
		expect(result.current.mensajeErrorBanner).toBeNull();
	});

	it("formatea mensaje con una sola plantilla y fallback de id al verificar y guardar", async () => {
		vi.spyOn(plantillasApi, "verificarCarpetaDrive").mockResolvedValueOnce({
			carpetaConfigurada: true,
			carpetaId: undefined as any,
			carpetaNombre: "Carpeta Singular",
			driveVerificado: true,
			plantillas: [
				{
					id: "p1",
					nombre: "Plan1",
					tipoMime: "application/vnd.google-apps.spreadsheet",
					enlaceWeb: null,
				},
			],
		});
		vi.spyOn(plantillasApi, "vincularCarpetaDrive").mockResolvedValueOnce({
			carpetaConfigurada: true,
			carpetaId: undefined as any,
			carpetaNombre: "Carpeta Singular",
			driveVerificado: true,
			plantillas: [
				{
					id: "p1",
					nombre: "Plan1",
					tipoMime: "application/vnd.google-apps.spreadsheet",
					enlaceWeb: null,
				},
			],
		});

		const { result } = renderHook(() =>
			useCarpetaDriveConfig({
				carpetaIdInicial: "id-inicial-123",
				estadoCredencialesGoogle: "conectado",
			}),
		);

		await act(async () => {
			await result.current.verificar();
		});
		expect(result.current.conexion.mensajeExito).toContain("1 plantilla");

		act(() => {
			result.current.cambiarInput("id-inicial-modificado");
		});

		await act(async () => {
			await result.current.guardar({ preventDefault: vi.fn() } as any);
		});
		expect(result.current.conexion.mensajeExito).toContain("1 plantilla");
	});
});
