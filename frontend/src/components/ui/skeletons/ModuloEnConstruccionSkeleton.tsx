import { Skeleton } from "@/components/ui/Skeleton.tsx";
import { cn } from "@/utils/cn.ts";

export type ModuloEnConstruccionSkeletonProps = {
	tituloAncho: string;
};

export function ModuloEnConstruccionSkeleton({ tituloAncho }: ModuloEnConstruccionSkeletonProps) {
	return (
		<div
			className="flex h-full min-h-[450px] w-full flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white p-8 text-center shadow-xs md:p-12"
			role="status"
			aria-busy="true"
			aria-label="Cargando contenido..."
		>
			<Skeleton className="mb-6 h-14 w-14 rounded-xl" />
			<Skeleton className={cn("mb-2 h-8 max-w-full rounded-lg md:h-9", tituloAncho)} />
			<div className="flex w-full max-w-md flex-col items-center gap-2">
				<Skeleton className="h-4 w-full rounded-md" />
				<Skeleton className="h-4 w-11/12 rounded-md" />
				<Skeleton className="h-4 w-2/3 rounded-md" />
			</div>
		</div>
	);
}
