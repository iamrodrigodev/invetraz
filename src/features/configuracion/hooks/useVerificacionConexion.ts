import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TipoEstadoConexion } from "../components/EstadoConexionBadge";

export interface ResultadoAccionConexion {
	mensaje?: string;
	verificado?: boolean;
}

type RespuestaAccionConexion = string | ResultadoAccionConexion | undefined;

function normalizarRespuesta(res: RespuestaAccionConexion) {
	if (typeof res === "string") {
		return { mensaje: res, verificado: true };
	}
	return {
		mensaje: res?.mensaje,
		verificado: res?.verificado ?? true,
	};
}

export interface OpcionesVerificacionConexion<T> {
	valorActual: T;
	valorGuardado: T | null;
	sonIguales: (a: T | null | undefined, b: T | null | undefined) => boolean;
	esValido: boolean;
	tieneValorGuardado?: boolean;
	valorGuardadoVerificado?: boolean;
	estadoGuardadoSinVerificar?: TipoEstadoConexion;
	onVerificar: (valor: T) => Promise<RespuestaAccionConexion>;
	onGuardar: (valor: T) => Promise<RespuestaAccionConexion>;
	mensajeValidacionIncompleta?: string;
	mensajeFalloPrevio?: string;
	mensajeSinCambios?: string;
	permitirGuardarConFallo?: boolean;
	permitirGuardarSinCambios?: boolean;
}

