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
	tipoMime?: string | null | undefined;
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
	esGoogleSheet?: boolean | undefined;
}

export interface CrearTareaPeticionDto {
	titulo: string;
	descripcion?: string | undefined;
	puntajeMaximo?: number | undefined;
	fechaLimite?: string | undefined;
	estado?: string | undefined;
	idTema?: string | undefined;
	idPlantilla?: string | undefined;
}

export interface TareaRespuestaDto {
	idTarea: string;
	idClase?: string | undefined;
	titulo: string;
	descripcion?: string | undefined;
	estado?: string | undefined;
	enlaceTarea?: string | undefined;
	fechaLimite?: string | null | undefined;
	puntajeMaximo?: number | null | undefined;
}

export const TiposActividades = true;
