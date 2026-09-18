import { ChevronLeft, ChevronRight } from "lucide-react";
import { ELEMENTOS_NAVEGACION } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import type { ModuloId } from "./types";

export { ELEMENTOS_NAVEGACION };

export interface SidebarProps {
	moduloActivo: ModuloId;
	alSeleccionarModulo: (id: ModuloId) => void;
	estaColapsado: boolean;
	alAlternarColapso: () => void;
	className?: string;
}

export function Sidebar({
	moduloActivo,
	alSeleccionarModulo,
	estaColapsado,
	alAlternarColapso,
	className,
}: SidebarProps) {
	return (
		<aside
			className={cn(
				"relative flex h-full flex-col border-r border-slate-200 bg-white text-slate-600 transition-all duration-300 ease-in-out select-none",
				estaColapsado ? "w-20" : "w-72",
				className,
			)}
		>
			<button
				type="button"
				onClick={alAlternarColapso}
				aria-label={
					estaColapsado ? "Expandir barra lateral" : "Colapsar barra lateral"
				}
				className="absolute -right-3.5 top-5 z-20 hidden h-7 w-7 items-center justify-center rounded-full border-2 border-slate-50 bg-primary text-white shadow-xs transition-transform hover:bg-primary-700 active:scale-95 lg:flex cursor-pointer"
			>
				{estaColapsado ? (
					<ChevronRight size={15} strokeWidth={2.5} />
				) : (
					<ChevronLeft size={15} strokeWidth={2.5} />
				)}
			</button>

			<div
				className={cn(
					"flex h-16 shrink-0 items-center border-b border-slate-200",
					estaColapsado ? "justify-center px-2" : "px-6",
				)}
			>
				<Logo estaColapsado={estaColapsado} />
			</div>

			<nav
				className={cn(
					"flex-1 space-y-1.5 overflow-y-auto py-6",
					estaColapsado ? "px-2" : "px-3",
				)}
			>
				{ELEMENTOS_NAVEGACION.map((item) => (
					<SidebarItem
						key={item.id}
						item={item}
						esActivo={moduloActivo === item.id}
						estaColapsado={estaColapsado}
						alHacerClic={() => alSeleccionarModulo(item.id)}
					/>
				))}
			</nav>
		</aside>
	);
}
