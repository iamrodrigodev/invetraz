export type EstadoCarpetaDrive = "verificada" | "pendiente" | "verificando" | "no_disponible";

export type DatosCarpetaDrive = {
	carpetaId?: string | null | undefined;
	carpetaNombre?: string | null | undefined;
	estado?: EstadoCarpetaDrive | undefined;
};

export type VistaEstadoCarpetaDrive = {
	estado: EstadoCarpetaDrive;
	nombreVisible: string | null;
	estaConfigurada: boolean;
	estaPendiente: boolean;
	estaVerificando: boolean;
	estaNoDisponible: boolean;
	badgeTexto: string;
	tituloVacio: string;
	descripcionVacia: string;
};

export function resolverVistaCarpetaDrive({
	carpetaId,
	carpetaNombre,
	estado: estadoExplicito,
}: DatosCarpetaDrive): VistaEstadoCarpetaDrive {
	const estaConfigurada = Boolean(carpetaId);
	const estaVerificando = estadoExplicito === "verificando";
	const estaNoDisponible = estadoExplicito === "no_disponible";
	const estaPendiente =
		!(estaVerificando || estaNoDisponible) &&
		Boolean(
			carpetaId &&
				(!carpetaNombre ||
					estadoExplicito === "pendiente" ||
					carpetaNombre === "Carpeta guardada sin verificar"),
		);
	const estado: EstadoCarpetaDrive = estaVerificando
		? "verificando"
		: estaNoDisponible
			? "no_disponible"
			: estaPendiente
				? "pendiente"
				: "verificada";

	const nombreVisible = (() => {
		if (!estaConfigurada) {
			return null;
		}
		if (carpetaNombre && carpetaNombre !== "Carpeta guardada sin verificar") {
			return carpetaNombre;
		}
		if (estaVerificando) {
			return "Carpeta en verificación";
		}
		if (estaNoDisponible) {
			return "Carpeta no disponible";
		}
		return "Carpeta guardada sin verificar";
	})();

	return {
		estado,
		nombreVisible,
		estaConfigurada,
		estaPendiente,
		estaVerificando,
		estaNoDisponible,
		badgeTexto: estaVerificando
			? "Verificando..."
			: estaNoDisponible
				? "No se puede usar"
				: estaPendiente
					? "Guardada, no verificada"
					: "Carpeta vinculada",
		tituloVacio: estaNoDisponible
			? "Carpeta no disponible para su uso"
			: estaPendiente
				? "Carpeta guardada, pendiente de verificación"
				: "No hay archivos en la carpeta",
		descripcionVacia: estaNoDisponible
			? "Esta carpeta no se puede usar porque las credenciales de Google Cloud no están verificadas."
			: estaPendiente
				? "No se pudo verificar esta carpeta en Google Drive. Revisa el enlace o los permisos y vuelve a sincronizar."
				: "No se encontraron archivos de hojas de cálculo (.xlsx) en la carpeta de Drive vinculada.",
	};
}
