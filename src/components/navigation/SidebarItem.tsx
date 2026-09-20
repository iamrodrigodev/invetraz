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
		<div
			className={cn(
				"group/item relative flex w-full justify-center",
				className,
			)}
		>
			<button
				type="button"
				onClick={alHacerClic}
				title={item.titulo}
				className={cn(
					"flex h-11 items-center font-medium text-[15px] transition-all duration-200 ease-in-out cursor-pointer active:scale-98",
					estaColapsado
						? "mx-auto w-11 justify-center rounded-xl"
						: "w-full rounded-lg px-3",
					esActivo
						? "bg-primary text-white shadow-xs"
						: "text-slate-800 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/80",
				)}
			>
				<Icono
					className={cn(
						"h-5 w-5 shrink-0 transition-colors",
						esActivo
							? "text-white"
							: "text-slate-700 group-hover/item:text-slate-900",
					)}
					strokeWidth={esActivo ? 2.5 : 2}
				/>
				<span
					className={cn(
						"inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
						estaColapsado
							? "ml-0 max-w-0 opacity-0"
							: "ml-3 max-w-[180px] opacity-100",
					)}
				>
					{etiqueta}
				</span>
			</button>

			{estaColapsado && (
				<div className="pointer-events-none absolute left-full top-1/2 ml-2.5 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
					{item.titulo}
					<div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
				</div>
			)}
		</div>
	);
}
