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

export function PageSkeleton() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="flex h-full min-h-[450px] w-full flex-1 flex-col rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs md:p-12"
		>
			<div className="mb-8 flex flex-col items-center text-center">
				<Skeleton className="mb-4 h-14 w-14 rounded-2xl" />
				<Skeleton className="mb-3 h-8 w-64 rounded-xl" />
				<Skeleton className="h-4 w-full max-w-md rounded-lg md:w-96" />
			</div>

			<div className="mt-4 grid w-full grid-cols-1 gap-6 md:grid-cols-3">
				{[1, 2, 3].map((index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.35, delay: index * 0.08 }}
						className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-6"
					>
						<Skeleton className="h-6 w-3/4 rounded-lg" />
						<Skeleton className="h-4 w-full rounded-md" />
						<Skeleton className="h-4 w-5/6 rounded-md" />
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
