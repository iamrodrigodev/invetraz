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
				"flex h-full min-h-[450px] w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12",
				className,
			)}
		>
			<Icono className="mb-6 h-14 w-14 text-primary" strokeWidth={1.5} />
			<h2 className="mb-2 font-extrabold font-heading text-2xl text-slate-900 tracking-tight md:text-3xl">
				{titulo}
			</h2>
			<p className="max-w-md text-slate-600 text-sm leading-relaxed md:text-base">
				{descripcion}
			</p>
		</div>
	);
}
