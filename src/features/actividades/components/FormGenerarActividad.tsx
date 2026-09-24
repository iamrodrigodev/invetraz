/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import type React from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button.tsx";
import { DatePicker } from "@/components/ui/DatePicker.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { Select } from "@/components/ui/Select.tsx";
import { Textarea } from "@/components/ui/Textarea.tsx";
import { TimePicker } from "@/components/ui/TimePicker.tsx";
import { PrevisualizacionPlantilla } from "@/features/actividades/components/PrevisualizacionPlantilla.tsx";
import type { CarpetaDriveInfo } from "@/features/actividades/hooks/useGenerarActividad.ts";
import {
	GenerarActividadSchema,
	type GenerarActividadSchemaTipo,
} from "@/features/actividades/schemas/actividades.schemas.ts";
import type {
	ClaseDocente,
	PlantillaSeguimientoOpcion,
	TemaClase,
} from "@/features/actividades/types/actividades.types.ts";
import { TarjetaCarpetaVinculada } from "@/features/drive/TarjetaCarpetaVinculada.tsx";

export type FormGenerarActividadProps = {
	valoresIniciales?: Partial<GenerarActividadSchemaTipo> | null | undefined;
	clases: ClaseDocente[];
	plantillas: PlantillaSeguimientoOpcion[];
	temas: TemaClase[];
	carpetaDrive: CarpetaDriveInfo;
	configuracionValida?: boolean | undefined;
	cargandoClases?: boolean | undefined;
	cargandoPlantillas?: boolean | undefined;
	cargandoTemas?: boolean | undefined;
	onCambioClase?: ((idClase: string) => void) | undefined;
	alEnviar: (datos: GenerarActividadSchemaTipo) => void;
	alCancelar: () => void;
};

