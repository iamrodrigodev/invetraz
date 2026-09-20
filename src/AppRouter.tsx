import { AnimatePresence, motion } from "framer-motion";
import { Microscope } from "lucide-react";
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

	const cargando = !estadoVerificado || configurado === null;

	return (
		<>
			<AnimatePresence>
				{cargando && (
					<motion.div
						key="splash"
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 font-sans pointer-events-none"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.92 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
							className="flex flex-col items-center text-center"
						>
							<div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200/80">
								<Microscope
									className="h-9 w-9 text-primary animate-pulse"
									strokeWidth={2}
								/>
							</div>
							<h2 className="font-extrabold font-heading text-lg text-slate-800 tracking-tight">
								Sistema de <span className="text-primary">Investigación</span>
							</h2>
							<p className="mt-1.5 text-xs text-slate-400 font-medium">
								Cargando aplicación...
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{!cargando && (
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
									!configurado ? <Navigate to="/setup" replace /> : <App />
								}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			)}
		</>
	);
}
