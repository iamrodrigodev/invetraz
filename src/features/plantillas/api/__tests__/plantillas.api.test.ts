// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	obtenerPlantillas,
	verificarCarpetaDrive,
	vincularCarpetaDrive,
} from "@/features/plantillas/api/plantillas.api.ts";

describe("plantillas.api", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	const mockRespuesta = {
		carpetaConfigurada: true,
		carpetaId: "folder-123",
		carpetaNombre: "Carpeta de Plantillas",
		plantillas: [
			{
				id: "file-1",
				nombre: "Plantilla 1.xlsx",
				tipoMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				enlaceDescarga: "https://drive.google.com/download/file-1",
				enlaceWeb: "https://docs.google.com/spreadsheets/d/file-1",
				tamanoBytes: 1024,
				ultimaModificacion: "2026-09-23T10:00:00Z",
			},
		],
		driveVerificado: true,
	};

	it("obtenerPlantillas ejecuta get y retorna las plantillas", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				headers: new Headers({ "content-type": "application/json" }),
				json: async () => ({ datos: mockRespuesta }),
			}),
		);

		const res = await obtenerPlantillas();
		expect(res.carpetaId).toBe("folder-123");
		expect(res.plantillas).toHaveLength(1);
	});

	it("verificarCarpetaDrive ejecuta post con carpetaUrlOId", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => ({ datos: mockRespuesta }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const res = await verificarCarpetaDrive({ carpetaUrlOId: "folder-123" });
		expect(res.carpetaId).toBe("folder-123");
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/plantillas/verificar"),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ carpetaUrlOId: "folder-123" }),
			}),
		);
	});

	it("vincularCarpetaDrive ejecuta post para guardar la carpeta vinculada", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ "content-type": "application/json" }),
			json: async () => ({ datos: mockRespuesta }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const res = await vincularCarpetaDrive({ carpetaUrlOId: "folder-123" });
		expect(res.carpetaId).toBe("folder-123");
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining("/plantillas/carpeta"),
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ carpetaUrlOId: "folder-123" }),
			}),
		);
	});
});
