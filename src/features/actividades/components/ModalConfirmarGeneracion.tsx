import {
	AlignLeft,
	BookOpen,
	Calendar,
	Check,
	CheckCircle2,
	ExternalLink,
	FileSpreadsheet,
	GraduationCap,
	RefreshCw,
	Tag,
	X,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Modal } from "@/components/ui/Modal.tsx";
import type { ResumenConfirmacionActividad } from "@/features/actividades/types/actividades.types.ts";

export interface ModalConfirmarGeneracionProps {
	abierto: boolean;
	cargando: boolean;
	resumen: ResumenConfirmacionActividad | null;
	alConfirmar: () => void;
	alCerrar: () => void;
}

function formatearHora12(horaStr: string): string {
	if (!horaStr) {
		return "";
	}
	try {
		const partes = horaStr.split(":").map(Number);
		const horasRaw = partes[0];
		const minutosRaw = partes[1];
		if (
			horasRaw !== undefined &&
			minutosRaw !== undefined &&
			!Number.isNaN(horasRaw) &&
			!Number.isNaN(minutosRaw)
		) {
			const horas24 = horasRaw;
			const minutos = String(minutosRaw).padStart(2, "0");
			const periodo = horas24 >= 12 ? "pm" : "am";
			const horas12 = horas24 % 12 === 0 ? 12 : horas24 % 12;
			return `${horas12}:${minutos} ${periodo}`;
		}
	} catch {}
	return horaStr;
}

function formatearFechaVencimiento(fechaStr: string, horaStr?: string): string {
	if (!fechaStr) {
		return "-";
	}
	const horaFormateada = formatearHora12(horaStr ?? "");
	try {
		const partes = fechaStr.split("-").map(Number);
		if (partes.length === 3 && partes[0] && partes[1] && partes[2]) {
			const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
			const textoFecha = new Intl.DateTimeFormat("es-PE", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(fecha);
			return horaFormateada ? `${textoFecha} a las ${horaFormateada}` : textoFecha;
		}
	} catch {}
	return horaFormateada ? `${fechaStr} a las ${horaFormateada}` : fechaStr;
}

export const ModalConfirmarGeneracion: React.FC<ModalConfirmarGeneracionProps> = ({
	abierto,
	cargando,
	resumen,
	alConfirmar,
	alCerrar,
}) => {
	if (!resumen) {
		return null;
	}

	const fechaHoraTexto = formatearFechaVencimiento(
		resumen.fechaVencimiento,
		resumen.horaVencimiento,
	);

	return (
		<Modal
			abierto={abierto}
			alCerrar={() => {
				if (!cargando) {
					alCerrar();
				}
			}}
			titulo="Confirmar actividad de seguimiento"
			className="max-w-lg"
		>
			<div className="space-y-4">
				<p className="-mt-2 text-slate-600 text-sm">
					Revisa la información antes de generar la actividad de seguimiento.
				</p>

				<div className="space-y-3.5 pt-1">
					<div className="flex items-start gap-3">
						<GraduationCap size={18} className="mt-0.5 shrink-0 text-primary" />
						<div className="min-w-0 flex-1">
							<span className="block font-medium text-slate-500 text-xs">Clase</span>
							<span className="wrap-break-word font-semibold text-slate-900 text-sm leading-snug">
								{resumen.nombreClase}
							</span>
						</div>
					</div>

					<div className="flex items-start gap-3 border-slate-100 border-t pt-3">
						<BookOpen size={18} className="mt-0.5 shrink-0 text-primary" />
						<div className="min-w-0 flex-1">
							<span className="block font-medium text-slate-500 text-xs">Título</span>
							<span className="wrap-break-word font-semibold text-slate-900 text-sm leading-snug">
								{resumen.titulo}
							</span>
						</div>
					</div>

					<div className="flex items-start justify-between gap-3 border-slate-100 border-t pt-3">
						<div className="flex min-w-0 flex-1 items-start gap-3">
							<FileSpreadsheet size={18} className="mt-0.5 shrink-0 text-emerald-600" />
							<div className="min-w-0 flex-1 space-y-1">
								<span className="block font-medium text-slate-500 text-xs">
									Plantilla de seguimiento
								</span>
								<div className="flex flex-wrap items-center gap-2">
									<span className="wrap-break-word font-semibold text-slate-900 text-sm leading-snug">
										{resumen.nombrePlantilla}
									</span>
									<Badge
										variant="success"
										className="inline-flex shrink-0 items-center gap-1 px-1.5 py-0 font-semibold text-[10px] uppercase tracking-wider"
									>
										<FileSpreadsheet size={10} className="shrink-0" />
										{resumen.esGoogleSheet ? "Google Sheets" : "XLSX"}
									</Badge>
									<Badge
										variant="success"
										className="inline-flex shrink-0 items-center gap-1 px-1.5 py-0 font-medium text-[10px]"
									>
										<CheckCircle2 size={10} />
										Estructura válida
									</Badge>
								</div>
							</div>
						</div>

						{resumen.enlacePlantillaWeb && (
							<a
								href={resumen.enlacePlantillaWeb}
								target="_blank"
								rel="noreferrer"
								className="shrink-0 self-center"
							>
								<Button
									type="button"
									variant="default"
									size="sm"
									className="h-7 font-semibold text-xs shadow-xs"
								>
									<ExternalLink size={12} className="mr-1.5" />
									Abrir plantilla
								</Button>
							</a>
						)}
					</div>

					<div className="flex items-start gap-3 border-slate-100 border-t pt-3">
						<Calendar size={18} className="mt-0.5 shrink-0 text-primary" />
						<div className="min-w-0 flex-1">
							<span className="block font-medium text-slate-500 text-xs">Fecha de vencimiento</span>
							<div className="font-semibold text-slate-900 text-sm">{fechaHoraTexto}</div>
						</div>
					</div>

					{resumen.nombreTema && (
						<div className="flex items-start gap-3 border-slate-100 border-t pt-3">
							<Tag size={18} className="mt-0.5 shrink-0 text-primary" />
							<div className="min-w-0 flex-1">
								<span className="block font-medium text-slate-500 text-xs">Tema</span>
								<span className="font-medium text-slate-800 text-sm">{resumen.nombreTema}</span>
							</div>
						</div>
					)}

					{resumen.descripcion && (
						<div className="flex items-start gap-3 border-slate-100 border-t pt-3">
							<AlignLeft size={18} className="mt-0.5 shrink-0 text-primary" />
							<div className="min-w-0 flex-1">
								<span className="block font-medium text-slate-500 text-xs">Descripción</span>
								<p className="max-h-24 overflow-y-auto whitespace-pre-wrap font-normal text-slate-800 text-sm leading-relaxed">
									{resumen.descripcion}
								</p>
							</div>
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-3 border-slate-100 border-t pt-3">
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
