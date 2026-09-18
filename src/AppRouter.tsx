import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthGuard } from "./components/guards/AuthGuard";
import { Spinner } from "./components/ui";

import { entorno } from "./entorno";

import { SetupPage } from "./pages/SetupPage";
import { LoginPage } from "./pages/LoginPage";

export function AppRouter() {
	const [estadoVerificado, setEstadoVerificado] = useState(false);
	const [configurado, setConfigurado] = useState<boolean | null>(null);

	useEffect(() => {
		const verificarEstado = async () => {
			try {
				const res = await fetch(entorno.VITE_API_BASE_URL + "/setup/estado");
				if (res.ok) {
					const data = await res.json();
					setConfigurado(data.configurado);
				} else {
					setConfigurado(false);
				}
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
		return (
			<div className="flex h-screen w-full items-center justify-center bg-slate-50">
				<Spinner mensaje="Verificando sistema..." />
			</div>
		);
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
