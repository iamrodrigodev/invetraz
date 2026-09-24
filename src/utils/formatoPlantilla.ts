export interface ReferenciaPlantilla {
	tipoMime?: string | null | undefined;
	enlaceWeb?: string | null | undefined;
	nombre?: string | undefined;
}

export function esFormatoGoogleSheet(plantilla?: ReferenciaPlantilla | null): boolean {
	if (!plantilla) {
		return false;
	}
	if (plantilla.tipoMime === "application/vnd.google-apps.spreadsheet") {
		return true;
	}
	if (plantilla.tipoMime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
		return false;
	}
	if (plantilla.enlaceWeb?.includes("/spreadsheets/")) {
		return true;
	}
	if (plantilla.nombre?.toLowerCase().endsWith(".gsheet")) {
		return true;
	}
	return false;
}

export function obtenerEtiquetaFormatoPlantilla(
	plantilla?: ReferenciaPlantilla | null,
): "Google Sheets" | "XLSX" {
	return esFormatoGoogleSheet(plantilla) ? "Google Sheets" : "XLSX";
}
