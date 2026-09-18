import type React from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, error, type = "text", rightElement, ...props }, ref) => {
		return (
			<div className="relative w-full">
				<input
					type={type}
					className={cn(
						"flex h-10 w-full appearance-none rounded-md bg-white px-3 py-2 text-sm placeholder:text-slate-400 outline-none focus:outline-none border-0 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-200",
						error
							? "ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
							: "ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary",
						rightElement ? "pr-10" : "",
						className,
					)}
					ref={ref}
					{...props}
				/>
				{rightElement && (
					<div className="absolute inset-y-0 right-0 flex items-center pr-3">
						{rightElement}
					</div>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
