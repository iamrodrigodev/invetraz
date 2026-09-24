import type { LucideIcon } from "lucide-react";
import { z } from "zod";

export const ModuloIdSchema = z.enum([
	"actividades",
	"reportes",
	"plantillas",
	"configuracion",
	"documentacion",
]);

export type ModuloId = z.infer<typeof ModuloIdSchema>;

export type ItemNavegacion = {
	id: ModuloId;
	titulo: string;
	icono: LucideIcon;
	etiquetaMenu?: string;
	descripcion?: string;
};
