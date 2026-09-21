import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthGuard } from "./components/guards/AuthGuard";
import { AuthCardSkeleton, DashboardSkeleton } from "./components/ui";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SetupPage } from "./features/setup/pages/SetupPage";
import { useAppStore } from "./store/useAppStore";
import { esSesionValida } from "./utils/sesion";

export function AppRouter() {
	const configurado = useAppStore((state) => state.configurado);
	const autenticado = useAppStore((state) => state.autenticado);
	const estadoVerificado = useAppStore((state) => state.estadoVerificado);
	const verificarEstadoGlobal = useAppStore(
		(state) => state.verificarEstadoGlobal,
	);

	useEffect(() => {
		verificarEstadoGlobal();
	}, [verificarEstadoGlobal]);

	if (!estadoVerificado || configurado === null) {
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
						element={!configurado ? <Navigate to="/setup" replace /> : <App />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
