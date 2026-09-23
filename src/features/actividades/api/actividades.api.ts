// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { z } from "zod";
import { entorno } from "@/config/entorno.ts";
import type {
	ClaseDocente,
	FormGenerarActividadValores,
	PlantillaSeguimientoOpcion,
	TemaClase,
} from "@/features/actividades/types/actividades.types.ts";
import { obtenerPlantillas } from "@/features/plantillas/api/plantillas.api.ts";
import { ejecutarPeticion } from "@/utils/api.ts";

const ClaseClassroomDtoSchema = z.object({
	idClassroom: z.string(),
	nombre: z.string(),
	estado: z.string().optional(),
	enlaceClase: z.string().optional(),
});

const ListarClasesRespuestaSchema = z.object({
	mensaje: z.string().optional(),
	datos: z.array(ClaseClassroomDtoSchema),
});

const TemaClassroomDtoSchema = z.object({
	idTema: z.string(),
	nombre: z.string(),
});

const ListarTemasRespuestaSchema = z.object({
	mensaje: z.string().optional(),
	datos: z.array(TemaClassroomDtoSchema),
});

const PLANTILLA_MOCK_INVALIDA: PlantillaSeguimientoOpcion = {
	id: "mock-plantilla-seguimiento-invalida",
	nombre: "Plantilla de prueba - estructura inválida",
	enlaceWeb: "https://docs.google.com/spreadsheets/d/mock-plantilla-invalida",
	frecuenciaUso: 0,
	estructuraValida: false,
	mensajeErrorEstructura:
		"No se puede usar esta plantilla porque no cumple con la estructura mínima de seguimiento.",
	erroresEstructura: [
		"No se encontraron los marcadores obligatorios {{ESTUDIANTE}} y {{CRITERIO}}.",
		"Falta la hoja principal Matriz de Seguimiento.",
		"No existen las columnas mínimas de evaluación: Ponderación, Evidencia y Retroalimentación.",
	],
};

export async function obtenerClasesDocente(): Promise<ClaseDocente[]> {
	const res = await ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/clases/como-docente`,
		{ method: "GET" },
		ListarClasesRespuestaSchema,
		"Error al consultar las clases del docente",
	);
	return res.datos.map((c) => ({
		idClassroom: c.idClassroom,
		nombre: c.nombre,
		estado: c.estado,
	}));
}

export async function obtenerPlantillasParaFormulario(): Promise<PlantillaSeguimientoOpcion[]> {
	const res = await obtenerPlantillas();

	const plantillasDrive = res.plantillas.map((p) => {
		const estructuraValida = !p.nombre.toLowerCase().includes("invalida");

		return {
			id: p.id,
			nombre: p.nombre.replace(/\.(xlsx|xls|gsheet)$/iu, ""),
			enlaceWeb: p.enlaceWeb ?? null,
			frecuenciaUso: 0,
			estructuraValida,
			mensajeErrorEstructura: estructuraValida
				? undefined
				: "El archivo no contiene la hoja o las columnas obligatorias para la matriz de seguimiento.",
			erroresEstructura: estructuraValida
				? undefined
				: [
						"No se encontró la hoja principal Matriz de Seguimiento.",
						"Faltan columnas obligatorias para registrar la evaluación.",
					],
		};
	});

	return [...plantillasDrive, PLANTILLA_MOCK_INVALIDA];
}

export async function obtenerTemasClase(idClase: string): Promise<TemaClase[]> {
	const res = await ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/clases/${idClase}/temas`,
		{ method: "GET" },
		ListarTemasRespuestaSchema,
		"Error al consultar los temas de la clase",
	);
	return res.datos;
}

export async function generarActividadSeguimientoApi(
	datos: FormGenerarActividadValores,
): Promise<boolean> {
	const res = await fetch(`${entorno.VITE_API_BASE_URL}/clases/${datos.idClase}/tareas`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			titulo: datos.titulo,
			descripcion: datos.descripcion,
			fechaLimite: datos.fechaVencimiento
				? `${datos.fechaVencimiento}T${datos.horaVencimiento || "23:59"}:00`
				: undefined,
		}),
	});
	return res.ok;
}
