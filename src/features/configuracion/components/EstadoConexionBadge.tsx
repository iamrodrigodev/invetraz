import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import type React from "react";
import { Badge } from "../../../components/ui/Badge";

export type TipoEstadoConexion =
	| "conectado"
	| "guardado_pendiente"
	| "no_configurado"
	| "verificando"
	| "error";

interface EstadoConexionBadgeProps {
	estado: TipoEstadoConexion;
	className?: string;
}

export const EstadoConexionBadge: React.FC<EstadoConexionBadgeProps> = ({
	estado,
	className,
}) => {
	switch (estado) {
		case "conectado":
			return (
				<Badge variant="success" className={className}>
					<CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
					<span>Conexión activa con Google</span>
				</Badge>
			);
		case "guardado_pendiente":
			return (
				<Badge variant="warning" className={className}>
					<AlertCircle size={13} className="shrink-0 text-amber-600" />
					<span>Guardada, no verificada</span>
				</Badge>
			);
		case "verificando":
			return (
				<Badge variant="primary" className={className}>
					<RefreshCw size={13} className="shrink-0 animate-spin text-primary" />
					<span>Verificando conexión...</span>
				</Badge>
			);
		case "error":
			return (
				<Badge variant="destructive" className={className}>
					<XCircle size={13} className="shrink-0 text-red-600" />
					<span>Error de conexión</span>
				</Badge>
			);
		case "no_configurado":
			return (
				<Badge variant="warning" className={className}>
					<AlertCircle size={13} className="shrink-0 text-amber-600" />
					<span>Pendiente de configuración</span>
				</Badge>
			);
		default:
			return null;
	}
};
