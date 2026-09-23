import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, KeyRound, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ModuloId } from "@/components/navigation/types.ts";
import { Badge } from "@/components/ui/Badge.tsx";
import { ELEMENTOS_NAVEGACION } from "@/constants/navigation.ts";
import { ModalCambiarClave } from "@/features/auth/components/ModalCambiarClave.tsx";
import { useClickOutside } from "@/hooks/useClickOutside.ts";
import { useAppStore } from "@/store/useAppStore.ts";
import { cn } from "@/utils/cn.ts";

export interface TopBarProps {
	moduloActivo: ModuloId;
	alAbrirMenuMovil?: () => void;
	className?: string;
	alSolicitarCerrarSesion?: () => void;
	mostrarBotonMenuMovil?: boolean;
}

export function TopBar({
	moduloActivo,
	alAbrirMenuMovil,
	className,
	alSolicitarCerrarSesion,
	mostrarBotonMenuMovil = true,
}: TopBarProps) {
	const navigate = useNavigate();
	const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);
	const usuarioEmail = useAppStore((state) => state.usuarioEmail);
	const [modalClaveAbierto, setModalClaveAbierto] = useState(false);
	const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useClickOutside(menuRef, () => setMenuUsuarioAbierto(false), menuUsuarioAbierto);

	const elementoActual = ELEMENTOS_NAVEGACION.find((item) => item.id === moduloActivo);
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
					"relative z-10 flex h-16 shrink-0 items-center justify-between border-slate-200 border-b bg-white px-4 lg:px-8",
					className,
				)}
			>
				<div className="flex items-center gap-3 md:gap-4">
					{mostrarBotonMenuMovil && (
						<button
							type="button"
							onClick={alAbrirMenuMovil}
							aria-label="Abrir menú de navegación"
							className="-ml-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 active:scale-95 md:hidden"
						>
							<Menu className="h-5 w-5" />
						</button>
					)}

					<h1 className="font-heading font-semibold text-base text-slate-800 md:text-lg">
						{titulo}
					</h1>
				</div>

				<div className="relative" ref={menuRef}>
					<button
						type="button"
						onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
						className="flex cursor-pointer items-center gap-3 rounded-2xl p-1.5 pr-2.5 transition-all hover:bg-slate-100/80 active:scale-98"
					>
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white text-xs shadow-2xs">
							{iniciales}
						</div>

						<div className="hidden flex-col items-start text-left sm:flex">
							<span className="max-w-40 truncate font-semibold text-slate-800 text-xs md:max-w-50 md:text-sm">
								{emailMostrar}
							</span>
							<Badge variant="primary" className="gap-1 px-2 py-0.5 text-[10px] tracking-normal">
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
								className="absolute top-full right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200/80 bg-white p-1.5 font-sans shadow-slate-900/10 shadow-xl"
							>
								<div className="mb-1 border-slate-100 border-b px-3 py-2 sm:hidden">
									<p className="truncate font-semibold text-slate-800 text-xs">{emailMostrar}</p>
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
									className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700 text-xs transition-all duration-150 hover:bg-slate-100/80 active:scale-98 active:bg-slate-200/70 sm:text-sm"
								>
									<KeyRound className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
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
									className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-red-600 text-xs transition-all duration-150 hover:bg-red-50 hover:text-red-700 active:scale-98 active:bg-red-100/80 sm:text-sm"
								>
									<LogOut className="h-4 w-4 shrink-0 text-red-500" strokeWidth={2.2} />
									<span>Cerrar Sesión</span>
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</header>

			<ModalCambiarClave abierto={modalClaveAbierto} alCerrar={() => setModalClaveAbierto(false)} />
		</>
	);
}
