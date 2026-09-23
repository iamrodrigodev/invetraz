// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { Skeleton } from "@/components/ui/Skeleton.tsx";
import { ConfiguracionSkeleton } from "@/features/configuracion/components/ConfiguracionSkeleton.tsx";
import { DocumentacionSkeleton } from "@/features/documentacion/components/DocumentacionSkeleton.tsx";
import { PlantillasSkeleton } from "@/features/plantillas/components/PlantillasSkeleton.tsx";
import { ActividadesSeguimientoSkeleton } from "@/pages/skeletons/ActividadesSeguimientoSkeleton.tsx";
import { ReportesSkeleton } from "@/pages/skeletons/ReportesSkeleton.tsx";
import { cn } from "@/utils/cn.ts";

export function ModuloContenidoSkeleton({ modulo }: { modulo: string }) {
	switch (modulo) {
		case "configuracion":
			return <ConfiguracionSkeleton />;
		case "documentacion":
			return <DocumentacionSkeleton />;
		case "plantillas":
			return <PlantillasSkeleton />;
		case "reportes":
			return <ReportesSkeleton />;
		default:
			return <ActividadesSeguimientoSkeleton />;
	}
}

export function DashboardSkeleton() {
	const estaColapsado = localStorage.getItem("sidebar_colapsado") === "true";

	const moduloActivo = (() => {
		const ruta = window.location.pathname.replace(/^\//u, "").split("/")[0];
		if (!ruta || ruta === "") {
			return localStorage.getItem("moduloActivo") || "actividades";
		}
		return ruta;
	})();

	return (
		<div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
			<aside
				className={cn(
					"hidden h-full flex-col border-slate-200 border-r bg-white lg:flex",
					estaColapsado ? "w-20" : "w-72",
				)}
			>
				<div className="flex h-16 shrink-0 items-center border-slate-200 border-b px-[18px]">
					<div className="flex w-full items-center">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center">
							<Skeleton className="h-6 w-6 rounded-lg" />
						</div>
						{!estaColapsado && <Skeleton className="ml-1.5 h-5 w-40 rounded-md" />}
					</div>
				</div>

				<div className="flex-1 space-y-1.5 px-[18px] py-5">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex h-11 w-full items-center rounded-xl">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center">
								<Skeleton className="h-5 w-5 rounded-md" />
							</div>
							{!estaColapsado && <Skeleton className="ml-1.5 h-4 w-32 rounded-md" />}
						</div>
					))}
				</div>

				<div className="border-slate-200/80 border-t px-[18px] py-4">
					<div className="flex h-11 w-full items-center rounded-xl">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center">
							<Skeleton className="h-5 w-5 shrink-0 rounded-md" />
						</div>
						{!estaColapsado && <Skeleton className="ml-1.5 h-4 w-28 rounded-md" />}
					</div>
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between border-slate-200 border-b bg-white px-4 lg:px-8">
					<Skeleton className="h-6 w-48 rounded-md" />
					<div className="flex items-center gap-3 rounded-2xl p-1.5 pr-2.5">
						<Skeleton className="h-9 w-9 shrink-0 rounded-full" />
						<div className="hidden flex-col items-start gap-1.5 text-left sm:flex">
							<Skeleton className="h-3.5 w-36 rounded-md md:w-44" />
							<Skeleton className="h-4 w-24 rounded-full" />
						</div>
						<Skeleton className="h-4 w-4 shrink-0 rounded-md" />
					</div>
				</header>

				<main className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 pb-12 sm:p-6">
					<div className="flex h-full min-h-0 w-full flex-1 flex-col">
						<ModuloContenidoSkeleton modulo={moduloActivo} />
					</div>
				</main>
			</div>
		</div>
	);
}
