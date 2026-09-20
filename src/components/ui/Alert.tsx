import { type HTMLMotionProps, motion } from "framer-motion";
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	Info,
	X,
} from "lucide-react";
import type React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps
	extends Omit<
		HTMLMotionProps<"div">,
		"initial" | "animate" | "exit" | "transition"
	> {
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
			estilos: "bg-red-50/90 border border-red-200 text-red-900 shadow-2xs",
			icono: <AlertCircle size={18} className="shrink-0 text-red-600" />,
		},
		success: {
			estilos:
				"bg-emerald-50/90 border border-emerald-200 text-emerald-900 shadow-2xs",
			icono: <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />,
		},
		warning: {
			estilos:
				"bg-amber-50/90 border border-amber-200 text-amber-900 shadow-2xs",
			icono: <AlertTriangle size={18} className="shrink-0 text-amber-600" />,
		},
		info: {
			estilos: "bg-blue-50/90 border border-blue-200 text-blue-900 shadow-2xs",
			icono: <Info size={18} className="shrink-0 text-blue-600" />,
		},
	}[variant];

	return (
		<motion.div
			initial={{ opacity: 0, y: -10, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -8, scale: 0.98 }}
			transition={{ duration: 0.22, ease: "easeOut" }}
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
				>
					<X size={16} />
				</button>
			)}
		</motion.div>
	);
};

export default Alert;
