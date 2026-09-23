// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
	crearApiRespuestaSchema,
	EstadoSetupRespuestaSchema,
	LoginRespuestaSchema,
	VerificarAutenticacionRespuestaSchema,
} from "@/schemas/api.schemas.ts";

describe("api.schemas", () => {
	describe("VerificarAutenticacionRespuestaSchema", () => {
		it("valida respuestas autenticadas y no autenticadas con email opcional o null", () => {
			expect(
				VerificarAutenticacionRespuestaSchema.safeParse({
					autenticado: true,
					email: "user@ulasalle.edu.pe",
				}).success,
			).toBe(true);

			expect(
				VerificarAutenticacionRespuestaSchema.safeParse({
					autenticado: false,
					email: null,
				}).success,
			).toBe(true);

			expect(
				VerificarAutenticacionRespuestaSchema.safeParse({
					autenticado: false,
				}).success,
			).toBe(true);
		});
	});

	describe("LoginRespuestaSchema", () => {
		it("valida token no vacio", () => {
			expect(LoginRespuestaSchema.safeParse({ tokenAcceso: "jwt.token.aquí" }).success).toBe(true);
			expect(LoginRespuestaSchema.safeParse({ tokenAcceso: "" }).success).toBe(false);
		});
	});

	describe("EstadoSetupRespuestaSchema", () => {
		it("valida bandera configurado", () => {
			expect(EstadoSetupRespuestaSchema.safeParse({ configurado: true }).success).toBe(true);
			expect(EstadoSetupRespuestaSchema.safeParse({ configurado: false }).success).toBe(true);
		});
	});

	describe("crearApiRespuestaSchema", () => {
		const TestSchema = crearApiRespuestaSchema(z.object({ id: z.number() }));

		it("valida la estructura estandar de respuesta del backend", () => {
			const res = TestSchema.safeParse({
				estado: 200,
				mensaje: "OK",
				idRastreo: "trace-123",
				ruta: "/api/test",
				fechaHora: "2026-09-23T10:00:00Z",
				datos: { id: 10 },
				errores: null,
			});
			expect(res.success).toBe(true);
		});

		it("permite omitir campos opcionales", () => {
			const res = TestSchema.safeParse({
				datos: { id: 5 },
			});
			expect(res.success).toBe(true);
		});
	});
});
