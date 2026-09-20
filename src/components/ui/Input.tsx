import type React from "react";
import { forwardRef, useEffect, useId, useState } from "react";
import { cn } from "../../utils/cn";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	errorMessage?: React.ReactNode;
	rightElement?: React.ReactNode;
	showCount?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			id,
			className,
			error,
			errorMessage,
			type = "text",
			rightElement,
			showCount,
			maxLength,
			onChange,
			value,
			defaultValue,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const inputId = id || generatedId;
		const errorId = `${inputId}-error`;

		const [charCount, setCharCount] = useState<number>(() => {
			if (typeof value === "string") return value.length;
			if (typeof defaultValue === "string") return defaultValue.length;
			return 0;
		});

		useEffect(() => {
			if (value !== undefined && typeof value === "string") {
				setCharCount(value.length);
			}
		}, [value]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (showCount || maxLength) {
				setCharCount(e.target.value.length);
			}
			if (onChange) {
				onChange(e);
			}
		};

		const hasError = Boolean(error || errorMessage);

		return (
			<div className="w-full">
				<div className="relative w-full">
					<input
						id={inputId}
						type={type}
						ref={ref}
						maxLength={maxLength}
						value={value}
						defaultValue={defaultValue}
						onChange={handleChange}
						aria-invalid={hasError}
						aria-describedby={hasError && errorMessage ? errorId : undefined}
						className={cn(
							"flex h-10 w-full appearance-none rounded-lg bg-white px-3.5 py-2 text-sm placeholder:text-slate-400 outline-none focus:outline-none border-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
							hasError
								? "ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
								: "ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary",
							rightElement ? "pr-10" : "",
							className,
						)}
						{...props}
					/>
					{rightElement && (
						<div className="absolute inset-y-0 right-0 flex items-center pr-3">
							{rightElement}
						</div>
					)}
				</div>
				{(errorMessage || (showCount && maxLength)) && (
					<div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
						<div className="flex-1 min-w-0">
							{errorMessage && (
								<p
									id={errorId}
									role="alert"
									className="font-medium text-red-600 leading-tight"
								>
									{errorMessage}
								</p>
							)}
						</div>
						{showCount && maxLength && (
							<span className="shrink-0 font-medium text-slate-500">
								{charCount} / {maxLength}
							</span>
						)}
					</div>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
