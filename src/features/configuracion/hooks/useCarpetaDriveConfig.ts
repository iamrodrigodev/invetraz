import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { resolverVistaCarpetaDrive } from "../../../components/drive/estadoCarpetaDrive";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import {
	verificarCarpetaDrive,
	vincularCarpetaDrive,
} from "../../plantillas/api/plantillas.api";
import type { TipoEstadoConexion } from "../components/EstadoConexionBadge";
import { useVerificacionConexion } from "./useVerificacionConexion";

export interface UseCarpetaDriveConfigOptions {
	carpetaIdInicial?: string | null | undefined;
	carpetaNombreInicial?: string | null | undefined;
	carpetaVerificadaInicial?: boolean | undefined;
	onCarpetaActualizada?: (
		id: string,
		nombre: string | null,
		verificado?: boolean,
	) => void;
	estadoCredencialesGoogle?: TipoEstadoConexion | undefined;
}

function normalizarId(entrada: string): string {
	const limpia = entrada.trim();
	if (!limpia) return "";
	const match = /(?:folders\/|id=)([a-zA-Z0-9_-]+)/.exec(limpia);
	if (match?.[1]) return match[1];
	return limpia;
}

export function useCarpetaDriveConfig({
	carpetaIdInicial,
	carpetaNombreInicial,
	carpetaVerificadaInicial,
	onCarpetaActualizada,
	estadoCredencialesGoogle = "no_configurado",
}: UseCarpetaDriveConfigOptions) {
	const [carpetaId, setCarpetaId] = useState<string | null>(
		carpetaIdInicial ?? null,
	);
	const [carpetaNombre, setCarpetaNombre] = useState<string | null>(
		carpetaNombreInicial ?? null,
	);
	const [inputUrl, setInputUrl] = useState<string>(carpetaIdInicial ?? "");
	const [tocado, setTocado] = useState(false);
	const [errorDescartado, setErrorDescartado] = useState(false);

	useEffect(() => {
		setCarpetaId(carpetaIdInicial ?? null);
		setInputUrl(carpetaIdInicial ?? "");
		setCarpetaNombre(carpetaNombreInicial ?? null);
	}, [carpetaIdInicial, carpetaNombreInicial]);

	const idActual = useMemo(() => normalizarId(inputUrl), [inputUrl]);
	const credencialesGoogleVerificadas =
		estadoCredencialesGoogle === "conectado";
	const credencialesGoogleVerificando =
		estadoCredencialesGoogle === "verificando";
	const camposCompletos = Boolean(inputUrl.trim());

	const errorValidacion = useMemo(() => {
		const limpia = inputUrl.trim();
		if (!limpia) {
			return "El enlace o ID de la carpeta de Google Drive es obligatorio";
		}
		if (inputUrl.length > VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID) {
			return `El enlace o ID no puede exceder los ${VALIDATION_LIMITS.MAX_GOOGLE_DRIVE_FOLDER_ID} caracteres`;
		}
		return null;
	}, [inputUrl]);

	const actualizarCarpeta = (
		id: string,
		nombre: string | null,
		verificado?: boolean,
	) => {
		setCarpetaId(id);
		setCarpetaNombre(nombre);
		onCarpetaActualizada?.(id, nombre, verificado);
	};

	const valorGuardadoVerificado = Boolean(
		(credencialesGoogleVerificadas || credencialesGoogleVerificando) &&
			(carpetaVerificadaInicial || carpetaNombreInicial),
	);

	const conexion = useVerificacionConexion<string>({
		valorActual: idActual,
		valorGuardado: carpetaId,
		sonIguales: (a, b) => (a ?? "") === (b ?? ""),
		esValido: Boolean(camposCompletos && !errorValidacion),
		tieneValorGuardado: Boolean(carpetaId),
		valorGuardadoVerificado,
		estadoGuardadoSinVerificar: "guardado_pendiente",
		onVerificar: async () => {
			const res = await verificarCarpetaDrive({
				carpetaUrlOId: inputUrl.trim(),
			});
			const nuevoId = res.carpetaId ?? idActual;
			const nuevoNombre = res.carpetaNombre ?? null;
			const nuevoVerificado = Boolean(res.driveVerificado ?? nuevoNombre);
			actualizarCarpeta(nuevoId, nuevoNombre, nuevoVerificado);
			return `¡Conexión verificada exitosamente con Google Drive! Se encontraron ${res.plantillas.length} ${
				res.plantillas.length === 1 ? "plantilla" : "plantillas"
			} .xlsx en "${res.carpetaNombre || "Carpeta de Google Drive"}".`;
		},
		onGuardar: async () => {
			const res = await vincularCarpetaDrive({
				carpetaUrlOId: inputUrl.trim(),
			});
			const nuevoId = res.carpetaId ?? idActual;
			const nuevoNombre = res.carpetaNombre ?? null;
			const nuevoVerificado = Boolean(res.driveVerificado ?? nuevoNombre);
			actualizarCarpeta(nuevoId, nuevoNombre, nuevoVerificado);
			if (!res.carpetaNombre) {
				return {
					mensaje:
						"Carpeta guardada en la configuración. No se pudo verificar en Google Drive; revisa el enlace o los permisos y vuelve a verificar la conexión.",
					verificado: false,
				};
			}
			return {
				mensaje: `Carpeta verificada con Google y guardada exitosamente: "${nuevoNombre}" (${res.plantillas.length} ${
					res.plantillas.length === 1 ? "plantilla" : "plantillas"
				} .xlsx encontradas).`,
				verificado: true,
			};
		},
		mensajeValidacionIncompleta:
			"Ingresa un enlace o ID de carpeta antes de continuar",
		mensajeFalloPrevio:
			"Esta carpeta falló la validación. Modifícala para intentar guardar.",
		mensajeSinCambios: "Modifica el enlace o ID para guardar cambios",
		permitirGuardarConFallo: true,
	});

	const vistaCarpeta = resolverVistaCarpetaDrive({
		carpetaId,
		carpetaNombre,
	});

	const estadoConexionCarpeta: TipoEstadoConexion = (() => {
		if (
			conexion.estadoVisual === "verificando" ||
			credencialesGoogleVerificando
		) {
			return "verificando";
		}
		if (!credencialesGoogleVerificadas) {
			return carpetaId ? "no_disponible" : "no_configurado";
		}
		if (conexion.estadoVisual === "conectado") {
			return "conectado";
		}
		return conexion.estadoVisual;
	})();

	const mensajeErrorCampo = tocado ? errorValidacion : null;
	const mensajeErrorBanner =
		conexion.mensajeError ||
		(tocado && !errorDescartado ? errorValidacion : null);

	const verificar = async () => {
		setTocado(true);
		setErrorDescartado(false);
		if (!credencialesGoogleVerificadas) {
			conexion.setMensajeError(
				credencialesGoogleVerificando
					? "Espera a que finalice la verificación de Google Cloud antes de verificar la carpeta."
					: "Primero verifica las credenciales de Google Cloud. Sin credenciales verificadas no se puede usar Google Drive.",
			);
			return;
		}
		if (errorValidacion) {
			return;
		}
		await conexion.ejecutarVerificar();
	};

	const guardar = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setTocado(true);
		setErrorDescartado(false);
		if (errorValidacion) {
			return;
		}
		await conexion.ejecutarGuardar();
	};

	const limpiarError = () => {
		if (conexion.mensajeError) {
			conexion.setMensajeError(null);
		}
		setErrorDescartado(true);
	};

	const cambiarInput = (valor: string) => {
		setInputUrl(valor);
		setTocado(true);
		setErrorDescartado(false);
		if (conexion.mensajeError) conexion.setMensajeError(null);
		if (conexion.mensajeExito) conexion.setMensajeExito(null);
	};

	return {
		carpetaId,
		inputUrl,
		vistaCarpeta,
		conexion,
		credencialesGoogleVerificadas,
		credencialesGoogleVerificando,
		valorGuardadoVerificado,
		estadoConexionCarpeta,
		mensajeErrorCampo,
		mensajeErrorBanner,
		verificar,
		guardar,
		limpiarError,
		cambiarInput,
		marcarTocado: () => {
			setTocado(true);
			setErrorDescartado(false);
		},
	};
}
