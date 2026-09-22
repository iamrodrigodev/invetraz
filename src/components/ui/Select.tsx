import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type React from "react";
import { useId, useMemo, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../utils/cn";
import { Badge } from "./Badge";

export interface SelectOption {
	value: string;
	label: string;
	badge?: string | undefined;
	badgeVariant?:
		| ("primary" | "success" | "warning" | "destructive" | "slate")
		| undefined;
	disabled?: boolean | undefined;
	sublabel?: string | undefined;
}

export interface SelectProps {
	id?: string | undefined;
	name?: string | undefined;
	value?: string | undefined;
	defaultValue?: string | undefined;
	onChange?: ((value: string) => void) | undefined;
	onBlur?: (() => void) | undefined;
	placeholder?: string | undefined;
	options: SelectOption[];
	disabled?: boolean | undefined;
	error?: boolean | undefined;
	errorMessage?: React.ReactNode | undefined;
	className?: string | undefined;
}

export const Select: React.FC<SelectProps> = ({
	id,
	name,
	value: controlledValue,
	defaultValue,
	onChange,
	onBlur,
	placeholder = "Selecciona una opción...",
	options = [],
	disabled = false,
	error = false,
	errorMessage,
	className,
}) => {
	const generatedId = useId();
	const selectId = id || generatedId;
	const errorId = `${selectId}-error`;

	const [abierto, setAbierto] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || "",
	);

	const contenedorRef = useRef<HTMLDivElement>(null);

	const valorActual =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;

	const opcionSeleccionada = useMemo(() => {
		return options.find((opt) => opt.value === valorActual);
	}, [options, valorActual]);

	const cerrar = () => {
		setAbierto(false);
		if (onBlur) {
			onBlur();
		}
	};

	useClickOutside(contenedorRef, cerrar, abierto);

	const seleccionarOpcion = (opcion: SelectOption) => {
		if (opcion.disabled) return;
		if (controlledValue === undefined) {
			setUncontrolledValue(opcion.value);
		}
		if (onChange) {
			onChange(opcion.value);
		}
		setAbierto(false);
	};

	const hasError = Boolean(error || errorMessage);

	return (
		<div className="relative w-full" ref={contenedorRef}>
			{name && <input type="hidden" name={name} value={valorActual} />}

			<button
				id={selectId}
				type="button"
				disabled={disabled}
				aria-haspopup="listbox"
				aria-expanded={abierto}
				aria-invalid={hasError}
				aria-describedby={hasError && errorMessage ? errorId : undefined}
				onClick={() => {
					if (!disabled) {
						setAbierto(!abierto);
					}
				}}
				className={cn(
					"flex h-10 w-full items-center justify-between rounded-lg bg-white px-3.5 py-2 text-sm text-left outline-none transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
					hasError
						? "ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
						: abierto
							? "ring-2 ring-inset ring-primary shadow-xs"
							: "ring-1 ring-inset ring-slate-300 hover:ring-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary",
					className,
				)}
			>
				<div className="flex min-w-0 items-center gap-2 pr-2">
					{opcionSeleccionada ? (
						<span className="truncate font-medium text-slate-900">
							{opcionSeleccionada.label}
						</span>
					) : (
						<span className="truncate text-slate-400 font-normal">
							{placeholder}
						</span>
					)}
				</div>

				<div className="flex items-center gap-1.5 shrink-0 text-slate-400">
					{opcionSeleccionada?.badge && (
						<Badge
							variant={opcionSeleccionada.badgeVariant || "slate"}
							className="hidden sm:inline-flex text-[10px] px-1.5 py-0 font-normal"
						>
							{opcionSeleccionada.badge}
						</Badge>
					)}
					<ChevronDown
						size={16}
						className={cn(
							"transition-transform duration-200",
							abierto && "rotate-180 text-primary",
						)}
					/>
				</div>
			</button>

			<AnimatePresence>
				{abierto && (
					<motion.div
						initial={{ opacity: 0, y: 4, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 4, scale: 0.98 }}
						transition={{ duration: 0.14, ease: "easeOut" }}
						role="listbox"
						aria-labelledby={selectId}
						className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 font-sans"
					>
						{options.length === 0 ? (
							<div className="px-3 py-4 text-center text-xs text-slate-500">
								No hay opciones disponibles
							</div>
						) : (
							options.map((opt) => {
								const estaSeleccionada = opt.value === valorActual;
								return (
									<button
										key={opt.value}
										type="button"
										role="option"
										aria-selected={estaSeleccionada}
										disabled={opt.disabled}
										onClick={() => seleccionarOpcion(opt)}
										className={cn(
											"flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer select-none text-left",
											opt.disabled
												? "opacity-40 cursor-not-allowed pointer-events-none"
												: estaSeleccionada
													? "bg-primary-50/90 text-primary font-semibold"
													: "text-slate-800 hover:bg-slate-50 hover:text-primary",
										)}
									>
										<div className="min-w-0 flex-1">
											<div className="truncate">{opt.label}</div>
											{opt.sublabel && (
												<div className="text-xs text-slate-500 font-normal truncate mt-0.5">
													{opt.sublabel}
												</div>
											)}
										</div>

										<div className="flex items-center gap-2 shrink-0">
											{opt.badge && (
												<Badge
													variant={opt.badgeVariant || "slate"}
													className="text-[11px] font-normal"
												>
													{opt.badge}
												</Badge>
											)}
											{estaSeleccionada && (
												<Check size={16} className="text-primary shrink-0" />
											)}
										</div>
									</button>
								);
							})
						)}
					</motion.div>
				)}
			</AnimatePresence>

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
};

export default Select;
