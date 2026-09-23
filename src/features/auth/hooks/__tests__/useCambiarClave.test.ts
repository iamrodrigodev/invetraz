// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authApi from "@/features/auth/api/auth.api.ts";
import { useCambiarClave } from "@/features/auth/hooks/useCambiarClave.ts";

describe("useCambiarClave", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("inicia en paso 1 inactivo sin errores ni exito", () => {
		const { result } = renderHook(() => useCambiarClave());
		expect(result.current.paso).toBe(1);
		expect(result.current.cargando).toBe(false);
		expect(result.current.exito).toBe(false);
		expect(result.current.errorApi).toBeNull();
		expect(result.current.estado.tipo).toBe("inactivo");

		act(() => {
			result.current.limpiarError();
		});
		expect(result.current.errorApi).toBeNull();
	});

	it("avanza a paso 2 tras verificar contraseña actual exitosamente", async () => {
		vi.spyOn(authApi, "verificarPasswordActual").mockResolvedValue();
		const { result } = renderHook(() => useCambiarClave());

		let exito = false;
		await act(async () => {
			exito = await result.current.verificarPaso1({ claveActual: "Clave123" });
		});

		expect(exito).toBe(true);
		expect(result.current.paso).toBe(2);
		expect(result.current.errorApi).toBeNull();
	});

	it("establece estado error si la verificacion en paso 1 falla", async () => {
		vi.spyOn(authApi, "verificarPasswordActual").mockRejectedValue(new Error("Clave incorrecta"));
		const { result } = renderHook(() => useCambiarClave());

		let exito = true;
		await act(async () => {
			exito = await result.current.verificarPaso1({ claveActual: "MalaClave" });
		});

		expect(exito).toBe(false);
		expect(result.current.paso).toBe(1);
		expect(result.current.errorApi).toBe("Clave incorrecta");

		act(() => {
			result.current.limpiarError();
		});
		expect(result.current.errorApi).toBeNull();
	});

	it("maneja fallo con error no tipado en paso 1", async () => {
		vi.spyOn(authApi, "verificarPasswordActual").mockRejectedValue("Error string");
		const { result } = renderHook(() => useCambiarClave());

		await act(async () => {
			await result.current.verificarPaso1({ claveActual: "MalaClave" });
		});

		expect(result.current.errorApi).toBe("La contraseña actual es incorrecta");
	});

	it("actualiza contraseña en paso 2 con exito", async () => {
		vi.spyOn(authApi, "verificarPasswordActual").mockResolvedValue();
		vi.spyOn(authApi, "cambiarPassword").mockResolvedValue();
		const { result } = renderHook(() => useCambiarClave());

		await act(async () => {
			await result.current.verificarPaso1({ claveActual: "Clave123" });
		});

		let exitoActualizar = false;
		await act(async () => {
			exitoActualizar = await result.current.actualizarClave({
				nuevaClave: "NuevaClave456",
				confirmarClave: "NuevaClave456",
			});
		});

		expect(exitoActualizar).toBe(true);
		expect(result.current.exito).toBe(true);
	});

	it("maneja fallo en actualizar contraseña en paso 2", async () => {
		vi.spyOn(authApi, "verificarPasswordActual").mockResolvedValue();
		vi.spyOn(authApi, "cambiarPassword").mockRejectedValue(new Error("No cumple politicas"));
		const { result } = renderHook(() => useCambiarClave());

		await act(async () => {
			await result.current.verificarPaso1({ claveActual: "Clave123" });
		});

		let exito = true;
		await act(async () => {
			exito = await result.current.actualizarClave({
				nuevaClave: "NuevaClave456",
				confirmarClave: "NuevaClave456",
			});
		});

		expect(exito).toBe(false);
		expect(result.current.errorApi).toBe("No cumple politicas");
	});

	it("maneja fallo con error no tipado en paso 2", async () => {
		vi.spyOn(authApi, "verificarPasswordActual").mockResolvedValue();
		vi.spyOn(authApi, "cambiarPassword").mockRejectedValue("Error string");
		const { result } = renderHook(() => useCambiarClave());

		await act(async () => {
			await result.current.verificarPaso1({ claveActual: "Clave123" });
			await result.current.actualizarClave({
				nuevaClave: "NuevaClave456",
				confirmarClave: "NuevaClave456",
			});
		});

		expect(result.current.errorApi).toBe("Hubo un error al actualizar la contraseña");
	});

	it("reinicia el estado del hook al paso 1", async () => {
		const { result } = renderHook(() => useCambiarClave());

		act(() => {
			result.current.setPaso(2);
		});
		expect(result.current.paso).toBe(2);

		act(() => {
			result.current.reiniciar();
		});
		expect(result.current.paso).toBe(1);
		expect(result.current.estado.tipo).toBe("inactivo");
	});
});
