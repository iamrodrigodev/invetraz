import type { LucideIcon } from "lucide-react";

export type ModuloId = "actividades" | "reportes" | "plantillas";

export interface ItemNavegacion {
	id: ModuloId;
	titulo: string;
	icono: LucideIcon;
	etiquetaMenu?: string;
	descripcion?: string;
}
