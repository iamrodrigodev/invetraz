// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
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

export interface DashboardLayoutProps {
	moduloActivo?: ModuloId;
	alCambiarModulo?: (modulo: ModuloId) => void;
	children?: React.ReactNode;
}

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

	const moduloRuta = pathname.replace(/^\//u, "").split("/")[0];
	const moduloActivoCalculado = ModuloIdSchema.catch("actividades").parse(
		moduloRuta || "actividades",
	);
	const moduloActual = moduloActivo ?? moduloActivoCalculado;

	useEffect(() => {
		localStorage.setItem("sidebar_colapsado", String(estaColapsado));
	}, [estaColapsado]);

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
			{menuLateralAbierto && (
				<button
					type="button"
					aria-label="Cerrar menú lateral"
					onClick={() => setMenuLateralAbierto(false)}
					className="fixed inset-0 z-20 cursor-pointer bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
				/>
			)}

			<div
				className={cn(
					"fixed inset-y-0 left-0 z-30 w-72 transform transition-[width,transform] duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
					menuLateralAbierto ? "translate-x-0" : "-translate-x-full",
					estaColapsado ? "lg:w-20" : "lg:w-72",
				)}
			>
				<Sidebar
					moduloActivo={moduloActual}
					alSeleccionarModulo={manejarSeleccion}
					estaColapsado={estaColapsado}
					alAlternarColapso={() => setEstaColapsado((prev) => !prev)}
					alSolicitarCerrarSesion={() => setModalCerrarSesionAbierto(true)}
					className="h-full w-full"
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<TopBar
					moduloActivo={moduloActual}
					alAbrirMenuMovil={() => setMenuLateralAbierto(true)}
					alSolicitarCerrarSesion={() => setModalCerrarSesionAbierto(true)}
				/>

				<main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 pb-12 sm:p-6">
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
