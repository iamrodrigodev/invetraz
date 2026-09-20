import type React from "react";
import { cn } from "../../utils/cn";

export function Card({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
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
			className={cn(
				"font-semibold text-slate-900 tracking-tight text-lg font-heading",
				className,
			)}
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
		<p className={cn("text-sm text-slate-600", className)} {...props}>
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
		<div
			className={cn("flex items-center p-6 pt-0 border-slate-100", className)}
			{...props}
		>
			{children}
		</div>
	);
}
