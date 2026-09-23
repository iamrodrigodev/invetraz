// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { describe, expect, it } from "vitest";
import * as ActividadesTypes from "@/features/actividades/types/actividades.types.ts";
import { type LoginRespuesta, LoginRespuestaSchema } from "@/features/auth/types/LoginRespuesta.ts";
import {
	type EstadoSetupRespuesta,
	EstadoSetupRespuestaSchema,
} from "@/features/setup/types/EstadoSetupRespuesta.ts";
import DefaultActividades, {
	ActividadesSeguimientoPage,
} from "@/pages/ActividadesSeguimientoPage.tsx";
import DefaultConfiguracion, { ConfiguracionPage } from "@/pages/ConfiguracionPage.tsx";
import DefaultDocumentacion, { DocumentacionPage } from "@/pages/DocumentacionPage.tsx";
import DefaultPlantillas, {
	PlantillasSeguimientoPage,
} from "@/pages/PlantillasSeguimientoPage.tsx";
import DefaultReportes, { ReportesPage } from "@/pages/ReportesPage.tsx";

describe("pages and types reexports", () => {
	it("reexporta las paginas correctamente", () => {
		expect(ActividadesSeguimientoPage).toBeDefined();
		expect(DefaultActividades).toBe(ActividadesSeguimientoPage);

		expect(ConfiguracionPage).toBeDefined();
		expect(DefaultConfiguracion).toBe(ConfiguracionPage);

		expect(DocumentacionPage).toBeDefined();
		expect(DefaultDocumentacion).toBe(DocumentacionPage);

		expect(PlantillasSeguimientoPage).toBeDefined();
		expect(DefaultPlantillas).toBe(PlantillasSeguimientoPage);

		expect(ReportesPage).toBeDefined();
		expect(DefaultReportes).toBe(ReportesPage);
	});

	it("reexporta schemas y tipos de auth y setup", () => {
		expect(LoginRespuestaSchema).toBeDefined();
		expect(EstadoSetupRespuestaSchema).toBeDefined();
		expect(ActividadesTypes).toBeDefined();
		expect(ActividadesTypes.TiposActividades).toBe(true);

		const loginValido: LoginRespuesta = {
			tokenAcceso: "tok",
		};
		expect(LoginRespuestaSchema.parse(loginValido)).toEqual(loginValido);

		const setupValido: EstadoSetupRespuesta = {
			configurado: true,
		};
		expect(EstadoSetupRespuestaSchema.parse(setupValido)).toEqual(setupValido);
	});
});
