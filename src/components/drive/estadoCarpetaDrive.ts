export type EstadoCarpetaDrive = "verificada" | "pendiente" | "verificando";

export interface DatosCarpetaDrive {
	carpetaId?: string | null | undefined;
	carpetaNombre?: string | null | undefined;
	estado?: EstadoCarpetaDrive | undefined;
}

export interface VistaEstadoCarpetaDrive {
	estado: EstadoCarpetaDrive;
	nombreVisible: string | null;
	estaConfigurada: boolean;
	estaPendiente: boolean;
	estaVerificando: boolean;
	badgeTexto: string;
	tituloVacio: string;
	descripcionVacia: string;
}

export function resolverVistaCarpetaDrive({
	carpetaId,
	carpetaNombre,
	estado: estadoExplicito,
}: DatosCarpetaDrive): VistaEstadoCarpetaDrive {
	const estaConfigurada = Boolean(carpetaId);
	const estaVerificando = estadoExplicito === "verificando";
	const estaPendiente =
		!estaVerificando &&
		Boolean(
			carpetaId &&
				(!carpetaNombre ||
					estadoExplicito === "pendiente" ||
					carpetaNombre === "Carpeta guardada sin verificar"),
		);
	const estado: EstadoCarpetaDrive = estaVerificando
		? "verificando"
		: estaPendiente
			? "pendiente"
			: "verificada";

	const nombreVisible = (() => {
		if (!estaConfigurada) return null;
		if (carpetaNombre && carpetaNombre !== "Carpeta guardada sin verificar") {
			return carpetaNombre;
		}
		if (estaVerificando) {
			return "Carpeta en verificación";
		}
		return "Carpeta guardada sin verificar";
	})();

	return {
		estado,
		nombreVisible,
		estaConfigurada,
		estaPendiente,
		estaVerificando,
		badgeTexto: estaVerificando
			? "Verificando..."
			: estaPendiente
				? "Guardada, no verificada"
				: "Carpeta vinculada",
		tituloVacio: estaPendiente
			? "Carpeta guardada, pendiente de verificación"
			: "No hay archivos en la carpeta",
		descripcionVacia: estaPendiente
			? "No se pudo verificar esta carpeta en Google Drive. Revisa el enlace o los permisos y vuelve a sincronizar."
			: "No se encontraron archivos de hojas de cálculo (.xlsx) en la carpeta de Drive vinculada.",
	};
}
