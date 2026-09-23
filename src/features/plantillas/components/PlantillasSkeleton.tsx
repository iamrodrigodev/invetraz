import { Skeleton } from "@/components/ui/Skeleton";

export function PlantillasSkeleton() {
	return (
		<div className="space-y-6 pb-12 w-full">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Skeleton className="h-8 w-72 rounded-lg" />
					<Skeleton className="mt-2 h-4 w-96 rounded-md max-w-full" />
				</div>
				<div className="flex items-center gap-3">
					<Skeleton className="h-9 w-32 rounded-lg" />
					<Skeleton className="h-9 w-48 rounded-lg" />
				</div>
			</div>

			<div className="rounded-2xl border border-slate-200/90 bg-white p-4 w-full shadow-xs">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div className="flex items-center gap-3.5">
						<Skeleton className="h-7 w-7 rounded-lg" />
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Skeleton className="h-4 w-32 rounded-md" />
								<Skeleton className="h-5 w-44 rounded-full" />
							</div>
							<Skeleton className="h-3.5 w-48 rounded-md" />
						</div>
					</div>
					<Skeleton className="h-7 w-48 rounded-lg" />
				</div>
			</div>

			<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="rounded-2xl border border-slate-200/90 bg-white px-6 pb-5 pt-6 space-y-4 shadow-xs"
					>
						<div className="flex justify-between items-center">
							<Skeleton className="h-4 w-36 rounded-md" />
							<Skeleton className="h-5 w-32 rounded-full" />
						</div>
						<div className="space-y-3 pt-3 border-t border-slate-100">
							<div className="flex justify-between items-center">
								<Skeleton className="h-3.5 w-16 rounded-md" />
								<Skeleton className="h-3.5 w-14 rounded-md" />
							</div>
							<div className="flex justify-between items-center">
								<Skeleton className="h-3.5 w-20 rounded-md" />
								<Skeleton className="h-3.5 w-28 rounded-md" />
							</div>
							<div className="pt-2">
								<Skeleton className="h-9 w-full rounded-lg" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
