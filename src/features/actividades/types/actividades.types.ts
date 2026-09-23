// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
export interface ClaseDocente {
	idClassroom: string;
	nombre: string;
	seccion?: string | undefined;
	estado?: string | undefined;
}

export interface TemaClase {
	idTema: string;
	nombre: string;
}

export interface PlantillaSeguimientoOpcion {
	id: string;
	nombre: string;
	enlaceWeb?: string | null | undefined;
	frecuenciaUso: number;
	estructuraValida: boolean;
	mensajeErrorEstructura?: string | undefined;
	erroresEstructura?: string[] | undefined;
}

export interface FormGenerarActividadValores {
	idClase: string;
	titulo: string;
	fechaVencimiento: string;
	idPlantilla: string;
	descripcion?: string | undefined;
	horaVencimiento?: string | undefined;
	idTema?: string | undefined;
}

export interface ResumenConfirmacionActividad {
	nombreClase: string;
	titulo: string;
	nombrePlantilla: string;
	fechaVencimiento: string;
	horaVencimiento?: string | undefined;
	nombreTema?: string | undefined;
	descripcion?: string | undefined;
	enlacePlantillaWeb?: string | null | undefined;
}

export const TiposActividades = true;
