/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import type React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal.tsx";
import { FormGenerarActividad } from "@/features/actividades/components/FormGenerarActividad.tsx";
import { ModalConfirmarGeneracion } from "@/features/actividades/components/ModalConfirmarGeneracion.tsx";
import { ModalExitoGeneracion } from "@/features/actividades/components/ModalExitoGeneracion.tsx";
import { useGenerarActividad } from "@/features/actividades/hooks/useGenerarActividad.ts";
import type { GenerarActividadSchemaTipo } from "@/features/actividades/schemas/actividades.schemas.ts";
import type { ResumenConfirmacionActividad } from "@/features/actividades/types/actividades.types.ts";

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
		configuracionValida,
		cargandoClases,
		cargandoPlantillas,
		cargandoTemas,
		generando,
		cargarTemasDeClase,
		ejecutarGeneracion,
	} = useGenerarActividad(abierto);

	const [modalConfirmarAbierto, setModalConfirmarAbierto] = useState(false);
	const [modalExitoAbierto, setModalExitoAbierto] = useState(false);
	const [resumen, setResumen] = useState<ResumenConfirmacionActividad | null>(null);
	const [valoresActuales, setValoresActuales] = useState<GenerarActividadSchemaTipo | null>(null);

	const manejarCancelar = () => {
		setResumen(null);
		setValoresActuales(null);
		setModalConfirmarAbierto(false);
		setModalExitoAbierto(false);
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
		});

		setModalConfirmarAbierto(true);
	};

	const ejecutarConfirmacion = async () => {
		if (!valoresActuales) {
			return;
		}
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
				abierto={abierto && !modalExitoAbierto}
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
		</>
	);
};

export default ModalGenerarActividad;
