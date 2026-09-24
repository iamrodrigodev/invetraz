import { Skeleton } from "@/components/ui/Skeleton.tsx";

export function TarjetasActividadesSkeleton() {
	return (
		<div
			data-testid="tarjetas-actividades-skeleton"
			className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
		>
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<div
					key={i}
					className="space-y-4 rounded-2xl border border-slate-200/90 bg-white px-5 pt-5 pb-5 shadow-xs sm:px-6 sm:pt-6"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1.5">
							<Skeleton className="h-4 w-44 rounded-md" />
							<Skeleton className="h-3.5 w-28 rounded-md" />
						</div>
						<Skeleton className="h-5 w-20 rounded-full" />
					</div>
					<div className="space-y-3 border-slate-100 border-t pt-3">
						<div className="flex items-center justify-between">
							<Skeleton className="h-3.5 w-16 rounded-md" />
							<Skeleton className="h-3.5 w-28 rounded-md" />
						</div>
						<div className="flex items-center justify-between">
							<Skeleton className="h-3.5 w-20 rounded-md" />
							<Skeleton className="h-3.5 w-32 rounded-md" />
						</div>
						<div className="flex items-center justify-between">
							<Skeleton className="h-3.5 w-24 rounded-md" />
							<Skeleton className="h-3.5 w-24 rounded-md" />
						</div>
						<div className="pt-2">
							<Skeleton className="h-11 w-full rounded-lg" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function ActividadesSeguimientoSkeleton() {
	return (
		<div
			data-testid="actividades-seguimiento-skeleton"
			className="flex min-h-full w-full flex-1 flex-col space-y-6 pb-12"
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div className="min-w-0 space-y-2">
					<Skeleton className="h-8 w-72 rounded-lg" />
					<Skeleton className="h-4 w-96 max-w-full rounded-md" />
				</div>

				<div className="flex w-full shrink-0 flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center md:pt-1">
					<Skeleton className="h-11 w-32 rounded-lg" />
					<Skeleton className="h-11 w-28 rounded-lg" />
				</div>
			</div>

			<TarjetasActividadesSkeleton />
		</div>
	);
}
