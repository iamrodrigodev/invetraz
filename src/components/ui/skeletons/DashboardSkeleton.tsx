import { ConfiguracionSkeleton } from "../../../features/configuracion/components/ConfiguracionSkeleton";
import { DocumentacionSkeleton } from "../../../features/documentacion/components/DocumentacionSkeleton";
import { PlantillasSkeleton } from "../../../features/plantillas/components/PlantillasSkeleton";
import { ActividadesSeguimientoSkeleton } from "../../../pages/skeletons/ActividadesSeguimientoSkeleton";
import { ReportesSkeleton } from "../../../pages/skeletons/ReportesSkeleton";
import { cn } from "../../../utils/cn";
import { Skeleton } from "../Skeleton";

export function DashboardSkeleton() {
	const estaColapsado =
		typeof window !== "undefined" &&
		localStorage.getItem("sidebar_colapsado") === "true";

	const moduloActivo =
		typeof window !== "undefined"
			? (window.location.pathname === "/"
					? localStorage.getItem("moduloActivo")
					: window.location.pathname.slice(1)) || "actividades"
			: "actividades";

	return (
		<div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
			<aside
				className={cn(
					"hidden h-full flex-col border-r border-slate-200 bg-white lg:flex",
					estaColapsado ? "w-20" : "w-72",
				)}
			>
				<div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-[18px]">
					<div className="flex items-center w-full">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center">
							<Skeleton className="h-6 w-6 rounded-lg" />
						</div>
						{!estaColapsado && (
							<Skeleton className="ml-1.5 h-5 w-40 rounded-md" />
						)}
					</div>
				</div>

				<div className="flex-1 space-y-1.5 py-5 px-[18px]">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="flex h-11 w-full items-center rounded-xl">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center">
								<Skeleton className="h-5 w-5 rounded-md" />
							</div>
							{!estaColapsado && (
								<Skeleton className="ml-1.5 h-4 w-32 rounded-md" />
							)}
						</div>
					))}
				</div>

				<div className="border-t border-slate-200/80 py-4 px-[18px]">
					<div className="flex h-11 w-full items-center rounded-xl">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center">
							<Skeleton className="h-5 w-5 shrink-0 rounded-md" />
						</div>
						{!estaColapsado && (
							<Skeleton className="ml-1.5 h-4 w-28 rounded-md" />
						)}
					</div>
				</div>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
					<Skeleton className="h-6 w-48 rounded-md" />
					<div className="flex items-center gap-3 rounded-2xl p-1.5 pr-2.5">
						<Skeleton className="h-9 w-9 shrink-0 rounded-full" />
						<div className="hidden sm:flex flex-col items-start gap-1.5 text-left">
							<Skeleton className="h-3.5 w-36 rounded-md md:w-44" />
							<Skeleton className="h-4 w-24 rounded-full" />
						</div>
						<Skeleton className="h-4 w-4 shrink-0 rounded-md" />
					</div>
				</header>

				<main className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto p-4 sm:p-6 pb-12">
					<div className="flex h-full min-h-0 w-full flex-1 flex-col">
						{moduloActivo === "configuracion" ? (
							<ConfiguracionSkeleton />
						) : moduloActivo === "documentacion" ? (
							<DocumentacionSkeleton />
						) : moduloActivo === "plantillas" ? (
							<PlantillasSkeleton />
						) : moduloActivo === "reportes" ? (
							<ReportesSkeleton />
						) : (
							<ActividadesSeguimientoSkeleton />
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
