import {
	BookOpen,
	Calendar,
	Check,
	CheckCircle2,
	Clock,
	FileSpreadsheet,
	GraduationCap,
	RefreshCw,
	Tag,
	X,
} from "lucide-react";
import type React from "react";
import { Badge, Button, Modal } from "../../../components/ui";
import type { ResumenConfirmacionActividad } from "../types/actividades.types";

export interface ModalConfirmarGeneracionProps {
	abierto: boolean;
	cargando: boolean;
	resumen: ResumenConfirmacionActividad | null;
	alConfirmar: () => void;
	alCerrar: () => void;
}

function formatearFechaVencimiento(fechaStr: string, horaStr?: string): string {
	if (!fechaStr) return "-";
	try {
		const partes = fechaStr.split("-").map(Number);
		if (partes.length === 3 && partes[0] && partes[1] && partes[2]) {
			const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
			const textoFecha = new Intl.DateTimeFormat("es-PE", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(fecha);
			return horaStr ? `${textoFecha} a las ${horaStr}` : textoFecha;
		}
	} catch {}
	return horaStr ? `${fechaStr} a las ${horaStr}` : fechaStr;
}

export const ModalConfirmarGeneracion: React.FC<
	ModalConfirmarGeneracionProps
> = ({ abierto, cargando, resumen, alConfirmar, alCerrar }) => {
	if (!resumen) return null;

	const fechaHoraTexto = formatearFechaVencimiento(
		resumen.fechaVencimiento,
		resumen.horaVencimiento,
	);

	return (
		<Modal
			abierto={abierto}
			alCerrar={() => {
				if (!cargando) alCerrar();
			}}
			titulo="Confirmar actividad de seguimiento"
			className="max-w-lg"
		>
			<div className="space-y-4">
				<p className="-mt-2 text-sm text-slate-600">
					Revisa la información antes de generar la actividad de seguimiento.
				</p>

				<div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3.5 shadow-xs">
					<div className="flex items-start gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
							<GraduationCap size={16} />
						</div>
						<div className="min-w-0 flex-1">
							<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
								Clase
							</span>
							<span className="text-sm font-semibold text-slate-900 break-words leading-snug">
								{resumen.nombreClase}
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 pt-3 border-t border-slate-100">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
							<BookOpen size={16} />
						</div>
						<div className="min-w-0 flex-1">
							<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
								Título
							</span>
							<span className="text-sm font-semibold text-slate-900 break-words leading-snug">
								{resumen.titulo}
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 pt-3 border-t border-slate-100">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
							<FileSpreadsheet size={16} />
						</div>
						<div className="min-w-0 flex-1 space-y-1">
							<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
								Plantilla de seguimiento
							</span>
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-sm font-semibold text-slate-900 break-words leading-snug">
									{resumen.nombrePlantilla}
								</span>
								<Badge
									variant="success"
									className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0 shrink-0 font-medium"
								>
									<CheckCircle2 size={10} />
									Estructura válida
								</Badge>
							</div>
						</div>
					</div>

					<div className="flex items-start gap-3 pt-3 border-t border-slate-100">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
							<Calendar size={16} />
						</div>
						<div className="min-w-0 flex-1">
							<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
								Fecha de vencimiento
							</span>
							<div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
								<span>{fechaHoraTexto}</span>
								{resumen.horaVencimiento && (
									<Clock size={13} className="text-slate-400 shrink-0" />
								)}
							</div>
						</div>
					</div>

					{resumen.nombreTema && (
						<div className="flex items-start gap-3 pt-3 border-t border-slate-100">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
								<Tag size={16} />
							</div>
							<div className="min-w-0 flex-1">
								<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									Tema
								</span>
								<span className="text-sm font-medium text-slate-800">
									{resumen.nombreTema}
								</span>
							</div>
						</div>
					)}

					{resumen.descripcion && (
						<div className="pt-3 border-t border-slate-100">
							<div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 space-y-1">
								<span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
									Descripción
								</span>
								<p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-24 overflow-y-auto">
									{resumen.descripcion}
								</p>
							</div>
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="ghost"
						onClick={alCerrar}
						disabled={cargando}
						className="font-medium text-slate-600 hover:text-slate-800"
					>
						<X size={16} className="mr-1.5" />
						Cancelar
					</Button>
					<Button
						type="button"
						variant="default"
						onClick={alConfirmar}
						disabled={cargando}
						className="font-semibold shadow-sm"
					>
						{cargando ? (
							<>
								<RefreshCw size={16} className="mr-2 animate-spin" />
								Generando actividad de seguimiento
							</>
						) : (
							<>
								<Check size={16} className="mr-1.5" />
								Confirmar
							</>
						)}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalConfirmarGeneracion;
