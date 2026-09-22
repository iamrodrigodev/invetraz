import { z } from "zod";
import { entorno } from "../../../config/entorno";
import { ejecutarPeticion } from "../../../utils/api";
import { CarpetaPlantillasRespuestaSchema } from "../../plantillas/types/plantillas.types";
import type {
	ClaseDocente,
	FormGenerarActividadValores,
	PlantillaSeguimientoOpcion,
	TemaClase,
} from "../types/actividades.types";

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

export async function obtenerPlantillasParaFormulario(): Promise<
	PlantillaSeguimientoOpcion[]
> {
	const res = await ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/plantillas`,
		{ method: "GET" },
		CarpetaPlantillasRespuestaSchema,
		"Error al consultar las plantillas",
	);

	return res.plantillas.map((p, idx) => ({
		id: p.id,
		nombre: p.nombre,
		enlaceWeb: p.enlaceWeb ?? null,
		frecuenciaUso: idx + 1,
		estructuraValida: !p.nombre.toLowerCase().includes("invalida"),
		mensajeErrorEstructura: p.nombre.toLowerCase().includes("invalida")
			? "El archivo no contiene la hoja o las columnas obligatorias para la matriz de seguimiento."
			: undefined,
	}));
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
	const res = await fetch(
		`${entorno.VITE_API_BASE_URL}/clases/${datos.idClase}/tareas`,
		{
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
		},
	);
	return res.ok;
}
