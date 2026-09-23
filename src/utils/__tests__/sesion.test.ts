// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	esSesionValida,
	extraerExpiracionJwt,
	guardarSesion,
	limpiarSesion,
	programarExpiracionAutomatica,
} from "@/utils/sesion.ts";

describe("sesion", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	afterEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	describe("extraerExpiracionJwt", () => {
		it("retorna null si el token no tiene formato jwt", () => {
			expect(extraerExpiracionJwt("tokeninvalido")).toBeNull();
		});

		it("retorna null si el payload no es base64 valido o json", () => {
			expect(extraerExpiracionJwt("header.payload-invalido.sig")).toBeNull();
		});

		it("retorna null si el payload no contiene exp numerico", () => {
			const payload = btoa(JSON.stringify({ sub: "123" }));
			expect(extraerExpiracionJwt(`header.${payload}.sig`)).toBeNull();
		});

		it("extrae la fecha de expiracion en milisegundos", () => {
			const expSegundos = 1_800_000_000;
			const payload = btoa(JSON.stringify({ exp: expSegundos }));
			expect(extraerExpiracionJwt(`header.${payload}.sig`)).toBe(expSegundos * 1000);
		});

		it("maneja correctamente el padding de base64 con url-safe", () => {
			const payloadObj = { exp: 1_750_000_000, datos: "abc" };
			const base64 = btoa(JSON.stringify(payloadObj))
				.replace(/\+/gu, "-")
				.replace(/\//gu, "_")
				.replace(/[=]+$/u, "");
			expect(extraerExpiracionJwt(`header.${base64}.sig`)).toBe(1_750_000_000_000);
		});
	});

	describe("esSesionValida", () => {
		it("retorna false si window no esta definido", () => {
			const originalWindow = globalThis.window;
			try {
				(globalThis as { window?: unknown }).window = undefined;
				expect(esSesionValida()).toBe(false);
			} finally {
				globalThis.window = originalWindow;
			}
		});

		it("retorna false si el motivo de salida es sesion_expirada", () => {
			sessionStorage.setItem("motivo_salida", "sesion_expirada");
			expect(esSesionValida()).toBe(false);
		});

		it("retorna false si no hay sesion activa en localStorage", () => {
			expect(esSesionValida()).toBe(false);
		});

		it("retorna true si hay sesion activa sin expiracion definida", () => {
			localStorage.setItem("sesion_activa", "true");
			expect(esSesionValida()).toBe(true);
		});

		it("retorna true si expira_en es un valor no numerico", () => {
			localStorage.setItem("sesion_activa", "true");
			localStorage.setItem("sesion_expira_en", "invalido");
			expect(esSesionValida()).toBe(true);
		});

		it("retorna false y limpia sesion si expira_en ya vencio", () => {
			localStorage.setItem("sesion_activa", "true");
			localStorage.setItem("sesion_expira_en", (Date.now() - 10_000).toString());
			expect(esSesionValida()).toBe(false);
			expect(sessionStorage.getItem("motivo_salida")).toBe("sesion_expirada");
		});

		it("retorna true si expira_en aun no vence", () => {
			localStorage.setItem("sesion_activa", "true");
			localStorage.setItem("sesion_expira_en", (Date.now() + 100_000).toString());
			expect(esSesionValida()).toBe(true);
		});
	});

	describe("guardarSesion", () => {
		it("no hace nada si window no esta definido", () => {
			const originalWindow = globalThis.window;
			try {
				(globalThis as { window?: unknown }).window = undefined;
				guardarSesion("token", "user@test.com");
			} finally {
				globalThis.window = originalWindow;
			}
		});

		it("guarda los datos de sesion correctamente", () => {
			const payload = btoa(JSON.stringify({ exp: 1_900_000_000 }));
			const token = `h.${payload}.s`;
			guardarSesion(token, "admin@test.com");

			expect(localStorage.getItem("sesion_activa")).toBe("true");
			expect(localStorage.getItem("usuario_email")).toBe("admin@test.com");
			expect(localStorage.getItem("sesion_expira_en")).toBe("1900000000000");
		});

		it("guarda sesion sin tokenAcceso ni email", () => {
			guardarSesion();
			expect(localStorage.getItem("sesion_activa")).toBe("true");
			expect(localStorage.getItem("usuario_email")).toBeNull();
			expect(localStorage.getItem("sesion_expira_en")).toBeNull();
		});

		it("no guarda email ni expiracion si no se proveen o si el token es invalido", () => {
			guardarSesion("invalido", null);
			expect(localStorage.getItem("sesion_activa")).toBe("true");
			expect(localStorage.getItem("usuario_email")).toBeNull();
			expect(localStorage.getItem("sesion_expira_en")).toBeNull();
		});
	});

	describe("limpiarSesion", () => {
		it("no hace nada si window no esta definido", () => {
			const originalWindow = globalThis.window;
			try {
				(globalThis as { window?: unknown }).window = undefined;
				limpiarSesion("sesion_expirada");
			} finally {
				globalThis.window = originalWindow;
			}
		});

		it("remueve las claves de localStorage y opcionalmente setea motivo_salida", () => {
			localStorage.setItem("sesion_activa", "true");
			localStorage.setItem("sesion_expira_en", "123");
			localStorage.setItem("usuario_email", "a@b.com");
			localStorage.setItem("moduloActivo", "mod");
			localStorage.setItem("jwt", "token");

			limpiarSesion("sesion_expirada");

			expect(localStorage.getItem("sesion_activa")).toBeNull();
			expect(localStorage.getItem("sesion_expira_en")).toBeNull();
			expect(localStorage.getItem("usuario_email")).toBeNull();
			expect(localStorage.getItem("moduloActivo")).toBeNull();
			expect(localStorage.getItem("jwt")).toBeNull();
			expect(sessionStorage.getItem("motivo_salida")).toBe("sesion_expirada");
		});

		it("limpia sin establecer motivo de salida cuando no se provee argumento", () => {
			localStorage.setItem("sesion_activa", "true");
			limpiarSesion();
			expect(sessionStorage.getItem("motivo_salida")).toBeNull();
		});
	});

	describe("programarExpiracionAutomatica", () => {
		it("no hace nada si window no esta definido", () => {
			const originalWindow = globalThis.window;
			try {
				(globalThis as { window?: unknown }).window = undefined;
				const cancelar = programarExpiracionAutomatica(() => {});
				expect(typeof cancelar).toBe("function");
				cancelar();
			} finally {
				globalThis.window = originalWindow;
			}
		});

		it("no programa si no hay sesion_expira_en", () => {
			const callback = vi.fn();
			const cancelar = programarExpiracionAutomatica(callback);
			cancelar();
			expect(callback).not.toHaveBeenCalled();
		});

		it("no programa si sesion_expira_en no es un numero valido", () => {
			localStorage.setItem("sesion_expira_en", "abc");
			const callback = vi.fn();
			const cancelar = programarExpiracionAutomatica(callback);
			cancelar();
			expect(callback).not.toHaveBeenCalled();
		});

		it("ejecuta callback inmediatamente si el tiempo restante es menor o igual a 0", () => {
			localStorage.setItem("sesion_expira_en", (Date.now() - 500).toString());
			const callback = vi.fn();
			const cancelar = programarExpiracionAutomatica(callback);
			cancelar();
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("programa temporizador y permite cancelarlo multiples veces", () => {
			vi.useFakeTimers();
			localStorage.setItem("sesion_expira_en", (Date.now() + 5000).toString());
			const callback = vi.fn();
			const cancelar = programarExpiracionAutomatica(callback);

			vi.advanceTimersByTime(2000);
			expect(callback).not.toHaveBeenCalled();

			cancelar();
			cancelar();
			vi.advanceTimersByTime(4000);
			expect(callback).not.toHaveBeenCalled();
		});

		it("ejecuta callback al cumplirse el tiempo programado", () => {
			vi.useFakeTimers();
			localStorage.setItem("sesion_expira_en", (Date.now() + 3000).toString());
			const callback = vi.fn();
			programarExpiracionAutomatica(callback);

			vi.advanceTimersByTime(3000);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it("reemplaza un temporizador previo si se llama dos veces", () => {
			vi.useFakeTimers();
			localStorage.setItem("sesion_expira_en", (Date.now() + 5000).toString());
			const primerCallback = vi.fn();
			const segundoCallback = vi.fn();

			programarExpiracionAutomatica(primerCallback);
			programarExpiracionAutomatica(segundoCallback);

			vi.advanceTimersByTime(5000);
			expect(primerCallback).not.toHaveBeenCalled();
			expect(segundoCallback).toHaveBeenCalledTimes(1);
		});
	});
});
