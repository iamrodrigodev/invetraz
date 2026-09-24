import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn.ts";

export type EstadoBadgeEnvio = "enviando" | "exito" | "error";

export type BadgeNotificacionEnvioProps = {
	visible: boolean;
	estado: EstadoBadgeEnvio;
	tituloTarea: string;
	onOcultar?: () => void;
};

export const BadgeNotificacionEnvio: React.FC<BadgeNotificacionEnvioProps> = ({
	visible,
	estado,
	tituloTarea,
	onOcultar,
}) => {
	const [mostrar, setMostrar] = useState(visible);

	useEffect(() => {
		if (visible) {
			setMostrar(true);
		} else {
			setMostrar(false);
		}
	}, [visible]);

	useEffect(() => {
		if (estado === "exito" && visible) {
			const timer = setTimeout(() => {
				setMostrar(false);
				if (onOcultar) {
					onOcultar();
				}
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [estado, visible, onOcultar]);

	if (!mostrar) {
		return null;
	}

	return (
		<aside
			aria-label="Estado de envío de actividad"
			className="pointer-events-none fixed right-4 bottom-5 z-50 flex items-center justify-end sm:right-6"
		>
			<div
				className={cn(
					"pointer-events-auto flex max-w-sm items-center gap-2.5 rounded-full px-4 py-2.5 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 sm:max-w-md",
					estado === "enviando" &&
						"border border-primary-200 bg-white text-slate-800 ring-1 ring-primary/10",
					estado === "exito" &&
						"border border-emerald-200 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500/20",
					estado === "error" &&
						"border border-red-200 bg-red-50 text-red-900 ring-1 ring-red-500/20",
				)}
			>
				<div className="shrink-0">
					{estado === "enviando" && <Loader2 size={16} className="animate-spin text-primary" />}
					{estado === "exito" && <CheckCircle2 size={16} className="text-emerald-600" />}
					{estado === "error" && <XCircle size={16} className="text-red-600" />}
				</div>

				<div className="min-w-0 flex-1 truncate text-xs">
					{estado === "enviando" && (
						<span>
							<span className="font-semibold text-slate-900">Enviando tarea:</span>{" "}
							<span className="truncate text-slate-600 font-medium">"{tituloTarea}"</span>
						</span>
					)}
					{estado === "exito" && (
						<span>
							<span className="font-semibold text-emerald-800">Tarea enviada:</span>{" "}
							<span className="truncate text-emerald-700 font-medium">"{tituloTarea}"</span>
						</span>
					)}
					{estado === "error" && (
						<span>
							<span className="font-semibold text-red-800">Error al enviar:</span>{" "}
							<span className="truncate text-red-700 font-medium">"{tituloTarea}"</span>
						</span>
					)}
				</div>
			</div>
		</aside>
	);
};

export default BadgeNotificacionEnvio;
