import { KeyRound, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ELEMENTOS_NAVEGACION } from "../../constants/navigation";
import { ModalCambiarClave } from "../../features/auth/components/ModalCambiarClave";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";
import type { ModuloId } from "./types";

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
	const navigate = useNavigate();
	const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);
	const [modalClaveAbierto, setModalClaveAbierto] = useState(false);
	const elementoActual = ELEMENTOS_NAVEGACION.find(
		(item) => item.id === moduloActivo,
	);
	const titulo = elementoActual?.titulo || "Sistema de Investigación";

	const cerrarSesion = async () => {
		await cerrarSesionStore();
		navigate("/login", { replace: true });
	};

	return (
		<>
			<header
				className={cn(
					"relative z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8",
					className,
				)}
			>
				<div className="flex items-center gap-3 md:gap-4">
					<button
						type="button"
						onClick={alAbrirMenuMovil}
						aria-label="Abrir menú de navegación"
						className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden cursor-pointer"
					>
						<Menu className="h-5 w-5" />
					</button>

					<h1 className="font-heading text-base font-semibold text-slate-800 md:text-lg">
						{titulo}
					</h1>
				</div>

				<div className="flex items-center gap-2.5">
					<button
						type="button"
						onClick={() => setModalClaveAbierto(true)}
						className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 px-3.5 py-1.5 font-medium text-xs text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-100/70 hover:text-slate-900 active:scale-98 cursor-pointer sm:text-sm"
					>
						<KeyRound
							className="h-4 w-4 shrink-0 text-primary"
							strokeWidth={2.2}
						/>
						<span className="hidden sm:inline">Cambiar Contraseña</span>
					</button>

					<button
						type="button"
						onClick={cerrarSesion}
						className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-1.5 font-medium text-xs text-white shadow-2xs transition-all hover:bg-red-700 active:scale-98 cursor-pointer sm:text-sm"
					>
						<LogOut className="h-4 w-4 shrink-0 text-white" strokeWidth={2.2} />
						<span className="hidden sm:inline">Cerrar Sesión</span>
					</button>
				</div>
			</header>

			<ModalCambiarClave
				abierto={modalClaveAbierto}
				alCerrar={() => setModalClaveAbierto(false)}
			/>
		</>
	);
}
