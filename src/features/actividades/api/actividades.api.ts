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

export const ClaseClassroomDtoSchema = z.object({
	idClassroom: z.string(),
	nombre: z.string(),
	estado: z.string().optional(),
	enlaceClase: z.string().optional(),
});

export const TemaClassroomDtoSchema = z.object({
	idTema: z.string(),
	nombre: z.string(),
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
	const clases = await ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/clases/como-docente`,
		{ method: "GET" },
		z.array(ClaseClassroomDtoSchema),
		"Error al consultar las clases del docente",
	);
	return clases.map((c) => ({
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
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/clases/${idClase}/temas`,
		{ method: "GET" },
		z.array(TemaClassroomDtoSchema),
		"Error al consultar los temas de la clase",
	);
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
