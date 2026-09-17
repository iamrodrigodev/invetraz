import { Menu } from "lucide-react";
import type { ModuloId } from "../../types/navigation";
import { cn } from "../../utils/cn";
import { ELEMENTOS_NAVEGACION } from "./Sidebar";

export interface TopBarProps {
	moduloActivo: ModuloId;
	alAbrirMenuMovil?: () => void;
	className?: string;
}

export function TopBar({
	moduloActivo,
	alAbrirMenuMovil,
	className,
}: TopBarProps) {
	const elementoActual = ELEMENTOS_NAVEGACION.find(
		(item) => item.id === moduloActivo,
	);
	const titulo = elementoActual?.titulo || "GCC Investigación";

	return (
		<header
			className={cn(
				"relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8",
				className,
			)}
		>
			<div className="flex items-center gap-3 md:gap-4">
				{/* Botón menú móvil */}
				<button
					type="button"
					onClick={alAbrirMenuMovil}
					aria-label="Abrir menú de navegación"
					className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden cursor-pointer"
				>
					<Menu className="h-5 w-5" />
				</button>

				{/* Título de la vista actual */}
				<div className="flex items-center gap-2">
					<span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-400 sm:inline">
						GCC Inv
					</span>
					<span className="hidden text-slate-300 sm:inline">/</span>
					<h1 className="font-heading text-base font-semibold text-slate-800 md:text-lg">
						{titulo}
					</h1>
				</div>
			</div>

			{/* Navbar limpio sin perfil */}
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
					<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
					<span>Sistema Activo</span>
				</div>
			</div>
		</header>
	);
}