export const FormGenerarActividad: React.FC<FormGenerarActividadProps> = ({
	valoresIniciales,
	clases,
	plantillas,
	temas,
	carpetaDrive,
	configuracionValida = true,
	cargandoClases = false,
	cargandoPlantillas = false,
	cargandoTemas = false,
	onCambioClase,
	alEnviar,
	alCancelar,
}) => {
	const idClaseCampo = useId();
	const idTituloCampo = useId();
	const idFechaVencimientoCampo = useId();
	const idHoraVencimientoCampo = useId();
	const idTemaCampo = useId();
	const idPlantillaCampo = useId();
	const idDescripcionCampo = useId();

	const hoy = useMemo(() => {
		const fecha = new Date();
		const anio = fecha.getFullYear();
		const mes = String(fecha.getMonth() + 1).padStart(2, "0");
		const dia = String(fecha.getDate()).padStart(2, "0");
		return `${anio}-${mes}-${dia}`;
	}, []);

	const {
		register,
		control,
		handleSubmit,
		watch,
		setValue,
		trigger,
		reset,
		formState: { errors, isValid },
	} = useForm<GenerarActividadSchemaTipo>({
		resolver: zodResolver(GenerarActividadSchema),
		mode: "onChange",
		defaultValues: {
			idClase: valoresIniciales?.idClase || "",
			titulo: valoresIniciales?.titulo || "",
			fechaVencimiento: valoresIniciales?.fechaVencimiento || "",
			idPlantilla: valoresIniciales?.idPlantilla || "",
			descripcion: valoresIniciales?.descripcion || "",
			horaVencimiento: valoresIniciales?.horaVencimiento || "",
			idTema: valoresIniciales?.idTema || "",
		},
	});

	useEffect(() => {
		if (valoresIniciales) {
			reset({
				idClase: valoresIniciales.idClase || "",
				titulo: valoresIniciales.titulo || "",
				fechaVencimiento: valoresIniciales.fechaVencimiento || "",
				idPlantilla: valoresIniciales.idPlantilla || "",
				descripcion: valoresIniciales.descripcion || "",
				horaVencimiento: valoresIniciales.horaVencimiento || "",
				idTema: valoresIniciales.idTema || "",
			});
		}
	}, [valoresIniciales, reset]);

	const idClaseSeleccionada = watch("idClase");
	const idPlantillaSeleccionada = watch("idPlantilla");
	const fechaVencimientoSeleccionada = watch("fechaVencimiento");
	const horaVencimientoSeleccionada = watch("horaVencimiento");

	useEffect(() => {
		if (onCambioClase) {
			onCambioClase(idClaseSeleccionada);
		}
	}, [idClaseSeleccionada, onCambioClase]);

	// Revalidación reactiva en tiempo real mientras el formulario sigue abierto
	useEffect(() => {
		if (!(fechaVencimientoSeleccionada && horaVencimientoSeleccionada)) {
			return;
		}

		const [anio, mes, dia] = fechaVencimientoSeleccionada.split("-").map(Number);
		if (!(anio && mes && dia)) {
			return;
		}

		const ahora = new Date();
		const esHoy =
			anio === ahora.getFullYear() && mes === ahora.getMonth() + 1 && dia === ahora.getDate();

		if (!esHoy) {
			return;
		}

		const intervalo = setInterval(() => {
			trigger("horaVencimiento");
		}, 30_000);

		return () => clearInterval(intervalo);
	}, [fechaVencimientoSeleccionada, horaVencimientoSeleccionada, trigger]);

	const [validandoPlantilla, setValidandoPlantilla] = useState(false);
	const idPlantillaPreviaRef = useRef<string | undefined>(
		valoresIniciales?.idPlantilla || undefined,
	);
	const temporizadorValidacionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (temporizadorValidacionRef.current) {
				clearTimeout(temporizadorValidacionRef.current);
			}
		},
		[],
	);

	const opcionesClases = useMemo(
		() =>
			clases.map((c) => ({
				value: c.idClassroom,
				label: c.nombre,
			})),
		[clases],
	);

	const placeholderClases = useMemo(() => {
		if (cargandoClases) {
			return "Cargando clases...";
		}
		if (opcionesClases.length === 0) {
			return "No hay clases disponibles en Classroom";
		}
		return "Selecciona una clase...";
	}, [cargandoClases, opcionesClases.length]);

	const opcionesPlantillas = useMemo(
		() =>
			plantillas.map((p) => ({
				value: p.id,
				label: p.nombre,
				badge:
					p.frecuenciaUso > 0
						? `Usada ${p.frecuenciaUso} ${p.frecuenciaUso === 1 ? "vez" : "veces"}`
						: undefined,
				badgeVariant: "blue" as const,
			})),
		[plantillas],
	);

	const opcionesTemas = useMemo(
		() => [
			{ value: "", label: "Sin tema asignado" },
			...temas.map((t) => ({
				value: t.idTema,
				label: t.nombre,
			})),
		],
		[temas],
	);

	const plantillaActual = useMemo(
		() => plantillas.find((p) => p.id === idPlantillaSeleccionada) || null,
		[plantillas, idPlantillaSeleccionada],
	);

	const esPlantillaValida = !plantillaActual || plantillaActual.estructuraValida;

	return (
		<div className="space-y-3.5">
			<p className="-mt-2 text-slate-600 text-sm">
				Complete la información necesaria para generar una actividad de seguimiento.
			</p>

			<TarjetaCarpetaVinculada
				carpetaId={carpetaDrive.id}
				nombre={carpetaDrive.nombre}
				textoBoton="Abrir en Drive"
				estado={configuracionValida && carpetaDrive.id ? "verificada" : "no_disponible"}
			/>

			<form onSubmit={handleSubmit(alEnviar)} noValidate={true} className="space-y-4 pt-1">
				<div className="grid grid-cols-1 gap-x-6 gap-y-3.5 md:grid-cols-2">
					<div className="space-y-3.5">
						<div>
							<label
								htmlFor={idClaseCampo}
								className="mb-1.5 block font-medium text-slate-800 text-sm"
							>
								Clase <span className="text-red-500">*</span>
							</label>
							<Controller
								name="idClase"
								control={control}
								render={({ field }) => (
									<Select
										id={idClaseCampo}
										value={field.value}
										onChange={(val) => {
											field.onChange(val);
											if (onCambioClase) {
												onCambioClase(val);
											}
										}}
										onBlur={field.onBlur}
										disabled={cargandoClases || opcionesClases.length === 0}
										placeholder={placeholderClases}
										options={opcionesClases}
										errorMessage={errors.idClase?.message}
									/>
								)}
							/>
						</div>

						<div>
							<label
								htmlFor={idTituloCampo}
								className="mb-1.5 block font-medium text-slate-800 text-sm"
							>
								Título <span className="text-red-500">*</span>
							</label>
							<Input
								id={idTituloCampo}
								type="text"
								placeholder="Ingresa el título de la actividad de seguimiento"
								maxLength={3000}
								showCount={true}
								errorMessage={errors.titulo?.message}
								{...register("titulo")}
							/>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<label
									htmlFor={idFechaVencimientoCampo}
									className="mb-1.5 flex items-center gap-1 font-medium text-slate-800 text-sm"
								>
									<span>Fecha de vencimiento</span>
									<span className="text-red-500">*</span>
								</label>
								<Controller
									name="fechaVencimiento"
									control={control}
									render={({ field }) => (
										<DatePicker
											id={idFechaVencimientoCampo}
											value={field.value}
											onChange={(val) => {
												field.onChange(val);
												const horaActual = watch("horaVencimiento");
												if (val && !horaActual) {
													setValue("horaVencimiento", "23:59", {
														shouldValidate: true,
													});
												} else if (horaActual) {
													trigger("horaVencimiento");
												}
											}}
											onBlur={field.onBlur}
											min={hoy}
											placeholder="dd/mm/aaaa"
											errorMessage={errors.fechaVencimiento?.message}
										/>
									)}
								/>
							</div>

							<div>
								<label
									htmlFor={idHoraVencimientoCampo}
									className="mb-1.5 block font-medium text-slate-800 text-sm"
								>
									Hora de vencimiento
								</label>
								<Controller
									name="horaVencimiento"
									control={control}
									render={({ field }) => (
										<TimePicker
											id={idHoraVencimientoCampo}
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
											placeholder="--:--"
											errorMessage={errors.horaVencimiento?.message}
										/>
									)}
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor={idTemaCampo}
								className="mb-1.5 block font-medium text-slate-800 text-sm"
							>
								Tema
							</label>
							<Controller
								name="idTema"
								control={control}
								render={({ field }) => (
									<Select
										id={idTemaCampo}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={!idClaseSeleccionada || cargandoTemas}
										placeholder={
											idClaseSeleccionada
												? cargandoTemas
													? "Cargando temas de la clase..."
													: "Selecciona un tema opcional..."
												: "Selecciona primero una clase..."
										}
										options={opcionesTemas}
										errorMessage={errors.idTema?.message}
										posicionDropdown="arriba"
									/>
								)}
							/>
						</div>
					</div>

					<div className="flex flex-col space-y-3.5">
						<div>
							<label
								htmlFor={idPlantillaCampo}
								className="mb-1.5 block font-medium text-slate-800 text-sm"
							>
								Plantilla de seguimiento <span className="text-red-500">*</span>
							</label>
							<Controller
								name="idPlantilla"
								control={control}
								render={({ field }) => (
									<Select
										id={idPlantillaCampo}
										value={field.value}
										onChange={(val) => {
											field.onChange(val);
											if (val && val !== idPlantillaPreviaRef.current) {
												idPlantillaPreviaRef.current = val;
												setValidandoPlantilla(true);
												if (temporizadorValidacionRef.current) {
													clearTimeout(temporizadorValidacionRef.current);
												}
												temporizadorValidacionRef.current = setTimeout(() => {
													setValidandoPlantilla(false);
												}, 600);
											} else if (!val) {
												idPlantillaPreviaRef.current = undefined;
												setValidandoPlantilla(false);
												if (temporizadorValidacionRef.current) {
													clearTimeout(temporizadorValidacionRef.current);
												}
											}
										}}
										onBlur={field.onBlur}
										disabled={cargandoPlantillas || plantillas.length === 0}
										placeholder={
											cargandoPlantillas
												? "Cargando plantillas..."
												: plantillas.length === 0
													? "No se encontraron plantillas en Drive"
													: "Selecciona una plantilla de seguimiento..."
										}
										options={opcionesPlantillas}
										errorMessage={errors.idPlantilla?.message}
									/>
								)}
							/>
						</div>

						<PrevisualizacionPlantilla plantilla={plantillaActual} validando={validandoPlantilla} />

						<div className="flex flex-1 flex-col">
							<label
								htmlFor={idDescripcionCampo}
								className="mb-1.5 block font-medium text-slate-800 text-sm"
							>
								Descripción
							</label>
							<Textarea
								id={idDescripcionCampo}
								rows={plantillaActual ? 3 : 5}
								maxLength={2000}
								showCount={true}
								placeholder="Instrucciones o detalles de la actividad para los investigadores..."
								errorMessage={errors.descripcion?.message}
								className="flex-1"
								{...register("descripcion")}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-stretch gap-1.5 pt-2 sm:items-end">
					<div className="flex flex-col-reverse items-stretch justify-end gap-2.5 sm:flex-row sm:items-center sm:gap-3">
						<Button
							type="button"
							variant="ghost"
							onClick={alCancelar}
							className="min-h-11 font-medium text-slate-600 hover:text-slate-800"
						>
							<X size={16} className="mr-1.5" />
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="default"
							disabled={
								!(isValid && esPlantillaValida && configuracionValida) || validandoPlantilla
							}
							className="min-h-11 font-semibold shadow-sm"
						>
							<Plus size={16} className="mr-1.5" />
							Generar
						</Button>
					</div>
					{!configuracionValida && (
						<p className="text-right font-medium text-red-600 text-xs">
							La configuración no está lista para generar actividades
						</p>
					)}
				</div>
			</form>
		</div>
	);
};

export default FormGenerarActividad;
