// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
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
