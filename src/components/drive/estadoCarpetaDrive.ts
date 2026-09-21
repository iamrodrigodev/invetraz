export type EstadoCarpetaDrive = "verificada" | "pendiente";

export interface DatosCarpetaDrive {
	carpetaId?: string | null | undefined;
	carpetaNombre?: string | null | undefined;
}

export interface VistaEstadoCarpetaDrive {
	estado: EstadoCarpetaDrive;
	nombreVisible: string | null;
	estaConfigurada: boolean;
	estaPendiente: boolean;
	badgeTexto: string;
	tituloVacio: string;
	descripcionVacia: string;
}

export function resolverVistaCarpetaDrive({
	carpetaId,
	carpetaNombre,
}: DatosCarpetaDrive): VistaEstadoCarpetaDrive {
	const estaConfigurada = Boolean(carpetaId);
	const estaPendiente = Boolean(carpetaId && !carpetaNombre);
	const estado: EstadoCarpetaDrive = estaPendiente ? "pendiente" : "verificada";

	return {
		estado,
		nombreVisible: estaConfigurada
			? carpetaNombre || "Carpeta guardada sin verificar"
			: null,
		estaConfigurada,
		estaPendiente,
		badgeTexto: estaPendiente ? "Guardada, no verificada" : "Carpeta vinculada",
		tituloVacio: estaPendiente
			? "Carpeta guardada, pendiente de verificación"
			: "No hay archivos en la carpeta",
		descripcionVacia: estaPendiente
			? "No se pudo verificar esta carpeta en Google Drive. Revisa el enlace o los permisos y vuelve a sincronizar."
			: "No se encontraron archivos de hojas de cálculo (.xlsx) en la carpeta de Drive vinculada.",
	};
}
