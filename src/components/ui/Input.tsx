import type React from "react";
import { useEffect, useId, useState } from "react";
import { cn } from "@/utils/cn.ts";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	errorMessage?: React.ReactNode;
	rightElement?: React.ReactNode;
	showCount?: boolean;
	charCount?: number;
}

export const Input = ({
	id,
	className,
	error,
	errorMessage,
	type = "text",
	rightElement,
	showCount,
	charCount,
	maxLength,
	onChange,
	value,
	defaultValue,
	ref,
	...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> | undefined }) => {
	const generatedId = useId();
	const inputId = id || generatedId;
	const errorId = `${inputId}-error`;

	const [localCharCount, setLocalCharCount] = useState<number>(() => {
		if (typeof value === "string") {
			return value.length;
		}
		if (typeof defaultValue === "string") {
			return defaultValue.length;
		}
		return 0;
	});

	useEffect(() => {
		if (value !== undefined && typeof value === "string") {
			setLocalCharCount(value.length);
		}
	}, [value]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (showCount || maxLength) {
			setLocalCharCount(e.target.value.length);
		}
		if (onChange) {
			onChange(e);
		}
	};

	const countMostrado =
		typeof charCount === "number"
			? charCount
			: typeof value === "string"
				? value.length
				: localCharCount;

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
						"flex h-10 w-full appearance-none rounded-lg border-0 bg-white px-3.5 py-2 text-sm outline-none transition-colors duration-150 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
						hasError
							? "ring-1 ring-red-500 ring-inset focus:ring-2 focus:ring-red-500 focus:ring-inset"
							: "ring-1 ring-slate-300 ring-inset focus:ring-2 focus:ring-primary focus:ring-inset",
						rightElement ? "pr-10" : "",
						className,
					)}
					{...props}
				/>
				{rightElement && (
					<div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div>
				)}
			</div>
			{(errorMessage || (showCount && maxLength)) && (
				<div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
					<div className="min-w-0 flex-1">
						{errorMessage && (
							<p id={errorId} role="alert" className="font-medium text-red-600 leading-tight">
								{errorMessage}
							</p>
						)}
					</div>
					{showCount && maxLength && (
						<span className="shrink-0 font-medium text-slate-500">
							{countMostrado} / {maxLength}
						</span>
					)}
				</div>
			)}
		</div>
	);
};

Input.displayName = "Input";
