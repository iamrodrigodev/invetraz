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
