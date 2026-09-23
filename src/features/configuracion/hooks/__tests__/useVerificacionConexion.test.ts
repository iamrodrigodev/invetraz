// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useVerificacionConexion } from "@/features/configuracion/hooks/useVerificacionConexion.ts";

describe("useVerificacionConexion", () => {
	it("inicializa con estado no_configurado si no tiene valor guardado", () => {
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar: vi.fn(),
			}),
		);

		expect(result.current.estadoVisual).toBe("no_configurado");
		expect(result.current.deshabilitarVerificar).toBe(false);
	});

	it("inicializa como conectado si valorGuardado esta verificado", () => {
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: "val",
				tieneValorGuardado: true,
				valorGuardadoVerificado: true,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar: vi.fn(),
			}),
		);

		expect(result.current.estadoVisual).toBe("conectado");
	});

	it("inicializa con estado guardado_pendiente si valorGuardado no esta verificado", () => {
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: "val",
				tieneValorGuardado: true,
				valorGuardadoVerificado: false,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar: vi.fn(),
			}),
		);

		expect(result.current.estadoVisual).toBe("guardado_pendiente");
	});

	it("deshabilita acciones y expone tooltip cuando la validacion es incompleta", () => {
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: false,
				onVerificar: vi.fn(),
				onGuardar: vi.fn(),
			}),
		);

		expect(result.current.deshabilitarVerificar).toBe(true);
		expect(result.current.deshabilitarGuardar).toBe(true);
		expect(result.current.tooltipVerificar).toBe(
			"Completa todos los campos requeridos antes de continuar",
		);
		expect(result.current.tooltipGuardar).toBe(
			"Completa todos los campos requeridos antes de continuar",
		);
	});

	it("ejecuta verificar exitosamente con respuesta string", async () => {
		const onVerificar = vi.fn().mockResolvedValue("Verificacion OK");
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar,
				onGuardar: vi.fn(),
			}),
		);

		let exito = false;
		await act(async () => {
			exito = await result.current.ejecutarVerificar();
		});

		expect(exito).toBe(true);
		expect(result.current.mensajeExito).toBe("Verificacion OK");
		expect(result.current.estadoVisual).toBe("conectado");
	});

	it("ejecuta verificar con fallo y actualiza estado a error", async () => {
		const onVerificar = vi.fn().mockRejectedValue(new Error("Fallo de red"));
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar,
				onGuardar: vi.fn(),
			}),
		);

		let exito = true;
		await act(async () => {
			exito = await result.current.ejecutarVerificar();
		});

		expect(exito).toBe(false);
		expect(result.current.mensajeError).toBe("Fallo de red");
		expect(result.current.estadoVisual).toBe("error");
		expect(result.current.tooltipGuardar).toContain("fallaron la validación previa");
	});

	it("ejecuta verificar con fallo no tipado Error", async () => {
		const onVerificar = vi.fn().mockRejectedValue("Error string");
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar,
				onGuardar: vi.fn(),
			}),
		);

		await act(async () => {
			await result.current.ejecutarVerificar();
		});

		expect(result.current.mensajeError).toBe("Error al verificar la conexión");
	});

	it("no ejecuta verificar si esValido es false", async () => {
		const onVerificar = vi.fn();
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: false,
				onVerificar,
				onGuardar: vi.fn(),
			}),
		);

		let exito = true;
		await act(async () => {
			exito = await result.current.ejecutarVerificar();
		});

		expect(exito).toBe(false);
		expect(onVerificar).not.toHaveBeenCalled();
	});

	it("ejecuta guardar exitosamente con objeto de respuesta", async () => {
		const onGuardar = vi.fn().mockResolvedValue({ mensaje: "Guardado OK", verificado: true });
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar,
			}),
		);

		let exito = false;
		await act(async () => {
			exito = await result.current.ejecutarGuardar();
		});

		expect(exito).toBe(true);
		expect(result.current.mensajeExito).toBe("Guardado OK");
		expect(result.current.estadoVisual).toBe("conectado");
		expect(result.current.tooltipGuardar).toBe("Modifica los campos para guardar cambios");
	});

	it("ejecuta guardar cuando la respuesta indica verificado false", async () => {
		const onGuardar = vi.fn().mockResolvedValue({
			mensaje: "Guardado pero no verificado",
			verificado: false,
		});
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar,
			}),
		);

		await act(async () => {
			await result.current.ejecutarGuardar();
		});

		expect(result.current.mensajeExito).toBe("Guardado pero no verificado");
		expect(result.current.estadoVisual).toBe("no_configurado");
	});

	it("ejecuta guardar con fallo y actualiza mensajes de error", async () => {
		const onGuardar = vi.fn().mockRejectedValue(new Error("Error guardando"));
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar,
			}),
		);

		let exito = true;
		await act(async () => {
			exito = await result.current.ejecutarGuardar();
		});

		expect(exito).toBe(false);
		expect(result.current.mensajeError).toBe("Error guardando");
	});

	it("ejecuta guardar con fallo no tipado Error", async () => {
		const onGuardar = vi.fn().mockRejectedValue("Error string");
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar,
			}),
		);

		await act(async () => {
			await result.current.ejecutarGuardar();
		});

		expect(result.current.mensajeError).toBe("Error al verificar o guardar la configuración");
	});

	it("no ejecuta guardar si esValido es false", async () => {
		const onGuardar = vi.fn();
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: false,
				onVerificar: vi.fn(),
				onGuardar,
			}),
		);

		let exito = true;
		await act(async () => {
			exito = await result.current.ejecutarGuardar();
		});

		expect(exito).toBe(false);
		expect(onGuardar).not.toHaveBeenCalled();
	});

	it("permite limpiar mensajes y setear estados auxiliares", () => {
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "val",
				valorGuardado: null,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar: vi.fn(),
			}),
		);

		act(() => {
			result.current.setMensajeError("Error");
			result.current.setMensajeExito("Exito");
			result.current.setVerificadoEnSesion("val");
			result.current.setUltimoIntentoGuardado("val");
			result.current.setFalloEnSesion("fallo");
		});

		expect(result.current.mensajeError).toBe("Error");
		expect(result.current.mensajeExito).toBe("Exito");

		act(() => {
			result.current.limpiarMensajes();
		});

		expect(result.current.mensajeError).toBeNull();
		expect(result.current.mensajeExito).toBeNull();
	});

	it("sincroniza valorGuardado cuando cambia externamente", () => {
		const { result, rerender } = renderHook(
			({ guardado }) =>
				useVerificacionConexion({
					valorActual: "nuevo",
					valorGuardado: guardado,
					tieneValorGuardado: Boolean(guardado),
					valorGuardadoVerificado: true,
					sonIguales: (a, b) => a === b,
					esValido: true,
					onVerificar: vi.fn(),
					onGuardar: vi.fn(),
				}),
			{ initialProps: { guardado: "inicial" } },
		);

		rerender({ guardado: "modificado" });
		expect(result.current.estadoVisual).toBe("no_configurado");
	});

	it("retorna estadoVisual verificando cuando esta en proceso y conectado cuando guardado verificado", async () => {
		let resolverVerificar: (val: string) => void = () => {};
		const promesaVerificar = new Promise<string>((res) => {
			resolverVerificar = res;
		});

		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "guardado",
				valorGuardado: "guardado",
				tieneValorGuardado: true,
				valorGuardadoVerificado: true,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: () => promesaVerificar,
				onGuardar: vi.fn(),
			}),
		);

		expect(result.current.estadoVisual).toBe("conectado");

		let promiseExecution: Promise<unknown>;
		act(() => {
			promiseExecution = result.current.ejecutarVerificar();
		});

		expect(result.current.estadoVisual).toBe("verificando");

		await act(async () => {
			resolverVerificar("ok");
			await promiseExecution;
		});

		expect(result.current.estadoVisual).toBe("conectado");
	});

	it("retorna conectado si valor coincide con guardado verificado aun con verificadoEnSesion nulo", () => {
		const { result } = renderHook(() =>
			useVerificacionConexion({
				valorActual: "guardado",
				valorGuardado: "guardado",
				tieneValorGuardado: true,
				valorGuardadoVerificado: true,
				sonIguales: (a, b) => a === b,
				esValido: true,
				onVerificar: vi.fn(),
				onGuardar: vi.fn(),
			}),
		);

		act(() => {
			result.current.setVerificadoEnSesion(null);
		});

		expect(result.current.estadoVisual).toBe("conectado");
	});
});
