import type React from "react";
import { forwardRef, useEffect, useId, useState } from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
	errorMessage?: React.ReactNode;
	showCount?: boolean;
	charCount?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			id,
			className,
			error,
			errorMessage,
			showCount,
			charCount,
			maxLength,
			onChange,
			value,
			defaultValue,
			rows = 3,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const textareaId = id || generatedId;
		const errorId = `${textareaId}-error`;

		const [localCharCount, setLocalCharCount] = useState<number>(() => {
			if (typeof value === "string") return value.length;
			if (typeof defaultValue === "string") return defaultValue.length;
			return 0;
		});

		useEffect(() => {
			if (value !== undefined && typeof value === "string") {
				setLocalCharCount(value.length);
			}
		}, [value]);

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
					<textarea
						id={textareaId}
						ref={ref}
						rows={rows}
						maxLength={maxLength}
						value={value}
						defaultValue={defaultValue}
						onChange={handleChange}
						aria-invalid={hasError}
						aria-describedby={hasError && errorMessage ? errorId : undefined}
						className={cn(
							"flex w-full resize-y rounded-lg bg-white px-3.5 py-2.5 text-sm placeholder:text-slate-400 outline-none focus:outline-none border-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150",
							hasError
								? "ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
								: "ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary",
							className,
						)}
						{...props}
					/>
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
								{countMostrado} / {maxLength}
							</span>
						)}
					</div>
				)}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";
