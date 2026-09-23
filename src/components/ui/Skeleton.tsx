import type React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn("animate-pulse rounded-2xl bg-slate-200/80", className)}
			aria-hidden="true"
			{...props}
		/>
	);
}
