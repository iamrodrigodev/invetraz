import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
	return (
		<motion.div
			initial={{ opacity: 0.4 }}
			animate={{ opacity: [0.4, 0.85, 0.4] }}
			transition={{
				repeat: Number.POSITIVE_INFINITY,
				duration: 1.6,
				ease: "easeInOut",
			}}
			className={cn(
				"rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200",
				className,
			)}
		/>
	);
}

export interface PageSkeletonProps {
	className?: string;
}

export function PageSkeleton({ className }: PageSkeletonProps = {}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			className={cn(
				"flex h-full min-h-[450px] w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12",
				className,
			)}
		>
			<Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
			<Skeleton className="mb-3 h-8 w-64 rounded-xl md:w-80" />
			<div className="flex w-full max-w-md flex-col items-center gap-2">
				<Skeleton className="h-4 w-full rounded-lg" />
				<Skeleton className="h-4 w-3/4 rounded-lg" />
			</div>
		</motion.div>
	);
}

export function AuthCardSkeleton() {
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
					</div>
					<Skeleton className="mt-2 h-11 w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}

export function DashboardSkeleton() {
	return (
		<div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-800">
			<aside className="hidden h-full w-72 flex-col border-r border-slate-200 bg-white lg:flex">
				<div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-6">
					<div className="flex items-center gap-3">
						<Skeleton className="h-6 w-6 rounded-lg" />
						<Skeleton className="h-5 w-40 rounded-md" />
					</div>
				</div>

				<div className="flex-1 space-y-2 p-3 pt-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex h-11 items-center gap-3 rounded-lg px-3"
						>
							<Skeleton className="h-5 w-5 rounded-md" />
							<Skeleton className="h-4 w-32 rounded-md" />
						</div>
					))}
				</div>

				<div className="border-t border-slate-200/80 p-3 py-4">
					<div className="flex h-11 items-center gap-3 rounded-lg px-3">
						<Skeleton className="h-5 w-5 shrink-0 rounded-md" />
						<Skeleton className="h-4 w-28 rounded-md" />
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

				<main className="flex flex-1 flex-col overflow-y-auto p-6">
					<div className="flex h-full min-h-0 w-full flex-1 flex-col">
						<PageSkeleton />
					</div>
				</main>
			</div>
		</div>
	);
}
