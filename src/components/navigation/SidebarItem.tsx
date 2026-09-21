import { cn } from "../../utils/cn";
import type { ItemNavegacion } from "./types";

export interface SidebarItemProps {
	item: ItemNavegacion;
	esActivo: boolean;
	estaColapsado: boolean;
	alHacerClic: () => void;
	className?: string;
}

export function SidebarItem({
	item,
	esActivo,
	estaColapsado,
	alHacerClic,
	className,
}: SidebarItemProps) {
	const Icono = item.icono;
	const etiqueta = item.etiquetaMenu ?? item.titulo;

	return (
		<div className={cn("group/item relative flex w-full", className)}>
			<button
				type="button"
				onClick={alHacerClic}
				aria-label={item.titulo}
				aria-current={esActivo ? "page" : undefined}
				className={cn(
					"flex h-11 w-full items-center rounded-xl font-medium text-[15px] transition-colors duration-150 ease-in-out cursor-pointer overflow-hidden",
					esActivo
						? "bg-primary text-white shadow-xs"
						: "text-slate-800 hover:bg-slate-100 hover:text-slate-900",
				)}
			>
				<div className="flex h-11 w-11 shrink-0 items-center justify-center">
					<Icono
						className={cn(
							"h-5 w-5 shrink-0 transition-colors",
							esActivo
								? "text-white"
								: "text-slate-700 group-hover/item:text-slate-900",
						)}
						strokeWidth={2.2}
					/>
				</div>
				<span
					className={cn(
						"overflow-hidden whitespace-nowrap transition-[margin,max-width,opacity] duration-300 ease-in-out text-left",
						estaColapsado
							? "ml-0 max-w-0 opacity-0"
							: "ml-1.5 max-w-45 opacity-100",
					)}
				>
					{etiqueta}
				</span>
			</button>

			{estaColapsado && (
				<div className="pointer-events-none absolute left-full top-1/2 ml-2.5 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
					{item.titulo}
					<div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-primary" />
				</div>
			)}
		</div>
	);
}
