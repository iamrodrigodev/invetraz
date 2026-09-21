import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, KeyRound, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ELEMENTOS_NAVEGACION } from "../../constants/navigation";
import { ModalCambiarClave } from "../../features/auth/components/ModalCambiarClave";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAppStore } from "../../store/useAppStore";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";
import type { ModuloId } from "./types";

export interface TopBarProps {
	moduloActivo: ModuloId;
	alAbrirMenuMovil?: () => void;
	className?: string;
	alSolicitarCerrarSesion?: () => void;
}

export function TopBar({
	moduloActivo,
	alAbrirMenuMovil,
	className,
	alSolicitarCerrarSesion,
}: TopBarProps) {
	const navigate = useNavigate();
	const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);
	const usuarioEmail = useAppStore((state) => state.usuarioEmail);
	const [modalClaveAbierto, setModalClaveAbierto] = useState(false);
	const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useClickOutside(
		menuRef,
		() => setMenuUsuarioAbierto(false),
		menuUsuarioAbierto,
	);

	const elementoActual = ELEMENTOS_NAVEGACION.find(
		(item) => item.id === moduloActivo,
	);
	const titulo = elementoActual?.titulo || "Sistema de Investigación";
	const emailMostrar = usuarioEmail || "Administrador";
	const iniciales = emailMostrar.substring(0, 2).toUpperCase();

	const cerrarSesion = async () => {
		setMenuUsuarioAbierto(false);
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
						className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 lg:hidden cursor-pointer"
					>
						<Menu className="h-5 w-5" />
					</button>

					<h1 className="font-heading text-base font-semibold text-slate-800 md:text-lg">
						{titulo}
					</h1>
				</div>

				<div className="relative" ref={menuRef}>
					<button
						type="button"
						onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
						className="flex items-center gap-3 rounded-2xl p-1.5 pr-2.5 transition-all hover:bg-slate-100/80 active:scale-98 cursor-pointer"
					>
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-xs text-white shadow-2xs">
							{iniciales}
						</div>

						<div className="hidden flex-col items-start text-left sm:flex">
							<span className="max-w-40 truncate font-semibold text-xs text-slate-800 md:max-w-50 md:text-sm">
								{emailMostrar}
							</span>
							<Badge
								variant="primary"
								className="gap-1 px-2 py-0.5 text-[10px] tracking-normal"
							>
								<ShieldCheck className="h-3 w-3" strokeWidth={2.2} />
								ADMINISTRADOR
							</Badge>
						</div>

						<ChevronDown
							className={cn(
								"h-4 w-4 text-slate-400 transition-transform duration-200",
								menuUsuarioAbierto && "rotate-180 text-slate-600",
							)}
						/>
					</button>

					<AnimatePresence>
						{menuUsuarioAbierto && (
							<motion.div
								initial={{ opacity: 0, y: 8, scale: 0.96 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 6, scale: 0.96 }}
								transition={{ duration: 0.15, ease: "easeOut" }}
								className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50 font-sans"
							>
								<div className="px-3 py-2 sm:hidden border-b border-slate-100 mb-1">
									<p className="truncate font-semibold text-xs text-slate-800">
										{emailMostrar}
									</p>
									<Badge
										variant="primary"
										className="mt-1 gap-1 px-2 py-0.5 text-[10px] tracking-normal"
									>
										<ShieldCheck className="h-3 w-3" strokeWidth={2.2} />
										ADMINISTRADOR
									</Badge>
								</div>

								<button
									type="button"
									onClick={() => {
										setMenuUsuarioAbierto(false);
										setModalClaveAbierto(true);
									}}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 transition-all duration-150 hover:bg-slate-100/80 active:bg-slate-200/70 active:scale-98 cursor-pointer sm:text-sm"
								>
									<KeyRound
										className="h-4 w-4 text-primary shrink-0"
										strokeWidth={2.2}
									/>
									<span>Cambiar Contraseña</span>
								</button>

								<div className="my-1 h-px bg-slate-100" />

								<button
									type="button"
									onClick={() => {
										setMenuUsuarioAbierto(false);
										if (alSolicitarCerrarSesion) {
											alSolicitarCerrarSesion();
										} else {
											cerrarSesion();
										}
									}}
									className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-red-600 transition-all duration-150 hover:bg-red-50 hover:text-red-700 active:bg-red-100/80 active:scale-98 cursor-pointer sm:text-sm"
								>
									<LogOut
										className="h-4 w-4 text-red-500 shrink-0"
										strokeWidth={2.2}
									/>
									<span>Cerrar Sesión</span>
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</header>

			<ModalCambiarClave
				abierto={modalClaveAbierto}
				alCerrar={() => setModalClaveAbierto(false)}
			/>
		</>
	);
}
