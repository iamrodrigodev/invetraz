import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./components/guards/AuthGuard";
import { AuthCardSkeleton, DashboardSkeleton } from "./components/ui";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SetupPage } from "./features/setup/pages/SetupPage";
import { useAppStore } from "./store/useAppStore";
import { esSesionValida } from "./utils/sesion";

const App = lazy(() => import("./App"));

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
				className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"
			>
				<p>
					{errorVerificacion || "No se pudo verificar el estado del sistema."}
				</p>
				<button
					type="button"
					className="rounded-lg bg-primary px-4 py-2 text-white"
					onClick={verificarEstadoGlobal}
				>
					Reintentar
				</button>
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
						path="/*"
						element={
							!configurado ? (
								<Navigate to="/setup" replace />
							) : (
								<Suspense fallback={<DashboardSkeleton />}>
									<App />
								</Suspense>
							)
						}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
