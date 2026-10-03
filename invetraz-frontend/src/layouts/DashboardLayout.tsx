import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { precargarTodosLosModulos } from "@/components/navigation/precargaModulos.ts";
import { Sidebar } from "@/components/navigation/Sidebar.tsx";
import { TopBar } from "@/components/navigation/TopBar.tsx";
import { type ModuloId, ModuloIdSchema } from "@/components/navigation/types.ts";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion.tsx";
import { ModuloContenidoSkeleton } from "@/components/ui/skeletons/DashboardSkeleton.tsx";
import { useAppStore } from "@/store/useAppStore.ts";
import { cn } from "@/utils/cn.ts";

const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;

export type DashboardLayoutProps = {
	moduloActivo?: ModuloId;
	alCambiarModulo?: (modulo: ModuloId) => void;
	children?: React.ReactNode;
};

export function DashboardLayout({
	moduloActivo,
	alCambiarModulo,
	children,
}: DashboardLayoutProps = {}) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const cerrarSesionStore = useAppStore((state) => state.cerrarSesion);
	const [menuLateralAbierto, setMenuLateralAbierto] = useState(false);
	const [estaColapsado, setEstaColapsado] = useState(
		() => localStorage.getItem("sidebar_colapsado") === "true",
	);
	const [modalCerrarSesionAbierto, setModalCerrarSesionAbierto] = useState(false);
	const [cerrandoSesion, setCerrandoSesion] = useState(false);
	const [anchoVentana, setAnchoVentana] = useState(() => window.innerWidth);

	const esTablet = anchoVentana >= BREAKPOINT_TABLET && anchoVentana < BREAKPOINT_DESKTOP;
	const esDesktop = anchoVentana >= BREAKPOINT_DESKTOP;
	const sidebarColapsadoVisual = esTablet || (esDesktop && estaColapsado);

	const moduloRuta = pathname.replace(/^\//u, "").split("/")[0];
	const moduloActivoCalculado = ModuloIdSchema.catch("actividades").parse(
		moduloRuta || "actividades",
	);
	const moduloActual = moduloActivo ?? moduloActivoCalculado;

	useEffect(() => {
		localStorage.setItem("sidebar_colapsado", String(estaColapsado));
	}, [estaColapsado]);

	useEffect(() => {
		const actualizarAncho = () => setAnchoVentana(window.innerWidth);
		window.addEventListener("resize", actualizarAncho);
		return () => window.removeEventListener("resize", actualizarAncho);
	}, []);

	useEffect(() => {
		if (anchoVentana >= BREAKPOINT_TABLET) {
			setMenuLateralAbierto(false);
		}
	}, [anchoVentana]);

	useEffect(() => {
		const temporizador = setTimeout(() => {
			precargarTodosLosModulos();
		}, 100);
		return () => clearTimeout(temporizador);
	}, []);

	const manejarSeleccion = (id: ModuloId) => {
		if (id !== moduloActual) {
			if (alCambiarModulo) {
				alCambiarModulo(id);
			} else {
				navigate(`/${id}`);
			}
		}
		setMenuLateralAbierto(false);
	};

	const manejarConfirmarCerrarSesion = async () => {
		setCerrandoSesion(true);
		try {
			await cerrarSesionStore();
			navigate("/login", { replace: true });
		} finally {
			setCerrandoSesion(false);
			setModalCerrarSesionAbierto(false);
		}
	};

	return (
		<div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
			
			<AnimatePresence>
				{menuLateralAbierto && (
					<div className="fixed inset-0 z-40 md:hidden">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							aria-label="Cerrar menú lateral"
							role="button"
							tabIndex={0}
							onClick={() => setMenuLateralAbierto(false)}
							onKeyDown={(e) => {
								if (e.key === "Escape" || e.key === "Enter") {
									setMenuLateralAbierto(false);
								}
							}}
							className="fixed inset-0 cursor-pointer bg-slate-900/40 backdrop-blur-xs"
						/>

						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 28, stiffness: 280 }}
							className="fixed inset-y-0 left-0 z-50 h-full w-64 max-w-[85vw] shadow-2xl"
						>
							<Sidebar
								moduloActivo={moduloActual}
								alSeleccionarModulo={manejarSeleccion}
								estaColapsado={false}
								alAlternarColapso={() => {}}
								permiteColapsoManual={false}
								alSolicitarCerrarSesion={() => {
									setMenuLateralAbierto(false);
									setModalCerrarSesionAbierto(true);
								}}
								alCerrarMenuMovil={() => setMenuLateralAbierto(false)}
								className="h-full w-full"
							/>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			
			<aside
				className={cn(
					"hidden h-full shrink-0 transition-[width] duration-300 ease-in-out md:flex",
					sidebarColapsadoVisual ? "w-20" : "w-64",
				)}
			>
				<Sidebar
					moduloActivo={moduloActual}
					alSeleccionarModulo={manejarSeleccion}
					estaColapsado={sidebarColapsadoVisual}
					alAlternarColapso={() => setEstaColapsado((prev) => !prev)}
					permiteColapsoManual={esDesktop}
					alSolicitarCerrarSesion={() => setModalCerrarSesionAbierto(true)}
					className="h-full w-full"
				/>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<TopBar
					moduloActivo={moduloActual}
					alAbrirMenuMovil={() => setMenuLateralAbierto(true)}
					alSolicitarCerrarSesion={() => setModalCerrarSesionAbierto(true)}
					mostrarBotonMenuMovil={!esTablet}
				/>

				<main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 pb-12 sm:p-6 lg:p-8">
					<div className="flex min-h-0 w-full flex-1 flex-col">
						{children ?? (
							<Suspense fallback={<ModuloContenidoSkeleton modulo={moduloActual} />}>
								<Outlet />
							</Suspense>
						)}
					</div>
				</main>
			</div>

			<ModalConfirmacion
				abierto={modalCerrarSesionAbierto}
				titulo="¿Estás seguro de que deseas salir?"
				descripcion="Tendrás que volver a iniciar sesión para acceder al sistema."
				textoConfirmar="Sí, cerrar sesión"
				textoCancelar="Cancelar"
				cargando={cerrandoSesion}
				varianteBoton="destructivo"
				alConfirmar={manejarConfirmarCerrarSesion}
				alCerrar={() => setModalCerrarSesionAbierto(false)}
			/>
		</div>
	);
}
