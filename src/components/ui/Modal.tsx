import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
	const [montado, setMontado] = useState(false);

	useEffect(() => {
		setMontado(true);
	}, []);

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

	if (!montado) return null;

	return createPortal(
		<AnimatePresence>
			{abierto && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
						onClick={alCerrar}
						aria-hidden="true"
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.96, y: 12 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.96, y: 12 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
						className={cn(
							"relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl",
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
		</AnimatePresence>,
		document.body,
	);
}
