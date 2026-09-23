import { Skeleton } from "@/components/ui/Skeleton.tsx";

export interface AuthCardSkeletonProps {
	esSetup?: boolean;
}

export function AuthCardSkeleton({ esSetup }: AuthCardSkeletonProps = {}) {
	const isSetup =
		esSetup ?? (typeof window !== "undefined" && window.location.pathname !== "/login");

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
			<div className="w-full max-w-120 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs md:p-12">
				<div className="mb-8 flex flex-col items-center text-center">
					<Skeleton className="mb-4 h-14 w-14 rounded-2xl" />
					<Skeleton className="mb-2 h-8 w-64 rounded-xl md:w-72" />
					<Skeleton className="h-4 w-56 rounded-md md:w-64" />
				</div>

				<div className="space-y-6">
					<div>
						<Skeleton className="mb-2 h-4 w-32 rounded-md" />
						<Skeleton className="h-10 w-full rounded-lg" />
					</div>
					<div>
						<Skeleton className="mb-2 h-4 w-24 rounded-md" />
						<Skeleton className="h-10 w-full rounded-lg" />
						{isSetup && <Skeleton className="mt-1.5 h-3 w-52 rounded-md" />}
					</div>
					{isSetup && (
						<div>
							<Skeleton className="mb-2 h-4 w-36 rounded-md" />
							<Skeleton className="h-10 w-full rounded-lg" />
						</div>
					)}
					<Skeleton className="mt-2 h-11 w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}
