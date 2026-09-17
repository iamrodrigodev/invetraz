import {
	BarChart3,
	ChevronLeft,
	ChevronRight,
	ClipboardCheck,
	LayoutTemplate,
} from "lucide-react";
import type { ItemNavegacion, ModuloId } from "../../types/navigation";
import { cn } from "../../utils/cn";
import { Logo } from "./Logo";

export const ELEMENTOS_NAVEGACION: ItemNavegacion[] = [
	{
		id: "actividades",
		titulo: "Actividades de seguimiento",
		icono: ClipboardCheck,
		descripcion: "Monitoreo y seguimiento de actividades",
	},
	{
		id: "reportes",
		titulo: "Reportes",
		icono: BarChart3,
		descripcion: "Informes y análisis de progreso",
	},
	{
		id: "plantillas",
		titulo: "Plantillas de seguimiento",
		icono: LayoutTemplate,
		descripcion: "Modelos y formatos de registro",
	},
];

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
				estaColapsado ? "w-20" : "w-64",
				className,
			)}
		>
			{/* Botón flotante para colapsar/expandir en desktop */}
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

			{/* Cabecera del sidebar */}
			<div
				className={cn(
					"flex h-16 shrink-0 items-center border-b border-slate-200",
					estaColapsado ? "justify-center px-2" : "px-6",
				)}
			>
				<Logo estaColapsado={estaColapsado} />
			</div>

			{/* Navegación */}
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

interface SidebarItemProps {
	item: ItemNavegacion;
	esActivo: boolean;
	estaColapsado: boolean;
	alHacerClic: () => void;
}

function SidebarItem({
	item,
	esActivo,
	estaColapsado,
	alHacerClic,
}: SidebarItemProps) {
	const Icono = item.icono;

	return (
		<div className="group/item relative flex w-full justify-center">
			<button
				type="button"
				onClick={alHacerClic}
				className={cn(
					"flex h-11 items-center font-medium text-[15px] transition-all duration-200 ease-in-out cursor-pointer",
					estaColapsado
						? "mx-auto w-11 justify-center rounded-xl"
						: "w-full rounded-lg px-3",
					esActivo
						? "bg-primary text-white shadow-xs"
						: "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
				)}
			>
				<Icono
					className={cn(
						"h-5 w-5 shrink-0 transition-colors",
						esActivo
							? "text-white"
							: "text-slate-500 group-hover/item:text-slate-900",
					)}
					strokeWidth={esActivo ? 2.5 : 2}
				/>
				<span
					className={cn(
						"overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out",
						estaColapsado ? "ml-0 w-0 opacity-0" : "ml-3 w-auto opacity-100",
					)}
				>
					{item.titulo}
				</span>
			</button>

			{/* Tooltip al estar colapsado */}
			{estaColapsado && (
				<div className="pointer-events-none absolute left-full top-1/2 ml-2.5 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-md opacity-0 group-hover/item:opacity-100 transition-opacity duration-150">
					{item.titulo}
					<div className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
				</div>
			)}
		</div>
	);
}
