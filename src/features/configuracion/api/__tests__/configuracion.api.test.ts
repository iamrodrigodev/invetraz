// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	actualizarConfiguracion,
	obtenerConfiguracion,
	verificarConfiguracion,
} from "@/features/configuracion/api/configuracion.api.ts";

describe("configuracion.api", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("obtenerConfiguracion ejecuta get y retorna configuracion", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({
					datos: {
						googleClientId: "client-id",
						googleClientSecret: "client-secret",
						googleRefreshToken: "refresh-token",
						googleDriveFolderId: "folder-123",
						googleDriveFolderName: "Carpeta",
						googleVerificado: true,
						driveVerificado: true,
					},
				}),
			}),
		);

		const config = await obtenerConfiguracion();
		expect(config.googleClientId).toBe("client-id");
		expect(config.googleDriveFolderId).toBe("folder-123");
		expect(config.googleVerificado).toBe(true);
	});

	it("actualizarConfiguracion ejecuta post con credenciales", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const peticion = {
			googleClientId: "id",
			googleClientSecret: "secret",
			googleRefreshToken: "token",
		};
		await expect(actualizarConfiguracion(peticion)).resolves.toBeUndefined();
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/configuracion"),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify(peticion),
			}),
		);
	});

	it("verificarConfiguracion ejecuta post con o sin peticion", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => ({
				datos: {
					valido: true,
					mensaje: "Conexión exitosa",
				},
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const resSinPeticion = await verificarConfiguracion();
		expect(resSinPeticion.valido).toBe(true);

		const peticion = {
			googleClientId: "id",
			googleClientSecret: "secret",
			googleRefreshToken: "token",
		};
		const resConPeticion = await verificarConfiguracion(peticion);
		expect(resConPeticion.valido).toBe(true);
	});
});
