import { ChevronDown } from "lucide-react";
import type React from "react";
import { forwardRef, useId } from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface SelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	error?: boolean;
	errorMessage?: React.ReactNode;
	placeholder?: string;
	options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			id,
			className,
			error,
			errorMessage,
			placeholder,
			options,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const selectId = id || generatedId;
		const errorId = `${selectId}-error`;
		const hasError = Boolean(error || errorMessage);

		return (
			<div className="w-full">
				<div className="relative w-full">
					<select
						id={selectId}
						ref={ref}
						disabled={disabled}
						aria-invalid={hasError}
						aria-describedby={hasError && errorMessage ? errorId : undefined}
						className={cn(
							"flex h-10 w-full appearance-none rounded-lg bg-white pl-3.5 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:outline-none border-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed",
							hasError
								? "ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
								: "ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary",
							className,
						)}
						{...props}
					>
						{placeholder && (
							<option value="" disabled>
								{placeholder}
							</option>
						)}
						{options
							? options.map((opt) => (
									<option
										key={opt.value}
										value={opt.value}
										disabled={opt.disabled}
									>
										{opt.label}
									</option>
								))
							: children}
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
						<ChevronDown size={16} />
					</div>
				</div>
				{errorMessage && (
					<div className="mt-1.5 min-w-0 text-xs">
						<p
							id={errorId}
							role="alert"
							className="font-medium text-red-600 leading-tight"
						>
							{errorMessage}
						</p>
					</div>
				)}
			</div>
		);
	},
);

Select.displayName = "Select";
