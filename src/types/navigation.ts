import type { LucideIcon } from "lucide-react";

export type ModuloId = "actividades" | "reportes" | "plantillas";

export interface ItemNavegacion {
	id: ModuloId;
	titulo: string;
	etiquetaMenu?: string;
	icono: LucideIcon;
	descripcion?: string;
}
