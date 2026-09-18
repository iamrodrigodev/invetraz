import { X } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { cn } from "../../utils/cn";

export interface ModalProps {
	abierto: boolean;
	alCerrar: () => void;
	titulo?: string;
	children: React.ReactNode;
	className?: string;
}

export function Modal({
	abierto,
	alCerrar,
	titulo,
	children,
	className,
}: ModalProps) {
	useEffect(() => {
		const manejarEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") alCerrar();
		};
		if (abierto) {
			document.addEventListener("keydown", manejarEsc);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", manejarEsc);
			document.body.style.overflow = "unset";
		};
	}, [abierto, alCerrar]);

	if (!abierto) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
				onClick={alCerrar}
				aria-hidden="true"
			/>
			<div
				className={cn(
					"relative z-50 w-full max-w-md scale-100 transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all",
					className,
				)}
				role="dialog"
				aria-modal="true"
			>
				{titulo && (
					<div className="mb-5 flex items-center justify-between">
						<h3 className="text-lg font-semibold text-slate-900">{titulo}</h3>
						<button
							onClick={alCerrar}
							className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
				)}
				{children}
			</div>
		</div>
	);
}
