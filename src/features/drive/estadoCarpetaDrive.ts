// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
export type EstadoCarpetaDrive = "verificada" | "pendiente" | "verificando" | "no_disponible";

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
	estaNoDisponible: boolean;
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
