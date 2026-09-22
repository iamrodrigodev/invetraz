import type React from "react";
import { useState } from "react";
import { Modal } from "../../../components/ui";
import { useGenerarActividad } from "../hooks/useGenerarActividad";
import type { GenerarActividadSchemaTipo } from "../schemas/actividades.schemas";
import type { ResumenConfirmacionActividad } from "../types/actividades.types";
import { FormGenerarActividad } from "./FormGenerarActividad";
import { ModalConfirmarGeneracion } from "./ModalConfirmarGeneracion";
import { ModalExitoGeneracion } from "./ModalExitoGeneracion";

export interface ModalGenerarActividadProps {
	abierto: boolean;
	alCerrar: () => void;
	onActividadGenerada?: () => void;
}

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
		cargandoClases,
		cargandoPlantillas,
		cargandoTemas,
		generando,
		cargarTemasDeClase,
		ejecutarGeneracion,
	} = useGenerarActividad(abierto);

	const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);
	const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
	const [resumen, setResumen] = useState<ResumenConfirmacionActividad | null>(
		null,
	);
	const [valoresActuales, setValoresActuales] =
		useState<GenerarActividadSchemaTipo | null>(null);

	const manejarCancelar = () => {
		setResumen(null);
		setValoresActuales(null);
		setModalConfirmarAbierto(false);
		setModalExitoAbierto(false);
		alCerrar();
	};

	const abrirConfirmacion = (datos: GenerarActividadSchemaTipo) => {
		setValoresActuales(datos);
		const claseObj = clases.find((c) => c.idClassroom === datos.idClase);
		const plantillaObj = plantillas.find((p) => p.id === datos.idPlantilla);
		const temaObj = temas.find((t) => t.idTema === datos.idTema);

		setResumen({
			nombreClase: claseObj ? claseObj.nombre : datos.idClase,
			titulo: datos.titulo,
			nombrePlantilla: plantillaObj ? plantillaObj.nombre : datos.idPlantilla,
			fechaVencimiento: datos.fechaVencimiento,
			horaVencimiento: datos.horaVencimiento || undefined,
			nombreTema: temaObj ? temaObj.nombre : undefined,
			descripcion: datos.descripcion || undefined,
			enlacePlantillaWeb: plantillaObj?.enlaceWeb,
		});

		setModalConfirmarAbierto(true);
	};

	const ejecutarConfirmacion = async () => {
		if (!valoresActuales) return;
		const exito = await ejecutarGeneracion(valoresActuales);
		if (exito) {
			setModalConfirmarAbierto(false);
			setModalExitoAbierto(true);
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
				abierto={abierto && !modalConfirmarAbierto && !modalExitoAbierto}
				alCerrar={manejarCancelar}
				titulo="Generar actividades de seguimiento"
				className="max-w-2xl"
			>
				<FormGenerarActividad
					clases={clases}
					plantillas={plantillas}
					temas={temas}
					carpetaDrive={carpetaDrive}
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

			<ModalExitoGeneracion
				abierto={modalExitoAbierto}
				alAceptar={completarYSalir}
			/>
		</>
	);
};

export default ModalGenerarActividad;
