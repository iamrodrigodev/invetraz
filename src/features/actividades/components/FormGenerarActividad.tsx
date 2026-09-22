import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import type React from "react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, Textarea } from "../../../components/ui";
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
	cargandoClases?: boolean;
	cargandoPlantillas?: boolean;
	cargandoTemas?: boolean;
	onCambioClase?: (idClase: string) => void;
	alEnviar: (datos: GenerarActividadSchemaTipo) => void;
	alCancelar: () => void;
}

export const FormGenerarActividad: React.FC<FormGenerarActividadProps> = ({
	clases,
	plantillas,
	temas,
	carpetaDrive,
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

	const plantillaActual = useMemo(() => {
		return plantillas.find((p) => p.id === idPlantillaSeleccionada) || null;
	}, [plantillas, idPlantillaSeleccionada]);

	const esPlantillaValida =
		!plantillaActual || plantillaActual.estructuraValida;

	return (
		<div className="space-y-5">
			<p className="text-sm text-slate-600 leading-relaxed">
				Complete la información necesaria para generar una actividad de
				seguimiento.
			</p>

			<TarjetaCarpetaVinculada
				carpetaId={carpetaDrive.id}
				nombre={carpetaDrive.nombre}
				textoBoton="Abrir carpeta en Google Drive"
				estado="verificada"
			/>

			<form
				onSubmit={handleSubmit(alEnviar)}
				noValidate
				className="space-y-4 pt-1"
			>
				<div>
					<label
						htmlFor="idClase"
						className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
					>
						Clase <span className="text-red-500">*</span>
					</label>
					<Select
						id="idClase"
						disabled={cargandoClases}
						placeholder={
							cargandoClases ? "Cargando clases..." : "Selecciona una clase..."
						}
						errorMessage={errors.idClase?.message}
						{...register("idClase")}
					>
						<option value="" disabled>
							{cargandoClases
								? "Cargando clases..."
								: "Selecciona una clase..."}
						</option>
						{clases.map((c) => (
							<option key={c.idClassroom} value={c.idClassroom}>
								{c.nombre}
							</option>
						))}
					</Select>
				</div>

				<div>
					<label
						htmlFor="titulo"
						className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
					>
						Título <span className="text-red-500">*</span>
					</label>
					<Input
						id="titulo"
						type="text"
						placeholder="Ingresa el título de la actividad de seguimiento"
						maxLength={255}
						showCount
						errorMessage={errors.titulo?.message}
						{...register("titulo")}
					/>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div>
						<label
							htmlFor="fechaVencimiento"
							className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
						>
							Fecha de vencimiento <span className="text-red-500">*</span>
						</label>
						<Input
							id="fechaVencimiento"
							type="date"
							min={hoy}
							errorMessage={errors.fechaVencimiento?.message}
							{...register("fechaVencimiento")}
						/>
					</div>

					<div>
						<label
							htmlFor="horaVencimiento"
							className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
						>
							Hora de vencimiento
						</label>
						<Input
							id="horaVencimiento"
							type="time"
							errorMessage={errors.horaVencimiento?.message}
							{...register("horaVencimiento")}
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="idPlantilla"
						className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
					>
						Plantilla de seguimiento <span className="text-red-500">*</span>
					</label>
					<Select
						id="idPlantilla"
						disabled={cargandoPlantillas}
						placeholder={
							cargandoPlantillas
								? "Cargando plantillas..."
								: "Selecciona una plantilla de seguimiento..."
						}
						errorMessage={errors.idPlantilla?.message}
						{...register("idPlantilla")}
					>
						<option value="" disabled>
							{cargandoPlantillas
								? "Cargando plantillas..."
								: "Selecciona una plantilla de seguimiento..."}
						</option>
						{plantillas.map((p) => (
							<option key={p.id} value={p.id}>
								{p.nombre} (Usada {p.frecuenciaUso}{" "}
								{p.frecuenciaUso === 1 ? "vez" : "veces"})
							</option>
						))}
					</Select>
				</div>

				<PrevisualizacionPlantilla plantilla={plantillaActual} />

				<div>
					<label
						htmlFor="idTema"
						className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
					>
						Tema
					</label>
					<Select
						id="idTema"
						disabled={!idClaseSeleccionada || cargandoTemas}
						placeholder={
							!idClaseSeleccionada
								? "Selecciona primero una clase..."
								: cargandoTemas
									? "Cargando temas de la clase..."
									: "Selecciona un tema opcional..."
						}
						errorMessage={errors.idTema?.message}
						{...register("idTema")}
					>
						<option value="">
							{!idClaseSeleccionada
								? "Selecciona primero una clase..."
								: "Sin tema asignado"}
						</option>
						{temas.map((t) => (
							<option key={t.idTema} value={t.idTema}>
								{t.nombre}
							</option>
						))}
					</Select>
				</div>

				<div>
					<label
						htmlFor="descripcion"
						className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
					>
						Descripción
					</label>
					<Textarea
						id="descripcion"
						rows={3}
						maxLength={2000}
						showCount
						placeholder="Instrucciones o detalles de la actividad para los estudiantes..."
						errorMessage={errors.descripcion?.message}
						{...register("descripcion")}
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
						disabled={!isValid || !esPlantillaValida}
						className="font-semibold shadow-sm"
					>
						<Plus size={16} className="mr-1.5" />
						Generar
					</Button>
				</div>
			</form>
		</div>
	);
};

export default FormGenerarActividad;
