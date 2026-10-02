import type React from "react";
import { cn } from "@/utils/cn.ts";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-xs transition-shadow duration-200",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={cn("font-heading font-semibold text-lg text-slate-900 tracking-tight", className)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function CardDescription({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className={cn("text-slate-600 text-sm", className)} {...props}>
			{children}
		</p>
	);
}

export function CardContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
}

export function CardFooter({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex items-center border-slate-100 p-6 pt-0", className)} {...props}>
			{children}
		</div>
	);
}
