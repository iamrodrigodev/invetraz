import {
	BarChart3,
	BookOpen,
	ClipboardCheck,
	LayoutTemplate,
	Settings,
} from "lucide-react";
import type { ItemNavegacion } from "@/components/navigation/types";

export const ELEMENTOS_NAVEGACION: ItemNavegacion[] = [
	{
		id: "actividades",
		titulo: "Actividades de seguimiento",
		etiquetaMenu: "Actividades",
		icono: ClipboardCheck,
		descripcion: "Monitoreo y seguimiento de actividades",
	},
	{
		id: "reportes",
		titulo: "Reportes",
		etiquetaMenu: "Reportes",
		icono: BarChart3,
		descripcion: "Informes y análisis de progreso",
	},
	{
		id: "plantillas",
		titulo: "Plantillas de seguimiento",
		etiquetaMenu: "Plantillas",
		icono: LayoutTemplate,
		descripcion: "Modelos y formatos de registro",
	},
	{
		id: "configuracion",
		titulo: "Configuración del Sistema",
		etiquetaMenu: "Configuración",
		icono: Settings,
		descripcion: "Credenciales y parámetros de integración",
	},
	{
		id: "documentacion",
		titulo: "Documentación de Integración",
		etiquetaMenu: "Documentación",
		icono: BookOpen,
		descripcion: "Guías de Google Classroom y permisos",
	},
];
