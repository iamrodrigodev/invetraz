import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthGuard } from "./components/guards/AuthGuard";
import { Spinner } from "./components/ui";

import { LoginPage } from "./features/auth/pages/LoginPage";
import { verificarEstadoSistema } from "./features/setup/api/setup.api";
import { SetupPage } from "./features/setup/pages/SetupPage";

export function AppRouter() {
	// Inicializamos síncronamente desde localStorage para evitar el "tick" al hacer F5
	const [configurado, setConfigurado] = useState<boolean | null>(() => {
		if (typeof window !== "undefined") {
			const guardado = localStorage.getItem("sistema_configurado");
			if (guardado === "true") return true;
			if (guardado === "false") return false;
		}
		return null;
	});

	const [estadoVerificado, setEstadoVerificado] = useState<boolean>(() => {
		// Si ya tenemos el estado en localStorage, podemos proceder sin bloquear
		return localStorage.getItem("sistema_configurado") !== null;
	});

	useEffect(() => {
		const verificarEstado = async () => {
			try {
				const esConfigurado = await verificarEstadoSistema();
				setConfigurado(esConfigurado);
				localStorage.setItem(
					"sistema_configurado",
					esConfigurado ? "true" : "false",
				);
			} catch (error) {
				console.error("Error al verificar estado", error);
				setConfigurado(false);
				localStorage.setItem("sistema_configurado", "false");
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
