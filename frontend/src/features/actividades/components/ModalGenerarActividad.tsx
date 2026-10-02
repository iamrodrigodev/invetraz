import type React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal.tsx";
import { FormGenerarActividad } from "@/features/actividades/components/FormGenerarActividad.tsx";
import { ModalConfirmarGeneracion } from "@/features/actividades/components/ModalConfirmarGeneracion.tsx";
import { ModalErrorGeneracion } from "@/features/actividades/components/ModalErrorGeneracion.tsx";
import { ModalExitoGeneracion } from "@/features/actividades/components/ModalExitoGeneracion.tsx";
import { useGenerarActividad } from "@/features/actividades/hooks/useGenerarActividad.ts";
import {
	GenerarActividadSchema,
	type GenerarActividadSchemaTipo,
} from "@/features/actividades/schemas/actividades.schemas.ts";
import type { ResumenConfirmacionActividad } from "@/features/actividades/types/actividades.types.ts";
import { esFormatoGoogleSheet } from "@/utils/formatoPlantilla.ts";

export type ModalGenerarActividadProps = {
	abierto: boolean;
	alCerrar: () => void;
	onActividadGenerada?: () => void;
};

export const ModalGenerarActividad: React.FC<ModalGenerarActividadProps> = ({
	abierto,
	alCerrar,
	onActividadGenerada,
}) => {
	const {
		clases,
		plantillas,
		temas,
		carpetaDrive,
		configuracionValida,
		cargandoClases,
		cargandoPlantillas,
		cargandoTemas,
		generando,
		cargarTemasDeClase,
		ejecutarGeneracion,
	} = useGenerarActividad(true);

	const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);
	const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
	const [modalErrorAbierto, setModalErrorAbierto] = useState(false);
	const [resumen, setResumen] = useState<ResumenConfirmacionActividad | null>(null);
	const [valoresActuales, setValoresActuales] = useState<GenerarActividadSchemaTipo | null>(null);

	const manejarCancelar = () => {
		setResumen(null);
		setValoresActuales(null);
		setModalConfirmarAbierto(false);
		setModalExitoAbierto(false);
		setModalErrorAbierto(false);
		alCerrar();
	};

	const abrirConfirmacion = (datos: GenerarActividadSchemaTipo) => {
		if (!configuracionValida) {
			return;
		}
		setValoresActuales(datos);
		const claseObj = clases.find((c) => c.idClassroom === datos.idClase);
		const plantillaObj = plantillas.find((p) => p.id === datos.idPlantilla);
		const temaObj = temas.find((t) => t.idTema === datos.idTema);

		const esSheet = esFormatoGoogleSheet(plantillaObj);

		setResumen({
			nombreClase: claseObj ? claseObj.nombre : datos.idClase,
			titulo: datos.titulo,
			nombrePlantilla: plantillaObj ? plantillaObj.nombre : datos.idPlantilla,
			fechaVencimiento: datos.fechaVencimiento,
			horaVencimiento: datos.horaVencimiento || undefined,
			nombreTema: temaObj ? temaObj.nombre : undefined,
			descripcion: datos.descripcion || undefined,
			enlacePlantillaWeb:
				plantillaObj?.enlaceWeb ||
				(datos.idPlantilla ? `https://drive.google.com/open?id=${datos.idPlantilla}` : undefined),
			esGoogleSheet: esSheet,
		});

		setModalConfirmarAbierto(true);
	};

	const ejecutarConfirmacion = async () => {
		if (!valoresActuales) {
			return;
		}

		const validacionFresca = GenerarActividadSchema.safeParse(valoresActuales);
		if (!validacionFresca.success) {
			setModalConfirmarAbierto(false);
			return;
		}

		try {
			const claseObj = clases.find((c) => c.idClassroom === valoresActuales.idClase);
			const plantillaObj = plantillas.find((p) => p.id === valoresActuales.idPlantilla);
			const temaObj = temas.find((t) => t.idTema === valoresActuales.idTema);

			const exito = await ejecutarGeneracion({
				...valoresActuales,
				nombreClase: claseObj?.nombre,
				nombrePlantilla: plantillaObj?.nombre,
				enlacePlantilla:
					plantillaObj?.enlaceWeb ||
					(valoresActuales.idPlantilla
						? `https://drive.google.com/open?id=${valoresActuales.idPlantilla}`
						: undefined),
				nombreTema: temaObj?.nombre,
			});
			if (exito) {
				setModalConfirmarAbierto(false);
				setModalExitoAbierto(true);
			} else {
				setModalConfirmarAbierto(false);
				setModalErrorAbierto(true);
			}
		} catch {
			setModalConfirmarAbierto(false);
			setModalErrorAbierto(true);
		}
	};

	const completarYSalir = () => {
		setModalExitoAbierto(false);
		setResumen(null);
		setValoresActuales(null);
		alCerrar();
		if (onActividadGenerada) {
			onActividadGenerada();
		}
	};

	return (
		<>
			<Modal
				abierto={abierto && !modalExitoAbierto && !modalErrorAbierto}
				alCerrar={manejarCancelar}
				titulo="Generar actividades de seguimiento"
				className={modalConfirmarAbierto ? "pointer-events-none max-w-4xl" : "max-w-4xl"}
			>
				<FormGenerarActividad
					valoresIniciales={valoresActuales}
					clases={clases}
					plantillas={plantillas}
					temas={temas}
					carpetaDrive={carpetaDrive}
					configuracionValida={configuracionValida}
					cargandoClases={cargandoClases}
					cargandoPlantillas={cargandoPlantillas}
					cargandoTemas={cargandoTemas}
					onCambioClase={cargarTemasDeClase}
					alEnviar={abrirConfirmacion}
					alCancelar={manejarCancelar}
				/>
			</Modal>

			<ModalConfirmarGeneracion
				abierto={modalConfirmarAbierto}
				cargando={generando}
				resumen={resumen}
				alConfirmar={ejecutarConfirmacion}
				alCerrar={() => setModalConfirmarAbierto(false)}
			/>

			<ModalExitoGeneracion abierto={modalExitoAbierto} alAceptar={completarYSalir} />

			<ModalErrorGeneracion
				abierto={modalErrorAbierto}
				alAceptar={() => setModalErrorAbierto(false)}
			/>
		</>
	);
};

export default ModalGenerarActividad;
