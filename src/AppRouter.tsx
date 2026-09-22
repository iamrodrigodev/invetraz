import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./components/guards/AuthGuard";
import { AuthCardSkeleton, DashboardSkeleton } from "./components/ui";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SetupPage } from "./features/setup/pages/SetupPage";
import { useAppStore } from "./store/useAppStore";
import { esSesionValida } from "./utils/sesion";

const DashboardLayout = lazy(() =>
	import("./layouts/DashboardLayout").then((m) => ({
		default: m.DashboardLayout,
	})),
);
const ActividadesSeguimientoPage = lazy(
	() => import("./features/actividades/pages/ActividadesSeguimientoPage"),
);
const PlantillasSeguimientoPage = lazy(
	() => import("./features/plantillas/pages/PlantillasSeguimientoPage"),
);
const ConfiguracionPage = lazy(
	() => import("./features/configuracion/pages/ConfiguracionPage"),
);
const ReportesPage = lazy(
	() => import("./features/reportes/pages/ReportesPage"),
);
const DocumentacionPage = lazy(
	() => import("./features/documentacion/pages/DocumentacionPage"),
);

export function AppRouter() {
	const configurado = useAppStore((state) => state.configurado);
	const autenticado = useAppStore((state) => state.autenticado);
	const estadoVerificado = useAppStore((state) => state.estadoVerificado);
	const errorVerificacion = useAppStore((state) => state.errorVerificacion);
	const verificarEstadoGlobal = useAppStore(
		(state) => state.verificarEstadoGlobal,
	);

	useEffect(() => {
		verificarEstadoGlobal();
	}, [verificarEstadoGlobal]);

	if (estadoVerificado && configurado === null) {
		return (
			<div
				role="alert"
				className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center text-slate-800"
			>
				<p className="max-w-md text-slate-600 text-sm">
					{errorVerificacion || "No se pudo verificar el estado del sistema."}
				</p>
				<div className="flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						className="cursor-pointer rounded-lg bg-primary px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-primary-700"
						onClick={verificarEstadoGlobal}
					>
						Reintentar
					</button>
					<button
						type="button"
						className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 text-sm transition-colors hover:bg-slate-100"
						onClick={() => {
							useAppStore.setState({ configurado: true });
						}}
					>
						Continuar en Modo Offline (Demo)
					</button>
				</div>
			</div>
		);
	}

	if (!estadoVerificado) {
		const tieneSesionPrevia = esSesionValida();

		const esRutaAuth =
			typeof window !== "undefined" &&
			(window.location.pathname === "/login" ||
				window.location.pathname === "/setup");

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
							<Navigate to={autenticado ? "/" : "/login"} replace />
						) : (
							<SetupPage />
						)
					}
				/>
				<Route
					path="/login"
					element={
						autenticado ? (
							<Navigate to="/" replace />
						) : !configurado ? (
							<Navigate to="/setup" replace />
						) : (
							<LoginPage />
						)
					}
				/>

				<Route element={<AuthGuard />}>
					<Route
						element={
							!configurado ? (
								<Navigate to="/setup" replace />
							) : (
								<Suspense fallback={<DashboardSkeleton />}>
									<DashboardLayout />
								</Suspense>
							)
						}
					>
						<Route index element={<Navigate to="/actividades" replace />} />
						<Route
							path="actividades"
							element={<ActividadesSeguimientoPage />}
						/>
						<Route path="plantillas" element={<PlantillasSeguimientoPage />} />
						<Route path="configuracion" element={<ConfiguracionPage />} />
						<Route path="reportes" element={<ReportesPage />} />
						<Route path="documentacion" element={<DocumentacionPage />} />
						<Route path="*" element={<Navigate to="/actividades" replace />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
