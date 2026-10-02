import { describe, expect, it } from "vitest";
import { esFormatoGoogleSheet, obtenerEtiquetaFormatoPlantilla } from "@/utils/formatoPlantilla.ts";

describe("formatoPlantilla", () => {
	it("retorna false si la plantilla es nula o indefinida", () => {
		expect(esFormatoGoogleSheet(null)).toBe(false);
		expect(esFormatoGoogleSheet(undefined)).toBe(false);
		expect(obtenerEtiquetaFormatoPlantilla(null)).toBe("XLSX");
	});

	it("detecta Google Sheets por tipoMime application/vnd.google-apps.spreadsheet", () => {
		const sheet = { tipoMime: "application/vnd.google-apps.spreadsheet" };
		expect(esFormatoGoogleSheet(sheet)).toBe(true);
		expect(obtenerEtiquetaFormatoPlantilla(sheet)).toBe("Google Sheets");
	});

	it("detecta XLSX por tipoMime openxmlformats", () => {
		const xlsx = {
			tipoMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			enlaceWeb: "https://docs.google.com/spreadsheets/d/123",
		};
		expect(esFormatoGoogleSheet(xlsx)).toBe(false);
		expect(obtenerEtiquetaFormatoPlantilla(xlsx)).toBe("XLSX");
	});

	it("detecta Google Sheets por enlaceWeb con /spreadsheets/", () => {
		const sheetPorUrl = { enlaceWeb: "https://docs.google.com/spreadsheets/d/abc" };
		expect(esFormatoGoogleSheet(sheetPorUrl)).toBe(true);
		expect(obtenerEtiquetaFormatoPlantilla(sheetPorUrl)).toBe("Google Sheets");
	});

	it("detecta Google Sheets por extensión .gsheet en el nombre", () => {
		const sheetPorNombre = { nombre: "MiFormato.gsheet" };
		expect(esFormatoGoogleSheet(sheetPorNombre)).toBe(true);
	});

	it("retorna false para archivos estándar sin indicadores de Google Sheets", () => {
		const xlsxPorNombre = { nombre: "Matriz.xlsx" };
		expect(esFormatoGoogleSheet(xlsxPorNombre)).toBe(false);
		expect(obtenerEtiquetaFormatoPlantilla(xlsxPorNombre)).toBe("XLSX");
	});
});