export function useVerificacionConexion<T>({
	valorActual,
	valorGuardado,
	sonIguales,
	esValido,
	tieneValorGuardado,
	valorGuardadoVerificado = true,
	estadoGuardadoSinVerificar,
	onVerificar,
	onGuardar,
	mensajeValidacionIncompleta = "Completa todos los campos requeridos antes de continuar",
	mensajeFalloPrevio = "Estos datos fallaron la validación previa. Modifícalos para intentar de nuevo.",
	mensajeSinCambios = "Modifica los campos para guardar cambios",
	permitirGuardarConFallo = false,
	permitirGuardarSinCambios = false,
}: OpcionesVerificacionConexion<T>) {
	const [verificando, setVerificando] = useState(false);
	const [guardando, setGuardando] = useState(false);
	const [mensajeExito, setMensajeExito] = useState<string | null>(null);
	const [mensajeError, setMensajeError] = useState<string | null>(null);
	const [ultimoIntentoGuardado, setUltimoIntentoGuardado] = useState<T | null>(
		valorGuardado,
	);
	const [verificadoEnSesion, setVerificadoEnSesion] = useState<T | null>(
		tieneValorGuardado && valorGuardadoVerificado ? valorGuardado : null,
	);
	const [falloEnSesion, setFalloEnSesion] = useState<T | null>(null);

	const valorGuardadoRef = useRef<T | null>(valorGuardado);
	useEffect(() => {
		if (valorGuardado && !sonIguales(valorGuardadoRef.current, valorGuardado)) {
			valorGuardadoRef.current = valorGuardado;
			setUltimoIntentoGuardado(valorGuardado);
			if (tieneValorGuardado && valorGuardadoVerificado) {
				setVerificadoEnSesion(valorGuardado);
			}
		}
	}, [valorGuardado, tieneValorGuardado, valorGuardadoVerificado, sonIguales]);

	const esIgualAFallidas = useMemo(
		() => Boolean(falloEnSesion && sonIguales(falloEnSesion, valorActual)),
		[falloEnSesion, sonIguales, valorActual],
	);

	const esIgualAUltimoIntento = useMemo(
		() =>
			Boolean(
				ultimoIntentoGuardado && sonIguales(ultimoIntentoGuardado, valorActual),
			),
		[ultimoIntentoGuardado, sonIguales, valorActual],
	);

	const esIgualAGuardadas = useMemo(
		() => Boolean(valorGuardado && sonIguales(valorGuardado, valorActual)),
		[valorGuardado, sonIguales, valorActual],
	);

	const deshabilitarVerificar = verificando || guardando;

	const deshabilitarGuardar =
		guardando ||
		verificando ||
		(!permitirGuardarConFallo && esIgualAFallidas) ||
		(!permitirGuardarSinCambios &&
			((esIgualAGuardadas && !ultimoIntentoGuardado) || esIgualAUltimoIntento));

	const tooltipVerificar = useMemo(() => {
		if (!esValido) {
			return mensajeValidacionIncompleta;
		}
		return undefined;
	}, [esValido, mensajeValidacionIncompleta]);

	const tooltipGuardar = useMemo(() => {
		if (!esValido) {
			return mensajeValidacionIncompleta;
		}
		if (!permitirGuardarConFallo && esIgualAFallidas) {
			return mensajeFalloPrevio;
		}
		if (
			!permitirGuardarSinCambios &&
			(esIgualAUltimoIntento || (esIgualAGuardadas && !ultimoIntentoGuardado))
		) {
			return mensajeSinCambios;
		}
		return undefined;
	}, [
		esValido,
		esIgualAFallidas,
		esIgualAUltimoIntento,
		esIgualAGuardadas,
		ultimoIntentoGuardado,
		mensajeValidacionIncompleta,
		mensajeFalloPrevio,
		mensajeSinCambios,
		permitirGuardarConFallo,
		permitirGuardarSinCambios,
	]);

	const estadoVisual: TipoEstadoConexion = useMemo(() => {
		if (verificando || guardando) {
			return "verificando";
		}
		if (!esValido) {
			return tieneValorGuardado ? "conectado" : "no_configurado";
		}
		if (esIgualAFallidas) {
			return "error";
		}
		if (
			(verificadoEnSesion && sonIguales(verificadoEnSesion, valorActual)) ||
			(esIgualAGuardadas && valorGuardadoVerificado)
		) {
			return "conectado";
		}
		if (esIgualAGuardadas && estadoGuardadoSinVerificar) {
			return estadoGuardadoSinVerificar;
		}
		return "no_configurado";
	}, [
		verificando,
		guardando,
		esValido,
		tieneValorGuardado,
		esIgualAFallidas,
		verificadoEnSesion,
		sonIguales,
		valorActual,
		esIgualAGuardadas,
		valorGuardadoVerificado,
		estadoGuardadoSinVerificar,
	]);

	const ejecutarVerificar = useCallback(async () => {
		if (!esValido) {
			setMensajeError(mensajeValidacionIncompleta);
			return false;
		}

		setVerificando(true);
		setMensajeError(null);
		setMensajeExito(null);

		try {
			const res = normalizarRespuesta(await onVerificar(valorActual));
			setVerificadoEnSesion(valorActual);
			setFalloEnSesion(null);
			if (res.mensaje) {
				setMensajeExito(res.mensaje);
			}
			return true;
		} catch (err) {
			setFalloEnSesion(valorActual);
			setVerificadoEnSesion(null);
			setMensajeError(
				err instanceof Error ? err.message : "Error al verificar la conexión",
			);
			return false;
		} finally {
			setVerificando(false);
		}
	}, [esValido, mensajeValidacionIncompleta, onVerificar, valorActual]);

	const ejecutarGuardar = useCallback(async () => {
		if (!esValido) {
			setMensajeError(mensajeValidacionIncompleta);
			return false;
		}

		setGuardando(true);
		setMensajeError(null);
		setMensajeExito(null);
		setUltimoIntentoGuardado(valorActual);

		try {
			const res = normalizarRespuesta(await onGuardar(valorActual));
			if (res.verificado) {
				setVerificadoEnSesion(valorActual);
			} else {
				setVerificadoEnSesion(null);
			}
			setFalloEnSesion(null);
			setUltimoIntentoGuardado(valorActual);
			if (res.mensaje) {
				setMensajeExito(res.mensaje);
			}
			return true;
		} catch (err) {
			setUltimoIntentoGuardado(valorActual);
			setFalloEnSesion(valorActual);
			setVerificadoEnSesion(null);
			setMensajeError(
				err instanceof Error
					? err.message
					: "Error al verificar o guardar la configuración",
			);
			return false;
		} finally {
			setGuardando(false);
		}
	}, [esValido, mensajeValidacionIncompleta, onGuardar, valorActual]);

	const limpiarMensajes = useCallback(() => {
		setMensajeError(null);
		setMensajeExito(null);
	}, []);

	return {
		verificando,
		guardando,
		mensajeExito,
		mensajeError,
		estadoVisual,
		deshabilitarVerificar,
		deshabilitarGuardar,
		tooltipVerificar,
		tooltipGuardar,
		ejecutarVerificar,
		ejecutarGuardar,
		setVerificadoEnSesion,
		setUltimoIntentoGuardado,
		setFalloEnSesion,
		setMensajeError,
		setMensajeExito,
		limpiarMensajes,
	};
}
