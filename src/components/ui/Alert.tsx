import { X } from "lucide-react";
import type React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	message: string;
	variant?: "error" | "success" | "warning" | "info";
	onClose?: () => void;
}

export function Alert({
	message,
	variant = "error",
	onClose,
	className,
	...props
}: AlertProps) {
	const variantStyles = {
		error: "bg-red-50 text-red-600 ring-1 ring-red-200",
		success: "bg-green-50 text-green-700 ring-1 ring-green-200",
		warning: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
		info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
	}[variant];

	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg p-3 text-sm transition-all",
				variantStyles,
				className,
			)}
			{...props}
		>
			<div className="flex-1">{message}</div>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="ml-3 inline-flex flex-shrink-0 cursor-pointer rounded-md p-0.5 opacity-70 transition-all hover:opacity-100 hover:bg-black/5 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
					aria-label="Cerrar"
				>
					<X size={18} />
				</button>
			)}
		</div>
	);
}
