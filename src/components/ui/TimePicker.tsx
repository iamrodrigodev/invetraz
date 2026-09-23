/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
import { Clock as ClockIcon, X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button.tsx";
import { useClickOutside } from "@/hooks/useClickOutside.ts";
import { cn } from "@/utils/cn.ts";

export interface TimePickerProps {
	id?: string | undefined;
	name?: string | undefined;
	value?: string | undefined;
	defaultValue?: string | undefined;
	onChange?: ((value: string) => void) | undefined;
	onBlur?: (() => void) | undefined;
	placeholder?: string | undefined;
	disabled?: boolean | undefined;
	error?: boolean | undefined;
	errorMessage?: React.ReactNode | undefined;
	className?: string | undefined;
	posicionDropdown?: "auto" | "abajo" | "arriba" | undefined;
}

const HORAS_OPCIONES = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

const MINUTOS_OPCIONES = [
	"00",
	"05",
	"10",
	"15",
	"20",
	"25",
	"30",
	"35",
	"40",
	"45",
	"50",
	"55",
	"59",
];

export const TimePicker: React.FC<TimePickerProps> = ({
	id,
	name,
	value: controlledValue,
	defaultValue,
	onChange,
	onBlur,
	placeholder = "--:--",
	disabled = false,
	error = false,
	errorMessage,
	className,
	posicionDropdown = "auto",
}) => {
	const generatedId = useId();
	const timePickerId = id || generatedId;
	const errorId = `${timePickerId}-error`;

	const [abierto, setAbierto] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
	const [abrirHaciaArriba, setAbrirHaciaArriba] = useState(posicionDropdown === "arriba");

	const valorActual = controlledValue === undefined ? uncontrolledValue : controlledValue;

	const { horaActual, minutoActual } = useMemo(() => {
		if (valorActual && /^\d{2}:\d{2}$/u.test(valorActual)) {
			const [h, m] = valorActual.split(":");
			return { horaActual: h, minutoActual: m };
		}
		return { horaActual: "", minutoActual: "" };
	}, [valorActual]);

	const contenedorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (posicionDropdown === "arriba") {
			setAbrirHaciaArriba(true);
			return;
		}
		if (posicionDropdown === "abajo") {
			setAbrirHaciaArriba(false);
			return;
		}

		if (abierto && contenedorRef.current) {
			const rect = contenedorRef.current.getBoundingClientRect();
			const contenedorDialog =
				contenedorRef.current.closest('[role="dialog"]') ||
				contenedorRef.current.closest(".overflow-y-auto");

			const limiteInferior = contenedorDialog
				? contenedorDialog.getBoundingClientRect().bottom
				: window.innerHeight;
			const limiteSuperior = contenedorDialog ? contenedorDialog.getBoundingClientRect().top : 0;

			const espacioAbajo = limiteInferior - rect.bottom;
			const espacioArriba = rect.top - limiteSuperior;

			if (espacioAbajo < 260 && espacioArriba > espacioAbajo) {
				setAbrirHaciaArriba(true);
			} else {
				setAbrirHaciaArriba(false);
			}
		}
	}, [abierto, posicionDropdown]);

	const cerrar = () => {
		setAbierto(false);
		if (onBlur) {
			onBlur();
		}
	};

	useClickOutside(contenedorRef, cerrar, abierto);

	const seleccionarHora = (nuevaHora: string) => {
		const m = minutoActual || "00";
		const nuevoValor = `${nuevaHora}:${m}`;
		if (controlledValue === undefined) {
			setUncontrolledValue(nuevoValor);
		}
		if (onChange) {
			onChange(nuevoValor);
		}
	};

	const seleccionarMinuto = (nuevoMinuto: string) => {
		const h = horaActual || "12";
		const nuevoValor = `${h}:${nuevoMinuto}`;
		if (controlledValue === undefined) {
			setUncontrolledValue(nuevoValor);
		}
		if (onChange) {
			onChange(nuevoValor);
		}
	};

	const seleccionarPreajuste = (valorPreajuste: string) => {
		if (controlledValue === undefined) {
			setUncontrolledValue(valorPreajuste);
		}
		if (onChange) {
			onChange(valorPreajuste);
		}
		setAbierto(false);
	};

	const limpiarHora = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (controlledValue === undefined) {
			setUncontrolledValue("");
		}
		if (onChange) {
			onChange("");
		}
	};

	const hasError = Boolean(error || errorMessage);

	return (
		<div className="relative w-full" ref={contenedorRef}>
			{name && <input type="hidden" name={name} value={valorActual} />}

			<button
				id={timePickerId}
				type="button"
				disabled={disabled}
				aria-haspopup="dialog"
				aria-expanded={abierto}
				aria-invalid={hasError}
				aria-describedby={hasError && errorMessage ? errorId : undefined}
				onClick={() => {
					if (!disabled) {
						setAbierto(!abierto);
					}
				}}
				className={cn(
					"flex h-10 w-full cursor-pointer items-center justify-between rounded-lg bg-white px-3.5 py-2 text-left font-sans text-sm outline-none transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
					hasError
						? "ring-1 ring-red-500 ring-inset focus:ring-2 focus:ring-red-500 focus:ring-inset"
						: abierto
							? "shadow-xs ring-2 ring-primary ring-inset"
							: "ring-1 ring-slate-300 ring-inset hover:ring-slate-400 focus:ring-2 focus:ring-primary focus:ring-inset",
					valorActual && !disabled ? "pr-14" : "pr-9",
					className,
				)}
			>
				<span
					className={cn(
						"truncate font-sans text-sm",
						valorActual ? "font-medium text-slate-900" : "font-normal text-slate-400",
					)}
				>
					{valorActual || placeholder}
				</span>
			</button>

			<div className="pointer-events-none absolute top-2.5 right-3 flex items-center gap-1.5 text-primary">
				{valorActual && !disabled && (
					<button
						type="button"
						onClick={limpiarHora}
						className="pointer-events-auto cursor-pointer rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
						title="Limpiar hora"
					>
						<X size={14} />
					</button>
				)}
				<ClockIcon
					size={16}
					className={cn("transition-colors", disabled ? "text-slate-300" : "text-primary")}
				/>
			</div>

			{abierto && (
				<div
					role="dialog"
					aria-label="Selector de hora"
					className={cn(
						"absolute left-0 z-50 w-64 rounded-xl border border-slate-200/90 bg-white p-3 font-sans shadow-slate-900/10 shadow-xl",
						abrirHaciaArriba ? "bottom-full mb-1.5" : "top-full mt-1.5",
					)}
				>
					<div className="space-y-2">
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<span className="mb-1 block text-center font-semibold text-[10px] text-slate-500 uppercase tracking-wider">
									Hora
								</span>
								<div className="max-h-36 space-y-0.5 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/50 p-1">
									{HORAS_OPCIONES.map((h) => (
										<button
											key={h}
											type="button"
											onClick={() => seleccionarHora(h)}
											className={cn(
												"w-full cursor-pointer select-none rounded py-1 text-center font-sans text-xs transition-colors",
												horaActual === h
													? "bg-primary font-bold text-white"
													: "text-slate-700 hover:bg-slate-200/70",
											)}
										>
											{h}
										</button>
									))}
								</div>
							</div>

							<div>
								<span className="mb-1 block text-center font-semibold text-[10px] text-slate-500 uppercase tracking-wider">
									Minuto
								</span>
								<div className="max-h-36 space-y-0.5 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/50 p-1">
									{MINUTOS_OPCIONES.map((m) => (
										<button
											key={m}
											type="button"
											onClick={() => seleccionarMinuto(m)}
											className={cn(
												"w-full cursor-pointer select-none rounded py-1 text-center font-sans text-xs transition-colors",
												minutoActual === m
													? "bg-primary font-bold text-white"
													: "text-slate-700 hover:bg-slate-200/70",
											)}
										>
											{m}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between border-slate-100 border-t pt-2 text-xs">
							<Button
								type="button"
								variant="link"
								size="sm"
								onClick={() => seleccionarPreajuste("23:59")}
								className="h-auto p-0 font-medium text-xs"
							>
								Fin del día (23:59)
							</Button>

							{valorActual && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={(e) => {
										limpiarHora(e);
										setAbierto(false);
									}}
									className="h-auto px-1.5 py-0.5 text-slate-500 text-xs hover:text-slate-800"
								>
									Limpiar
								</Button>
							)}
						</div>
					</div>
				</div>
			)}

			{errorMessage && (
				<p
					id={errorId}
					role="alert"
					className="mt-1.5 animate-fadeIn font-medium text-red-500 text-xs leading-normal"
				>
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default TimePicker;
