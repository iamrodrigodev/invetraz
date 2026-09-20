import { Loader2 } from "lucide-react";
import type React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "destructive"
		| "link";
	size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
	isLoading?: boolean;
}

export function Button({
	className,
	variant = "default",
	size = "default",
	type = "button",
	isLoading = false,
	children,
	disabled,
	...props
}: ButtonProps) {
	const variantStyles = {
		default:
			"bg-primary text-white shadow-xs hover:bg-primary-700 focus-visible:ring-primary",
		outline:
			"border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-primary",
		secondary:
			"bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400",
		ghost:
			"text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
		destructive:
			"bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-red-500",
		link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
	}[variant];

	const sizeStyles = {
		default: "h-9 px-4 py-2 text-sm rounded-lg gap-2",
		sm: "h-7 px-2.5 text-xs rounded-md gap-1.5",
		lg: "h-11 px-6 text-base rounded-xl gap-2.5",
		icon: "h-9 w-9 p-0 rounded-lg justify-center",
		"icon-sm": "h-7 w-7 p-0 rounded-md justify-center",
	}[size];

	return (
		<button
			type={type}
			disabled={disabled || isLoading}
			className={cn(
				"inline-flex select-none items-center justify-center font-medium transition-all duration-150 ease-in-out cursor-pointer",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-98",
				variantStyles,
				sizeStyles,
				className,
			)}
			{...props}
		>
			{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{children}
		</button>
	);
}
