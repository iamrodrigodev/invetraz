import type {
	ClaseDocente,
	FormGenerarActividadValores,
	PlantillaSeguimientoOpcion,
	TemaClase,
} from "@/features/actividades/types/actividades.types";

export const DATOS_PRUEBA_CARPETA = {
	id: "1abc-investigacion-formatos",
	nombre: "Plantillas de Seguimiento",
};

export const DATOS_PRUEBA_CLASES: ClaseDocente[] = [
	{
		idClassroom: "c-101",
		nombre: "Metodología de la Investigación - Grupo A",
	},
	{
		idClassroom: "c-102",
		nombre: "Tesis I - Sección 02",
	},
	{
		idClassroom: "c-103",
		nombre: "Seminario de Titulación - 2026",
	},
];

export const DATOS_PRUEBA_PLANTILLAS: PlantillaSeguimientoOpcion[] = [
	{
		id: "plan-01",
		nombre: "Matriz de Consistencia y Operacionalización.xlsx",
		frecuenciaUso: 6,
		estructuraValida: true,
		enlaceWeb: "https://docs.google.com/spreadsheets/d/mock-1",
	},
	{
		id: "plan-02",
		nombre: "Formato de Seguimiento de Avances Semanales.xlsx",
		frecuenciaUso: 4,
		estructuraValida: true,
		enlaceWeb: "https://docs.google.com/spreadsheets/d/mock-2",
	},
	{
		id: "plan-03",
		nombre: "Rúbrica de Evaluación de Marco Metodológico.xlsx",
		frecuenciaUso: 1,
		estructuraValida: true,
		enlaceWeb: "https://docs.google.com/spreadsheets/d/mock-3",
	},
	{
		id: "plan-04",
		nombre: "Plantilla Inválida Sin Columnas Obligatorias.xlsx",
		frecuenciaUso: 0,
		estructuraValida: false,
		mensajeErrorEstructura:
			"El archivo no contiene la hoja o las columnas obligatorias para la matriz de seguimiento.",
		erroresEstructura: [
			"No se encontraron los marcadores obligatorios {{ESTUDIANTE}} y {{CRITERIO}}.",
			"Faltan columnas obligatorias para registrar la ponderación y retroalimentación.",
		],
		enlaceWeb: null,
	},
];

export const DATOS_PRUEBA_TEMAS: Record<string, TemaClase[]> = {
	"c-101": [
		{ idTema: "t-101", nombre: "Semana 1: Planteamiento del problema" },
		{ idTema: "t-102", nombre: "Semana 2: Marco teórico y antecedentes" },
		{ idTema: "t-103", nombre: "Semana 3: Metodología y diseño muestral" },
	],
	"c-102": [
		{ idTema: "t-201", nombre: "Módulo 1: Revisión bibliográfica sistemática" },
		{ idTema: "t-202", nombre: "Módulo 2: Instrumentos de recolección" },
	],
	"c-103": [
		{ idTema: "t-301", nombre: "Fase 1: Redacción de resultados preliminares" },
		{ idTema: "t-302", nombre: "Fase 2: Conclusiones y recomendaciones" },
	],
};

export async function simularGeneracionActividad(
	_datos: FormGenerarActividadValores,
): Promise<boolean> {
	await new Promise((resolve) => setTimeout(resolve, 800));
	return true;
}
