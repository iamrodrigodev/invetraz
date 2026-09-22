import { Skeleton } from "../../components/ui/Skeleton";

export function ActividadesSeguimientoSkeleton() {
	return (
		<div className="flex min-h-full w-full flex-1 flex-col">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div className="min-w-0 space-y-2">
					<Skeleton className="h-8 w-72 rounded-lg" />
					<Skeleton className="h-4 w-96 max-w-full rounded-md" />
				</div>

				<div className="flex w-full shrink-0 flex-col-reverse gap-3 sm:w-auto sm:flex-row sm:items-center lg:pt-1">
					<Skeleton className="h-10 w-28 rounded-lg" />
				</div>
			</div>

			<div className="mt-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center w-full">
				<div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto px-4">
					<Skeleton className="h-7 w-7 rounded-md" />
					<div className="space-y-2 flex flex-col items-center w-full">
						<Skeleton className="h-4 w-60 rounded-md" />
						<Skeleton className="h-3.5 w-72 max-w-full rounded-md" />
						<Skeleton className="h-3.5 w-56 max-w-full rounded-md" />
					</div>
					<Skeleton className="mt-2 h-10 w-36 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
