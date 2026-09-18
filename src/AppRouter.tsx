import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthGuard } from "./components/guards/AuthGuard";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { SetupPage } from "./features/setup/pages/SetupPage";
import { useAppStore } from "./store/useAppStore";

export function AppRouter() {
	const { configurado, autenticado, estadoVerificado, verificarEstadoGlobal } =
		useAppStore();

	useEffect(() => {
		verificarEstadoGlobal();
	}, [verificarEstadoGlobal]);

	if (!estadoVerificado || configurado === null) {
		return <div className="min-h-screen w-full bg-slate-50" />;
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
