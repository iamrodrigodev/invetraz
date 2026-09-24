import { z } from "zod";

export const GenerarActividadSchema = z
	.object({
		idClase: z.string().min(1, "Debe seleccionar una clase de Google Classroom"),
		titulo: z
			.string()
			.trim()
			.min(1, "El título debe contener al menos 1 carácter")
			.max(3000, "El título no puede exceder 3000 caracteres"),
		fechaVencimiento: z
			.string()
			.min(1, "Debe seleccionar una fecha de vencimiento")
			.refine(
				(val) => {
					if (!val) {
						return false;
					}
					const [anio, mes, dia] = val.split("-").map(Number);
					if (!(anio && mes && dia)) {
						return false;
					}
					const fechaIngresada = new Date(anio, mes - 1, dia);
					const hoy = new Date();
					hoy.setHours(0, 0, 0, 0);
					return fechaIngresada >= hoy;
				},
				{
					message: "La fecha de vencimiento no puede ser anterior al día de hoy",
				},
			),
		idPlantilla: z.string().min(1, "Debe seleccionar una plantilla de seguimiento"),
		descripcion: z
			.string()
			.max(2000, "La descripción no puede superar los 2000 caracteres")
			.optional()
			.or(z.literal("")),
		horaVencimiento: z.string().optional().or(z.literal("")),
		idTema: z.string().optional().or(z.literal("")),
	})
	.superRefine((data, ctx) => {
		if (!data.fechaVencimiento) {
			return;
		}

		const [anio, mes, dia] = data.fechaVencimiento.split("-").map(Number);
		if (!(anio && mes && dia)) {
			return;
		}

		const ahora = new Date();
		const anioActual = ahora.getFullYear();
		const mesActual = ahora.getMonth() + 1;
		const diaActual = ahora.getDate();

		const esMismoDia = anio === anioActual && mes === mesActual && dia === diaActual;

		if (esMismoDia && data.horaVencimiento) {
			const [hora, min] = data.horaVencimiento.split(":").map(Number);
			if (hora !== undefined && min !== undefined) {
				const minutosSeleccionados = hora * 60 + min;
				const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

				if (minutosSeleccionados <= minutosActuales) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "La hora de vencimiento debe ser posterior a la hora actual",
						path: ["horaVencimiento"],
					});
				}
			}
		}
	});

export type GenerarActividadSchemaTipo = z.infer<typeof GenerarActividadSchema>;
