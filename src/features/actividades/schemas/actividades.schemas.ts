import { z } from "zod";

export const GenerarActividadSchema = z.object({
	idClase: z.string().min(1, "Debe seleccionar una clase de Google Classroom"),
	titulo: z
		.string()
		.trim()
		.min(3, "El título debe contener al menos 3 caracteres")
		.max(255, "El título no puede exceder 255 caracteres"),
	fechaVencimiento: z
		.string()
		.min(1, "Debe seleccionar una fecha de vencimiento")
		.refine(
			(val) => {
				if (!val) return false;
				const [anio, mes, dia] = val.split("-").map(Number);
				if (!anio || !mes || !dia) return false;
				const fechaIngresada = new Date(anio, mes - 1, dia);
				const hoy = new Date();
				hoy.setHours(0, 0, 0, 0);
				return fechaIngresada >= hoy;
			},
			{
				message: "La fecha de vencimiento no puede ser anterior al día de hoy",
			},
		),
	idPlantilla: z
		.string()
		.min(1, "Debe seleccionar una plantilla de seguimiento"),
	descripcion: z
		.string()
		.max(2000, "La descripción no puede superar los 2000 caracteres")
		.optional()
		.or(z.literal("")),
	horaVencimiento: z.string().optional().or(z.literal("")),
	idTema: z.string().optional().or(z.literal("")),
});

export type GenerarActividadSchemaTipo = z.infer<typeof GenerarActividadSchema>;
