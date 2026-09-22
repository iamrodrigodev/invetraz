import { Clock as ClockIcon, X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../utils/cn";

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

const HORAS_OPCIONES = Array.from({ length: 24 }, (_, i) =>
	String(i).padStart(2, "0"),
);

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
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || "",
	);
	const [abrirHaciaArriba, setAbrirHaciaArriba] = useState(
		posicionDropdown === "arriba",
	);

	const valorActual =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;

	const { horaActual, minutoActual } = useMemo(() => {
		if (valorActual && /^\d{2}:\d{2}$/.test(valorActual)) {
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
			const limiteSuperior = contenedorDialog
				? contenedorDialog.getBoundingClientRect().top
				: 0;

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
					"flex h-10 w-full items-center justify-between rounded-lg bg-white px-3.5 py-2 text-sm text-left outline-none transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 font-sans",
					hasError
						? "ring-1 ring-inset ring-red-500 focus:ring-2 focus:ring-inset focus:ring-red-500"
						: abierto
							? "ring-2 ring-inset ring-primary shadow-xs"
							: "ring-1 ring-inset ring-slate-300 hover:ring-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary",
					valorActual && !disabled ? "pr-14" : "pr-9",
					className,
				)}
			>
				<span
					className={cn(
						"truncate font-sans text-sm",
						valorActual
							? "font-medium text-slate-900"
							: "font-normal text-slate-400",
					)}
				>
					{valorActual || placeholder}
				</span>
			</button>

			<div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-slate-400 pointer-events-none">
				{valorActual && !disabled && (
					<button
						type="button"
						onClick={limpiarHora}
						className="pointer-events-auto rounded-full p-0.5 hover:bg-slate-100 hover:text-slate-600 transition-colors"
						title="Limpiar hora"
					>
						<X size={14} />
					</button>
				)}
				<ClockIcon
					size={16}
					className={cn(
						"transition-colors",
						abierto ? "text-primary" : "text-slate-400",
					)}
				/>
			</div>

			{abierto && (
				<div
					role="dialog"
					aria-label="Selector de hora"
					className={cn(
						"absolute left-0 z-50 w-64 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xl shadow-slate-900/10 font-sans",
						abrirHaciaArriba ? "bottom-full mb-1.5" : "top-full mt-1.5",
					)}
				>
					<div className="space-y-2">
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div>
								<span className="block mb-1 text-center font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
									Hora
								</span>
								<div className="max-h-36 overflow-y-auto space-y-0.5 rounded-lg border border-slate-100 bg-slate-50/50 p-1">
									{HORAS_OPCIONES.map((h) => (
										<button
											key={h}
											type="button"
											onClick={() => seleccionarHora(h)}
											className={cn(
												"w-full py-1 text-center font-sans rounded text-xs transition-colors",
												horaActual === h
													? "bg-primary text-white font-bold"
													: "text-slate-700 hover:bg-slate-200/70",
											)}
										>
											{h}
										</button>
									))}
								</div>
							</div>

							<div>
								<span className="block mb-1 text-center font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
									Minuto
								</span>
								<div className="max-h-36 overflow-y-auto space-y-0.5 rounded-lg border border-slate-100 bg-slate-50/50 p-1">
									{MINUTOS_OPCIONES.map((m) => (
										<button
											key={m}
											type="button"
											onClick={() => seleccionarMinuto(m)}
											className={cn(
												"w-full py-1 text-center font-sans rounded text-xs transition-colors",
												minutoActual === m
													? "bg-primary text-white font-bold"
													: "text-slate-700 hover:bg-slate-200/70",
											)}
										>
											{m}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
							<button
								type="button"
								onClick={() => seleccionarPreajuste("23:59")}
								className="font-medium text-primary hover:underline"
							>
								Fin del día (23:59)
							</button>

							{valorActual && (
								<button
									type="button"
									onClick={(e) => {
										limpiarHora(e);
										setAbierto(false);
									}}
									className="text-slate-500 hover:text-slate-800"
								>
									Limpiar
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{errorMessage && (
				<p
					id={errorId}
					role="alert"
					className="mt-1.5 text-xs text-red-500 font-medium leading-normal animate-fadeIn"
				>
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default TimePicker;
