import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

export interface DatePickerProps {
	id?: string | undefined;
	name?: string | undefined;
	value?: string | undefined;
	defaultValue?: string | undefined;
	onChange?: ((value: string) => void) | undefined;
	onBlur?: (() => void) | undefined;
	placeholder?: string | undefined;
	min?: string | undefined;
	max?: string | undefined;
	disabled?: boolean | undefined;
	error?: boolean | undefined;
	errorMessage?: React.ReactNode | undefined;
	className?: string | undefined;
	posicionDropdown?: "auto" | "abajo" | "arriba" | undefined;
}

const NOMBRES_MESES = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export const DatePicker: React.FC<DatePickerProps> = ({
	id,
	name,
	value: controlledValue,
	defaultValue,
	onChange,
	onBlur,
	placeholder = "dd/mm/aaaa",
	min,
	max,
	disabled = false,
	error = false,
	errorMessage,
	className,
	posicionDropdown = "auto",
}) => {
	const generatedId = useId();
	const datePickerId = id || generatedId;
	const errorId = `${datePickerId}-error`;

	const [abierto, setAbierto] = useState(false);
	const [uncontrolledValue, setUncontrolledValue] = useState(
		defaultValue || "",
	);
	const [abrirHaciaArriba, setAbrirHaciaArriba] = useState(
		posicionDropdown === "arriba",
	);

	const valorActual =
		controlledValue !== undefined ? controlledValue : uncontrolledValue;

	const hoyObj = useMemo(() => new Date(), []);
	const fechaHoyStr = useMemo(() => {
		const anio = hoyObj.getFullYear();
		const mes = String(hoyObj.getMonth() + 1).padStart(2, "0");
		const dia = String(hoyObj.getDate()).padStart(2, "0");
		return `${anio}-${mes}-${dia}`;
	}, [hoyObj]);

	const fechaInicial = useMemo(() => {
		if (valorActual && /^\d{4}-\d{2}-\d{2}$/.test(valorActual)) {
			const partes = valorActual.split("-").map(Number);
			const anio = partes[0] ?? hoyObj.getFullYear();
			const mes = (partes[1] ?? hoyObj.getMonth() + 1) - 1;
			return { anio, mes };
		}
		if (min && /^\d{4}-\d{2}-\d{2}$/.test(min)) {
			const partes = min.split("-").map(Number);
			const anio = partes[0] ?? hoyObj.getFullYear();
			const mes = (partes[1] ?? hoyObj.getMonth() + 1) - 1;
			return { anio, mes };
		}
		return { anio: hoyObj.getFullYear(), mes: hoyObj.getMonth() };
	}, [valorActual, min, hoyObj]);

	const [mesVisual, setMesVisual] = useState<number>(fechaInicial.mes);
	const [anioVisual, setAnioVisual] = useState<number>(fechaInicial.anio);

	const contenedorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (valorActual && /^\d{4}-\d{2}-\d{2}$/.test(valorActual)) {
			const partes = valorActual.split("-").map(Number);
			const anio = partes[0] ?? hoyObj.getFullYear();
			const mes = (partes[1] ?? hoyObj.getMonth() + 1) - 1;
			setMesVisual(mes);
			setAnioVisual(anio);
		}
	}, [valorActual, hoyObj]);

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

			if (espacioAbajo < 320 && espacioArriba > espacioAbajo) {
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

	const irMesAnterior = () => {
		if (mesVisual === 0) {
			setMesVisual(11);
			setAnioVisual((prev) => prev - 1);
		} else {
			setMesVisual((prev) => prev - 1);
		}
	};

	const irMesSiguiente = () => {
		if (mesVisual === 11) {
			setMesVisual(0);
			setAnioVisual((prev) => prev + 1);
		} else {
			setMesVisual((prev) => prev + 1);
		}
	};

	const diasCalendario = useMemo(() => {
		const primerDiaSemana =
			(new Date(anioVisual, mesVisual, 1).getDay() + 6) % 7;
		const totalDiasMesActual = new Date(anioVisual, mesVisual + 1, 0).getDate();
		const totalDiasMesAnterior = new Date(anioVisual, mesVisual, 0).getDate();

		const celdas: Array<{
			dia: number;
			mesOffset: number;
			fechaStr: string;
			esMesActual: boolean;
			deshabilitado: boolean;
			esHoy: boolean;
			estaSeleccionado: boolean;
		}> = [];

		for (let i = primerDiaSemana - 1; i >= 0; i--) {
			const dia = totalDiasMesAnterior - i;
			const mes = mesVisual === 0 ? 11 : mesVisual - 1;
			const anio = mesVisual === 0 ? anioVisual - 1 : anioVisual;
			const fechaStr = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
			const deshabilitado = Boolean(
				(min && fechaStr < min) || (max && fechaStr > max),
			);
			celdas.push({
				dia,
				mesOffset: -1,
				fechaStr,
				esMesActual: false,
				deshabilitado,
				esHoy: fechaStr === fechaHoyStr,
				estaSeleccionado: fechaStr === valorActual,
			});
		}

		for (let dia = 1; dia <= totalDiasMesActual; dia++) {
			const fechaStr = `${anioVisual}-${String(mesVisual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
			const deshabilitado = Boolean(
				(min && fechaStr < min) || (max && fechaStr > max),
			);
			celdas.push({
				dia,
				mesOffset: 0,
				fechaStr,
				esMesActual: true,
				deshabilitado,
				esHoy: fechaStr === fechaHoyStr,
				estaSeleccionado: fechaStr === valorActual,
			});
		}

		const celdasRestantes = (7 - (celdas.length % 7)) % 7;
		for (let dia = 1; dia <= celdasRestantes; dia++) {
			const mes = mesVisual === 11 ? 0 : mesVisual + 1;
			const anio = mesVisual === 11 ? anioVisual + 1 : anioVisual;
			const fechaStr = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
			const deshabilitado = Boolean(
				(min && fechaStr < min) || (max && fechaStr > max),
			);
			celdas.push({
				dia,
				mesOffset: 1,
				fechaStr,
				esMesActual: false,
				deshabilitado,
				esHoy: fechaStr === fechaHoyStr,
				estaSeleccionado: fechaStr === valorActual,
			});
		}

		return celdas;
	}, [anioVisual, mesVisual, min, max, fechaHoyStr, valorActual]);

	const seleccionarFecha = (fechaStr: string, deshabilitado: boolean) => {
		if (deshabilitado) return;
		if (controlledValue === undefined) {
			setUncontrolledValue(fechaStr);
		}
		if (onChange) {
			onChange(fechaStr);
		}
		setAbierto(false);
	};

	const limpiarFecha = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (controlledValue === undefined) {
			setUncontrolledValue("");
		}
		if (onChange) {
			onChange("");
		}
	};

	const seleccionarHoy = () => {
		const deshabilitado = Boolean(
			(min && fechaHoyStr < min) || (max && fechaHoyStr > max),
		);
		if (deshabilitado) return;
		if (controlledValue === undefined) {
			setUncontrolledValue(fechaHoyStr);
		}
		if (onChange) {
			onChange(fechaHoyStr);
		}
		setMesVisual(hoyObj.getMonth());
		setAnioVisual(hoyObj.getFullYear());
		setAbierto(false);
	};

	const textoMostrado = useMemo(() => {
		if (!valorActual || !/^\d{4}-\d{2}-\d{2}$/.test(valorActual)) {
			return "";
		}
		const [anio, mes, dia] = valorActual.split("-");
		return `${dia}/${mes}/${anio}`;
	}, [valorActual]);

	const hasError = Boolean(error || errorMessage);

	return (
		<div className="relative w-full" ref={contenedorRef}>
			{name && <input type="hidden" name={name} value={valorActual} />}

			<button
				id={datePickerId}
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
						"truncate",
						textoMostrado
							? "font-medium text-slate-900"
							: "font-normal text-slate-400",
					)}
				>
					{textoMostrado || placeholder}
				</span>
			</button>

			<div className="absolute right-3 top-2.5 flex items-center gap-1.5 text-slate-400 pointer-events-none">
				{valorActual && !disabled && (
					<button
						type="button"
						onClick={limpiarFecha}
						className="pointer-events-auto rounded-full p-0.5 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
						title="Limpiar fecha"
					>
						<X size={14} />
					</button>
				)}
				<CalendarIcon
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
					aria-label="Selector de fecha"
					className={cn(
						"absolute left-0 z-50 w-72 rounded-xl border border-slate-200/90 bg-white p-3 shadow-xl shadow-slate-900/10 font-sans sm:w-80",
						abrirHaciaArriba ? "bottom-full mb-1.5" : "top-full mt-1.5",
					)}
				>
					<div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={irMesAnterior}
							title="Mes anterior"
						>
							<ChevronLeft size={16} />
						</Button>

						<span className="text-xs font-bold uppercase tracking-wider text-slate-800">
							{NOMBRES_MESES[mesVisual]} {anioVisual}
						</span>

						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={irMesSiguiente}
							title="Mes siguiente"
						>
							<ChevronRight size={16} />
						</Button>
					</div>

					<div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-1.5">
						{DIAS_SEMANA.map((dia) => (
							<div key={dia} className="py-0.5">
								{dia}
							</div>
						))}
					</div>

					<div className="grid grid-cols-7 gap-1">
						{diasCalendario.map((celda) => (
							<button
								key={celda.fechaStr}
								type="button"
								disabled={celda.deshabilitado}
								onClick={() =>
									seleccionarFecha(celda.fechaStr, celda.deshabilitado)
								}
								className={cn(
									"flex h-8 w-full items-center justify-center rounded-lg text-xs font-medium transition-all select-none",
									celda.deshabilitado
										? "opacity-25 cursor-not-allowed text-slate-400 hover:bg-transparent"
										: "cursor-pointer",
									!celda.esMesActual && "text-slate-300",
									celda.esMesActual &&
										!celda.estaSeleccionado &&
										!celda.deshabilitado &&
										"text-slate-700 hover:bg-slate-100 hover:text-slate-900",
									celda.esHoy &&
										!celda.estaSeleccionado &&
										"ring-1 ring-inset ring-primary text-primary font-bold hover:bg-primary/5",
									celda.estaSeleccionado &&
										"bg-primary text-white font-bold shadow-xs hover:bg-primary/95",
								)}
							>
								{celda.dia}
							</button>
						))}
					</div>

					<div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
						<Button
							type="button"
							variant="link"
							size="sm"
							onClick={seleccionarHoy}
							disabled={Boolean(
								(min && fechaHoyStr < min) || (max && fechaHoyStr > max),
							)}
							className="h-auto p-0 text-xs font-semibold"
						>
							Hoy
						</Button>

						{valorActual && (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={(e) => {
									limpiarFecha(e);
									setAbierto(false);
								}}
								className="h-auto px-1.5 py-0.5 text-xs text-slate-500 hover:text-slate-800"
							>
								Limpiar
							</Button>
						)}
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

export default DatePicker;
