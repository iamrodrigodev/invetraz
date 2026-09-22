import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";

let modalesAbiertos = 0;
let overflowOriginal = "";

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
	const dialogoRef = useRef<HTMLDivElement>(null);
	const alCerrarRef = useRef(alCerrar);
	alCerrarRef.current = alCerrar;

	useEffect(() => {
		setMontado(true);
	}, []);

	useEffect(() => {
		if (!abierto) return;
		const focoAnterior =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		if (modalesAbiertos === 0) overflowOriginal = document.body.style.overflow;
		modalesAbiertos += 1;
		const manejarEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") alCerrarRef.current();
			if (e.key !== "Tab") return;
			const elementos = dialogoRef.current?.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
			);
			if (!elementos?.length) {
				e.preventDefault();
				return;
			}
			const primero = elementos[0];
			const ultimo = elementos[elementos.length - 1];
			if (e.shiftKey && document.activeElement === primero) {
				e.preventDefault();
				ultimo?.focus();
			} else if (!e.shiftKey && document.activeElement === ultimo) {
				e.preventDefault();
				primero?.focus();
			}
		};
		document.addEventListener("keydown", manejarEsc);
		document.body.style.overflow = "hidden";
		requestAnimationFrame(() => dialogoRef.current?.focus());
		return () => {
			document.removeEventListener("keydown", manejarEsc);
			modalesAbiertos -= 1;
			if (modalesAbiertos === 0)
				document.body.style.overflow = overflowOriginal;
			focoAnterior?.focus();
		};
	}, [abierto]);

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
						className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
						onClick={alCerrar}
						aria-hidden="true"
					/>
					<motion.div
						ref={dialogoRef}
						tabIndex={-1}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className={cn(
							"relative z-10 w-full overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-2xl max-h-[90vh] overflow-y-auto",
							!className?.includes("max-w-") && "max-w-md",
							!className?.includes("text-center") && "text-left",
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
									className="inline-flex cursor-pointer rounded-md p-0.5 text-slate-500 opacity-70 transition-all hover:opacity-100 hover:bg-black/5 hover:text-slate-800 active:scale-95 outline-none"
									aria-label="Cerrar"
								>
									<X size={18} />
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
