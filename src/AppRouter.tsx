import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthGuard } from "./components/guards/AuthGuard";

import { LoginPage } from "./features/auth/pages/LoginPage";
import { verificarEstadoSistema } from "./features/setup/api/setup.api";
import { SetupPage } from "./features/setup/pages/SetupPage";

export function AppRouter() {
	const [estadoVerificado, setEstadoVerificado] = useState(false);
	const [configurado, setConfigurado] = useState<boolean | null>(null);

	useEffect(() => {
		const verificarEstado = async () => {
			try {
				const esConfigurado = await verificarEstadoSistema();
				setConfigurado(esConfigurado);
			} catch (error) {
				console.error("Error al verificar estado", error);
				setConfigurado(false);
			} finally {
				setEstadoVerificado(true);
			}
		};

		verificarEstado();
	}, []);

	if (!estadoVerificado || configurado === null) {
		return <div className="min-h-screen w-full bg-slate-50" />;
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/setup"
					element={
						configurado ? <Navigate to="/login" replace /> : <SetupPage />
					}
				/>
				<Route
					path="/login"
					element={
						!configurado ? <Navigate to="/setup" replace /> : <LoginPage />
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
