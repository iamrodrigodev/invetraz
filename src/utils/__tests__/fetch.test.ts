// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
	alExpirarSesion,
	extraerMensajeError,
	fetchSeguro,
	parsearConEsquema,
} from "@/utils/fetch.ts";

afterEach(() => {
	vi.unstubAllGlobals();
	alExpirarSesion(null as unknown as () => void);
});

describe("fetchSeguro", () => {
	it("aplica credenciales sin modificar las opciones recibidas", async () => {
		const llamada = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
		vi.stubGlobal("fetch", llamada);
		const opciones: RequestInit = { method: "GET" };

		await fetchSeguro("/recurso", opciones);

		expect(opciones.credentials).toBeUndefined();
		expect(llamada).toHaveBeenCalledWith("/recurso", {
			method: "GET",
			credentials: "include",
		});
	});

	it("expira en 401, pero conserva la sesión en 403", async () => {
		const expirar = vi.fn();
		alExpirarSesion(expirar);
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce(new Response(null, { status: 403 }))
				.mockResolvedValueOnce(new Response(null, { status: 401 })),
		);

		await fetchSeguro("/recurso");
		expect(expirar).not.toHaveBeenCalled();
		await fetchSeguro("/recurso");
		expect(expirar).toHaveBeenCalledOnce();
	});

	it("no llama al manejador de expiracion si la url es de auth (/login, /logout, /me)", async () => {
		const expirar = vi.fn();
		alExpirarSesion(expirar);
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

		await fetchSeguro("/api/auth/login");
		await fetchSeguro("/api/auth/logout");
		await fetchSeguro("/api/auth/me");

		expect(expirar).not.toHaveBeenCalled();
	});

	it("no falla si ocurre 401 y no hay manejador registrado", async () => {
		alExpirarSesion(null as unknown as () => void);
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

		const res = await fetchSeguro("/otra-ruta");
		expect(res.status).toBe(401);
	});

	it("propaga el error si ya incluye el mensaje de servidor no responde", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("El servidor no responde")));

		await expect(fetchSeguro("/test")).rejects.toThrow("El servidor no responde");
	});

	it("captura otros errores de red y lanza mensaje amigable", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

		await expect(fetchSeguro("/test")).rejects.toThrow(
			"El servidor no responde. Verifica que esté encendido o revisa tu conexión a internet.",
		);
	});
});

describe("extraerMensajeError", () => {
	it("retorna el mensaje por defecto si content-type no es json", async () => {
		const res = new Response("Error de servidor", {
			headers: { "content-type": "text/plain" },
		});
		const msg = await extraerMensajeError(res, "Fallback");
		expect(msg).toBe("Fallback");
	});

	it("retorna mensaje si viene propiedad mensaje", async () => {
		const res = Response.json({ mensaje: "Error especifico" });
		const msg = await extraerMensajeError(res, "Fallback");
		expect(msg).toBe("Error especifico");
	});

	it("retorna message si viene propiedad message", async () => {
		const res = Response.json({ message: "Mensaje en ingles" });
		const msg = await extraerMensajeError(res, "Fallback");
		expect(msg).toBe("Mensaje en ingles");
	});

	it("retorna error si viene propiedad error", async () => {
		const res = Response.json({ error: "Falla de validacion" });
		const msg = await extraerMensajeError(res, "Fallback");
		expect(msg).toBe("Falla de validacion");
	});

	it("retorna mensaje por defecto si json no contiene ningun campo de texto conocido", async () => {
		const res = Response.json({ estado: 500 });
		const msg = await extraerMensajeError(res, "Fallback");
		expect(msg).toBe("Fallback");
	});

	it("retorna mensaje por defecto si res.json() falla", async () => {
		const res = {
			headers: {
				get: (nombre: string) =>
					nombre.toLowerCase() === "content-type" ? "application/json" : null,
			},
			json: vi.fn().mockRejectedValue(new Error("Parse error")),
		} as unknown as Response;

		const msg = await extraerMensajeError(res, "Fallback");
		expect(msg).toBe("Fallback");
	});
});

describe("parsearConEsquema", () => {
	const testSchema = z.object({
		id: z.number(),
		nombre: z.string(),
	});

	it("lanza error si content-type no es application/json", async () => {
		const res = new Response("html", {
			headers: { "content-type": "text/html" },
		});
		await expect(parsearConEsquema(res, testSchema)).rejects.toThrow(
			"Error de comunicación con el servidor. Inténtalo de nuevo más tarde.",
		);
	});

	it("retorna datos validados con schema", async () => {
		const res = Response.json({ id: 1, nombre: "Test" });
		const datos = await parsearConEsquema(res, testSchema);
		expect(datos).toEqual({ id: 1, nombre: "Test" });
	});
});
