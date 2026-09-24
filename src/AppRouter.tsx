import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "@/components/guards/AuthGuard.tsx";
import { AuthCardSkeleton } from "@/components/ui/skeletons/AuthCardSkeleton.tsx";
import { DashboardSkeleton } from "@/components/ui/skeletons/DashboardSkeleton.tsx";
import { ActividadesSeguimientoPage } from "@/features/actividades/pages/ActividadesSeguimientoPage.tsx";
import { LoginPage } from "@/features/auth/pages/LoginPage.tsx";
import { SetupPage } from "@/features/setup/pages/SetupPage.tsx";
import { DashboardLayout } from "@/layouts/DashboardLayout.tsx";
import { useAppStore } from "@/store/useAppStore.ts";
import { esSesionValida } from "@/utils/sesion.ts";

const PlantillasSeguimientoPage = lazy(
	() => import("@/features/plantillas/pages/PlantillasSeguimientoPage.tsx"),
);
const ConfiguracionPage = lazy(
	() => import("@/features/configuracion/pages/ConfiguracionPage.tsx"),
);
const ReportesPage = lazy(() => import("@/features/reportes/pages/ReportesPage.tsx"));
const DocumentacionPage = lazy(
	() => import("@/features/documentacion/pages/DocumentacionPage.tsx"),
);

function PantallaErrorConexion({
	mensaje,
	alReintentar,
}: {
	mensaje: string;
	alReintentar: () => void;
}) {
	return (
		<main
			role="alert"
			className="grid min-h-screen w-full place-items-center bg-slate-50 px-4 py-10 font-sans text-slate-800"
		>
			<section className="flex w-full max-w-125 flex-col items-center text-center">
				<span aria-hidden="true" className="mb-5 font-semibold text-3xl text-red-600 leading-none">
					!
				</span>
				<h1 className="mb-2 font-semibold text-slate-950 text-xl">Servidor no disponible</h1>
				<p className="max-w-md text-slate-600 text-sm leading-6">{mensaje}</p>
				<div className="mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
					<button
						type="button"
						className="min-h-11 cursor-pointer rounded-lg bg-primary px-5 font-medium text-sm text-white transition-colors hover:bg-primary-700"
						onClick={alReintentar}
					>
						Reintentar
					</button>
					<button
						type="button"
						className="min-h-11 cursor-pointer rounded-lg border border-slate-300 bg-white px-5 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-100"
						onClick={() => {
							useAppStore.setState({ configurado: true });
						}}
					>
						Continuar en Modo Offline (Demo)
					</button>
				</div>
			</section>
		</main>
	);
}

export function AppRouter() {
	const configurado = useAppStore((state) => state.configurado);
	const autenticado = useAppStore((state) => state.autenticado);
	const estadoVerificado = useAppStore((state) => state.estadoVerificado);
	const errorVerificacion = useAppStore((state) => state.errorVerificacion);
	const verificarEstadoGlobal = useAppStore((state) => state.verificarEstadoGlobal);

	useEffect(() => {
		verificarEstadoGlobal();
	}, [verificarEstadoGlobal]);

	if (estadoVerificado && configurado === null) {
		return (
			<PantallaErrorConexion
				mensaje={errorVerificacion || "No se pudo verificar el estado del sistema."}
				alReintentar={verificarEstadoGlobal}
			/>
		);
	}

	if (!estadoVerificado) {
		const tieneSesionPrevia = esSesionValida();

		const esRutaAuth =
			typeof window !== "undefined" &&
			(window.location.pathname === "/login" || window.location.pathname === "/setup");

		const sesionExpirada =
			typeof window !== "undefined" &&
			sessionStorage.getItem("motivo_salida") === "sesion_expirada";

		const esSetup =
			typeof window !== "undefined" &&
			(window.location.pathname === "/setup" ||
				(window.location.pathname !== "/login" && configurado !== true));

		if (esRutaAuth || !tieneSesionPrevia || sesionExpirada) {
			return <AuthCardSkeleton esSetup={esSetup} />;
		}

		return <DashboardSkeleton />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/setup"
					element={
						configurado ? (
							<Navigate to={autenticado ? "/actividades" : "/login"} replace={true} />
						) : (
							<SetupPage />
						)
					}
				/>
				<Route
					path="/login"
					element={
						autenticado ? (
							<Navigate to="/actividades" replace={true} />
						) : configurado ? (
							<LoginPage />
						) : (
							<Navigate to="/setup" replace={true} />
						)
					}
				/>

				<Route element={<AuthGuard />}>
					<Route
						element={configurado ? <DashboardLayout /> : <Navigate to="/setup" replace={true} />}
					>
						<Route index={true} element={<ActividadesSeguimientoPage />} />
						<Route path="actividades" element={<ActividadesSeguimientoPage />} />
						<Route path="plantillas" element={<PlantillasSeguimientoPage />} />
						<Route path="configuracion" element={<ConfiguracionPage />} />
						<Route path="reportes" element={<ReportesPage />} />
						<Route path="documentacion" element={<DocumentacionPage />} />
						<Route path="*" element={<Navigate to="/actividades" replace={true} />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
