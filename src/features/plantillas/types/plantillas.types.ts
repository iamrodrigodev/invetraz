import { z } from "zod";

export const PlantillaXlsxSchema = z.object({
	id: z.string(),
	nombre: z.string(),
	tipoMime: z.string(),
	enlaceWeb: z.string().nullable().optional(),
	enlaceDescarga: z.string().nullable().optional(),
	tamanoBytes: z.number().nullable().optional(),
	ultimaModificacion: z.string().nullable().optional(),
});

export type PlantillaXlsx = z.infer<typeof PlantillaXlsxSchema>;

export const CarpetaPlantillasRespuestaSchema = z.object({
	carpetaConfigurada: z.boolean(),
	carpetaId: z.string().nullable().optional(),
	carpetaNombre: z.string().nullable().optional(),
	plantillas: z.array(PlantillaXlsxSchema),
	driveVerificado: z.boolean().optional().default(false),
});

export type CarpetaPlantillasRespuesta = z.infer<
	typeof CarpetaPlantillasRespuestaSchema
>;

export const VincularCarpetaPeticionSchema = z.object({
	carpetaUrlOId: z
		.string()
		.trim()
		.min(1, "El enlace o ID de la carpeta de Google Drive es obligatorio"),
});

export type VincularCarpetaPeticion = z.infer<
	typeof VincularCarpetaPeticionSchema
>;
