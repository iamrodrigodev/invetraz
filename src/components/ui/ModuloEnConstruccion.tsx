import { Hammer, type LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ModuloEnConstruccionProps {
	titulo: string;
	descripcion?: string;
	icono?: LucideIcon;
	className?: string;
}

export function ModuloEnConstruccion({
	titulo,
	descripcion = "Estamos trabajando arduamente en este módulo. Muy pronto podrás disfrutar de todas sus funcionalidades. ¡Gracias por tu paciencia!",
	icono: Icono = Hammer,
	className,
}: ModuloEnConstruccionProps) {
	return (
		<div
			className={cn(
				"flex w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12",
				className,
			)}
		>
			<div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary">
				<Icono className="h-10 w-10" strokeWidth={1.75} />
			</div>
			<h2 className="mb-2 font-extrabold font-heading text-2xl text-slate-900 tracking-tight md:text-3xl">
				{titulo}
			</h2>
			<p className="max-w-md text-slate-500 text-sm leading-relaxed md:text-base">
				{descripcion}
			</p>
			<div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-700">
				<span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
				<span>Módulo en construcción</span>
			</div>
		</div>
	);
}
