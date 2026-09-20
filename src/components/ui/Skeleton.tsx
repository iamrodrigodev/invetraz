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
