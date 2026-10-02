import type React from "react";
import { cn } from "@/utils/cn.ts";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
	variant?: "primary" | "success" | "warning" | "destructive" | "slate" | "blue";
};

export function Badge({ className, variant = "primary", children, ...props }: BadgeProps) {
	const variantStyles = {
		primary: "bg-primary-50 text-primary border-primary-200",
		blue: "bg-primary text-white border-transparent",
		success: "bg-emerald-50 text-emerald-700 border-emerald-200",
		warning: "bg-amber-50 text-amber-700 border-amber-200",
		destructive: "bg-red-50 text-red-700 border-red-200",
		slate: "bg-slate-100 text-slate-700 border-slate-200",
	}[variant];

	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-semibold text-xs tracking-wide transition-colors",
				variantStyles,
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
