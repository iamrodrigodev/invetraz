import { Skeleton } from "../../../components/ui/Skeleton";

export function ConfiguracionSkeleton() {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-72 rounded-lg" />
				<Skeleton className="mt-2 h-4 w-96 rounded-md" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
					<div>
						<div className="border-b border-slate-100 pb-5">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<Skeleton className="h-5 w-44 rounded-md" />
								<Skeleton className="h-6 w-36 rounded-full" />
							</div>
							<Skeleton className="mt-3 h-6 w-56 rounded-md" />
							<Skeleton className="mt-1.5 h-4 w-80 rounded-md" />
						</div>
						<div className="space-y-5 pt-5">
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-28 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-64 rounded-md" />
							</div>
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-52 rounded-md" />
							</div>
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-36 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-56 rounded-md" />
							</div>
						</div>
					</div>
					<div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-end">
						<Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
						<Skeleton className="h-10 w-full sm:w-44 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
					<div>
						<div className="border-b border-slate-100 pb-5">
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
								<Skeleton className="h-5 w-36 rounded-md" />
								<Skeleton className="h-6 w-36 rounded-full" />
							</div>
							<Skeleton className="mt-3 h-6 w-64 rounded-md" />
							<Skeleton className="mt-1.5 h-4 w-96 rounded-md" />
						</div>
						<div className="space-y-5 pt-5">
							<div className="space-y-1.5">
								<Skeleton className="h-4 w-56 rounded-md" />
								<Skeleton className="h-10 w-full rounded-lg" />
								<Skeleton className="h-3.5 w-80 rounded-md" />
							</div>
						</div>
					</div>
					<div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:items-center sm:justify-end">
						<Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
						<Skeleton className="h-10 w-full sm:w-44 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}
