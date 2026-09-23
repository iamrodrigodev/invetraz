// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ejecutarAccion, ejecutarPeticion } from "@/utils/api.ts";

describe("api helpers", () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", fetchMock);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const PruebaSchema = z.object({
		nombre: z.string(),
	});

	it("ejecutarPeticion deserializa los datos correctamente", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ datos: { nombre: "Investigación" } }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);

		const resultado = await ejecutarPeticion(
			"/api/test",
			{ method: "GET" },
			PruebaSchema,
			"Error en test",
		);

		expect(resultado).toEqual({ nombre: "Investigación" });
	});

	it("ejecutarPeticion lanza error con el mensaje de la API si status es error", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ mensaje: "El recurso solicitado no existe" }), {
				status: 404,
				headers: { "Content-Type": "application/json" },
			}),
		);

		await expect(
			ejecutarPeticion("/api/test", { method: "GET" }, PruebaSchema, "Error por defecto"),
		).rejects.toThrow("El recurso solicitado no existe");
	});

	it("ejecutarAccion completa satisfactoriamente en status 200", async () => {
		fetchMock.mockResolvedValue(
			new Response(null, {
				status: 200,
			}),
		);

		await expect(
			ejecutarAccion("/api/action", { method: "POST" }, "Error de acción"),
		).resolves.toBeUndefined();
	});

	it("ejecutarAccion lanza error si el status no es ok", async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ error: "No autorizado" }), {
				status: 403,
				headers: { "Content-Type": "application/json" },
			}),
		);

		await expect(
			ejecutarAccion("/api/action", { method: "POST" }, "Error de acción"),
		).rejects.toThrow("No autorizado");
	});
});
