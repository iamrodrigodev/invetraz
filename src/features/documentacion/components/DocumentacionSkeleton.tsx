import { Skeleton } from "../../../components/ui/Skeleton";

export function DocumentacionSkeleton() {
	return (
		<div className="space-y-6 pb-12 w-full">
			<div>
				<div className="flex items-center gap-2.5 mb-1">
					<Skeleton className="h-6 w-6 rounded-md" />
					<Skeleton className="h-8 w-80 rounded-lg" />
				</div>
				<Skeleton className="mt-2 h-4 w-96 rounded-md" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-64 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-3.5 w-3/4 rounded-md" />
							<div className="space-y-1.5">
								<Skeleton className="h-3.5 w-2/3 rounded-md" />
								<div className="flex items-center gap-2 mt-1">
									<Skeleton className="h-8 flex-1 rounded-md" />
									<Skeleton className="h-8 w-20 shrink-0 rounded-md" />
								</div>
							</div>
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-56 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-52 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-4 w-52 rounded-md" />
							<div className="space-y-2.5">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-28 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-36 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Skeleton className="h-3.5 w-40 rounded-md" />
										<Skeleton className="h-6 w-16 rounded-md" />
									</div>
									<Skeleton className="h-7 w-full rounded-md" />
								</div>
							</div>
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-52 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-44 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-11/12 rounded-md" />
							<Skeleton className="h-3.5 w-full rounded-md" />
							<div className="space-y-1.5">
								<Skeleton className="h-3.5 w-48 rounded-md" />
								<div className="flex items-center gap-2 mt-1">
									<Skeleton className="h-8 flex-1 rounded-md" />
									<Skeleton className="h-8 w-20 shrink-0 rounded-md" />
								</div>
							</div>
							<Skeleton className="h-3.5 w-5/6 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-44 rounded-lg" />
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5">
					<div className="space-y-4">
						<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-5 w-64 rounded-md" />
						</div>
						<div className="space-y-3 pt-1">
							<Skeleton className="h-3.5 w-full rounded-md" />
							<div className="flex items-center justify-between gap-2">
								<Skeleton className="h-3.5 w-3/4 rounded-md" />
								<Skeleton className="h-6 w-16 rounded-md shrink-0" />
							</div>
							<Skeleton className="h-3.5 w-4/5 rounded-md" />
							<Skeleton className="h-3.5 w-full rounded-md" />
							<Skeleton className="h-3.5 w-3/4 rounded-md" />
						</div>
					</div>
					<div className="pt-2">
						<Skeleton className="h-9 w-52 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}
