import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
	X,
} from "lucide-react";
import type React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	message: string;
	variant?: "error" | "success" | "warning" | "info";
	onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
	message,
	variant = "error",
	onClose,
	className,
	...props
}) => {
	const config = {
		error: {
			estilos: "bg-red-50 border border-red-200 text-red-700",
			icono: <AlertCircle size={18} className="shrink-0 text-red-600" />,
		},
		success: {
			estilos: "bg-emerald-50 border border-emerald-200 text-emerald-700",
			icono: <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />,
		},
		warning: {
			estilos: "bg-amber-50 border border-amber-200 text-amber-800",
			icono: <AlertTriangle size={18} className="shrink-0 text-amber-600" />,
		},
		info: {
			estilos: "bg-blue-50 border border-blue-200 text-blue-700",
			icono: <Info size={18} className="shrink-0 text-blue-600" />,
		},
	}[variant];

	return (
		<div
			role="alert"
			className={cn(
				"flex items-center justify-between gap-3 rounded-xl p-3.5 text-sm font-medium transition-colors",
				config.estilos,
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-2.5 min-w-0 flex-1">
				{config.icono}
				<span className="leading-snug break-words">{message}</span>
			</div>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="inline-flex shrink-0 cursor-pointer rounded-lg p-1 opacity-70 transition-all hover:opacity-100 hover:bg-black/5 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-current"
					aria-label="Cerrar notificación"
					title="Cerrar"
				>
					<X size={16} />
				</button>
			)}
		</div>
	);
};

export default Alert;
