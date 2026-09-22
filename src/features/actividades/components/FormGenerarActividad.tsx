import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import type React from "react";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	Button,
	DatePicker,
	Input,
	Select,
	Textarea,
	TimePicker,
} from "../../../components/ui";
import { TarjetaCarpetaVinculada } from "../../drive";
import type { CarpetaDriveInfo } from "../hooks/useGenerarActividad";
import {
	GenerarActividadSchema,
	type GenerarActividadSchemaTipo,
} from "../schemas/actividades.schemas";
import type {
	ClaseDocente,
	PlantillaSeguimientoOpcion,
	TemaClase,
} from "../types/actividades.types";
import { PrevisualizacionPlantilla } from "./PrevisualizacionPlantilla";

export interface FormGenerarActividadProps {
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
}

export const FormGenerarActividad: React.FC<FormGenerarActividadProps> = ({
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
		formState: { errors, isValid },
	} = useForm<GenerarActividadSchemaTipo>({
		resolver: zodResolver(GenerarActividadSchema),
		mode: "onChange",
		defaultValues: {
			idClase: "",
			titulo: "",
			fechaVencimiento: "",
			idPlantilla: "",
			descripcion: "",
			horaVencimiento: "",
			idTema: "",
		},
	});

	const idClaseSeleccionada = watch("idClase");
	const idPlantillaSeleccionada = watch("idPlantilla");

	useEffect(() => {
		if (onCambioClase) {
			onCambioClase(idClaseSeleccionada);
		}
	}, [idClaseSeleccionada, onCambioClase]);

	const opcionesClases = useMemo(() => {
		return clases.map((c) => ({
			value: c.idClassroom,
			label: c.nombre,
		}));
	}, [clases]);

	const opcionesPlantillas = useMemo(() => {
		return plantillas.map((p) => ({
			value: p.id,
			label: p.nombre,
			badge:
				p.frecuenciaUso > 0
					? `Usada ${p.frecuenciaUso} ${p.frecuenciaUso === 1 ? "vez" : "veces"}`
					: undefined,
			badgeVariant: "blue" as const,
		}));
	}, [plantillas]);

	const opcionesTemas = useMemo(() => {
		return [
			{ value: "", label: "Sin tema asignado" },
			...temas.map((t) => ({
				value: t.idTema,
				label: t.nombre,
			})),
		];
	}, [temas]);

	const plantillaActual = useMemo(() => {
		return plantillas.find((p) => p.id === idPlantillaSeleccionada) || null;
	}, [plantillas, idPlantillaSeleccionada]);

	const esPlantillaValida =
		!plantillaActual || plantillaActual.estructuraValida;

	return (
		<div className="space-y-3.5">
			<p className="-mt-2 text-sm text-slate-600">
				Complete la información necesaria para generar una actividad de
				seguimiento.
			</p>

			<TarjetaCarpetaVinculada
				carpetaId={carpetaDrive.id}
				nombre={carpetaDrive.nombre}
				textoBoton="Abrir en Drive"
				estado={
					configuracionValida && carpetaDrive.id
						? "verificada"
						: "no_disponible"
				}
			/>

			<form
				onSubmit={handleSubmit(alEnviar)}
				noValidate
				className="space-y-4 pt-1"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
					<div className="space-y-3.5">
						<div>
							<label
								htmlFor="idClase"
								className="mb-1.5 block text-sm font-medium text-slate-800"
							>
								Clase <span className="text-red-500">*</span>
							</label>
							<Controller
								name="idClase"
								control={control}
								render={({ field }) => (
									<Select
										id="idClase"
										value={field.value}
										onChange={(val) => {
											field.onChange(val);
											if (onCambioClase) onCambioClase(val);
										}}
										onBlur={field.onBlur}
										disabled={cargandoClases}
										placeholder={
											cargandoClases
												? "Cargando clases..."
												: "Selecciona una clase..."
										}
										options={opcionesClases}
										errorMessage={errors.idClase?.message}
									/>
								)}
							/>
						</div>

						<div>
							<label
								htmlFor="titulo"
								className="mb-1.5 block text-sm font-medium text-slate-800"
							>
								Título <span className="text-red-500">*</span>
							</label>
							<Input
								id="titulo"
								type="text"
								placeholder="Ingresa el título de la actividad de seguimiento"
								maxLength={3000}
								showCount
								errorMessage={errors.titulo?.message}
								{...register("titulo")}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<div>
								<label
									htmlFor="fechaVencimiento"
									className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-800"
								>
									<span>Fecha de vencimiento</span>
									<span className="text-red-500">*</span>
								</label>
								<Controller
									name="fechaVencimiento"
									control={control}
									render={({ field }) => (
										<DatePicker
											id="fechaVencimiento"
											value={field.value}
											onChange={field.onChange}
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
									htmlFor="horaVencimiento"
									className="mb-1.5 block text-sm font-medium text-slate-800"
								>
									Hora de vencimiento
								</label>
								<Controller
									name="horaVencimiento"
									control={control}
									render={({ field }) => (
										<TimePicker
											id="horaVencimiento"
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
								htmlFor="idTema"
								className="mb-1.5 block text-sm font-medium text-slate-800"
							>
								Tema
							</label>
							<Controller
								name="idTema"
								control={control}
								render={({ field }) => (
									<Select
										id="idTema"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={!idClaseSeleccionada || cargandoTemas}
										placeholder={
											!idClaseSeleccionada
												? "Selecciona primero una clase..."
												: cargandoTemas
													? "Cargando temas de la clase..."
													: "Selecciona un tema opcional..."
										}
										options={opcionesTemas}
										errorMessage={errors.idTema?.message}
										posicionDropdown="arriba"
									/>
								)}
							/>
						</div>
					</div>

					<div className="space-y-3.5 flex flex-col">
						<div>
							<label
								htmlFor="idPlantilla"
								className="mb-1.5 block text-sm font-medium text-slate-800"
							>
								Plantilla de seguimiento <span className="text-red-500">*</span>
							</label>
							<Controller
								name="idPlantilla"
								control={control}
								render={({ field }) => (
									<Select
										id="idPlantilla"
										value={field.value}
										onChange={field.onChange}
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

						<PrevisualizacionPlantilla plantilla={plantillaActual} />

						<div className="flex-1 flex flex-col">
							<label
								htmlFor="descripcion"
								className="mb-1.5 block text-sm font-medium text-slate-800"
							>
								Descripción
							</label>
							<Textarea
								id="descripcion"
								rows={plantillaActual ? 3 : 5}
								maxLength={2000}
								showCount
								placeholder="Instrucciones o detalles de la actividad para los investigadores..."
								errorMessage={errors.descripcion?.message}
								className="flex-1"
								{...register("descripcion")}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-end gap-1.5 pt-2">
					<div className="flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="ghost"
							onClick={alCancelar}
							className="font-medium text-slate-600 hover:text-slate-800"
						>
							<X size={16} className="mr-1.5" />
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="default"
							disabled={!isValid || !esPlantillaValida || !configuracionValida}
							className="font-semibold shadow-sm"
						>
							<Plus size={16} className="mr-1.5" />
							Generar
						</Button>
					</div>
					{!configuracionValida && (
						<p className="text-xs text-red-600 font-medium text-right">
							La configuración no está lista para generar actividades
						</p>
					)}
				</div>
			</form>
		</div>
	);
};

export default FormGenerarActividad;
