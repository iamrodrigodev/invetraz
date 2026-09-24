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

export const TiposActividades = true;
