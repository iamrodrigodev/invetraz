import { AnimatePresence, motion } from "framer-motion";
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

	return (
		<AnimatePresence>
			{abierto && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
						onClick={alCerrar}
						aria-hidden="true"
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className={cn(
							"relative z-50 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl",
							className,
						)}
						role="dialog"
						aria-modal="true"
					>
						{titulo && (
							<div className="mb-5 flex items-center justify-between">
								<h3 className="text-lg font-semibold text-slate-900 font-heading tracking-tight">
									{titulo}
								</h3>
								<button
									type="button"
									onClick={alCerrar}
									className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-90 cursor-pointer"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						)}
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
