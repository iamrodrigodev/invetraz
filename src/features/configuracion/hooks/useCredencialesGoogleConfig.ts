// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useVerificacionConexion } from "@/features/configuracion/hooks/useVerificacionConexion.ts";
import {
	sonCredencialesIguales,
	useConfiguracionStore,
} from "@/features/configuracion/store/useConfiguracionStore.ts";
import {
	type ActualizarCredencialesPeticion,
	ActualizarCredencialesPeticionSchema,
} from "@/features/configuracion/types/ActualizarCredencialesPeticion.ts";

function resolverErrorValidacion(
	errors: ReturnType<typeof useForm<ActualizarCredencialesPeticion>>["formState"]["errors"],
) {
	const errores = [
		errors.googleClientId?.message,
		errors.googleClientSecret?.message,
		errors.googleRefreshToken?.message,
	].filter(Boolean);

	if (errores.length === 0) {
		return null;
	}
	if (errores.length > 1) {
		return "Por favor, completa todos los campos requeridos antes de continuar.";
	}
	return errores[0] as string;
}

export function useCredencialesGoogleConfig() {
	const { credenciales, guardarConfiguracion, verificarConexion } = useConfiguracionStore();
	const [tocado, setTocado] = useState(false);
	const [errorDescartado, setErrorDescartado] = useState(false);
	const sincronizadoRef = useRef(false);

	const form = useForm<ActualizarCredencialesPeticion>({
		resolver: zodResolver(ActualizarCredencialesPeticionSchema),
		mode: "onChange",
		defaultValues: credenciales,
	});

	const {
		reset,
		trigger,
		watch,
		formState: { errors },
	} = form;

	const [clientId, clientSecret, refreshToken] = watch([
		"googleClientId",
		"googleClientSecret",
		"googleRefreshToken",
	]);

	const valoresActuales: ActualizarCredencialesPeticion = useMemo(
		() => ({
			googleClientId: clientId || "",
			googleClientSecret: clientSecret || "",
			googleRefreshToken: refreshToken || "",
			googleDriveFolderId: credenciales.googleDriveFolderId,
			googleDriveFolderName: credenciales.googleDriveFolderName,
			googleVerificado: credenciales.googleVerificado,
			driveVerificado: credenciales.driveVerificado,
		}),
		[
			clientId,
			clientSecret,
			refreshToken,
			credenciales.googleDriveFolderId,
			credenciales.googleDriveFolderName,
			credenciales.googleVerificado,
			credenciales.driveVerificado,
		],
	);

	const tieneValorGuardado = Boolean(
		credenciales.googleClientId &&
			credenciales.googleClientSecret &&
			credenciales.googleRefreshToken,
	);

	useEffect(() => {
		if (tieneValorGuardado && !sincronizadoRef.current) {
			sincronizadoRef.current = true;
			reset(credenciales);
		}
	}, [credenciales, reset, tieneValorGuardado]);

	const camposCompletos = Boolean(
		valoresActuales.googleClientId.trim() &&
			valoresActuales.googleClientSecret.trim() &&
			valoresActuales.googleRefreshToken.trim(),
	);
	const tieneErrores = Boolean(
		errors.googleClientId || errors.googleClientSecret || errors.googleRefreshToken,
	);
	const configuracionCompleta = camposCompletos && !tieneErrores;
	const errorValidacion = useMemo(() => resolverErrorValidacion(errors), [errors]);

	const conexion = useVerificacionConexion<ActualizarCredencialesPeticion>({
		valorActual: valoresActuales,
		valorGuardado: credenciales,
		sonIguales: sonCredencialesIguales,
		esValido: configuracionCompleta,
		tieneValorGuardado,
		valorGuardadoVerificado: Boolean(credenciales.googleVerificado),
		estadoGuardadoSinVerificar: credenciales.googleVerificado ? "conectado" : "guardado_pendiente",
		onVerificar: async (val) => {
			const res = await verificarConexion(val);
			return res?.mensaje || "¡Conexión verificada exitosamente con Google Classroom!";
		},
		onGuardar: async (val) => {
			const res = await guardarConfiguracion(val);
			reset(val);
			return {
				mensaje: res?.mensaje || "Credenciales verificadas con Google y guardadas exitosamente.",
				verificado: res?.valido !== false,
			};
		},
		mensajeValidacionIncompleta: "Completa todos los campos requeridos antes de continuar",
		mensajeFalloPrevio:
			"Estas credenciales fallaron la validación. Modifícalas para intentar guardar.",
		mensajeSinCambios: "Modifica al menos un campo para guardar cambios",
		permitirGuardarConFallo: true,
	});

	const ultimosValoresRef = useRef(valoresActuales);
	useEffect(() => {
		if (!sonCredencialesIguales(ultimosValoresRef.current, valoresActuales)) {
			ultimosValoresRef.current = valoresActuales;
			setTocado(true);
			setErrorDescartado(false);
			conexion.limpiarMensajes();
		}
	}, [valoresActuales, conexion]);

	const probarConexion = async () => {
		setTocado(true);
		setErrorDescartado(false);
		const formValido = await trigger();
		if (!formValido) {
			return;
		}
		await conexion.ejecutarVerificar();
	};

	const guardarFormulario = form.handleSubmit(
		async () => {
			setTocado(true);
			setErrorDescartado(false);
			await conexion.ejecutarGuardar();
		},
		() => {
			setTocado(true);
			setErrorDescartado(false);
		},
	);

	const limpiarError = () => {
		if (conexion.mensajeError) {
			conexion.setMensajeError(null);
		}
		setErrorDescartado(true);
	};

	return {
		form,
		campos: { clientId, clientSecret, refreshToken },
		conexion,
		mensajeErrorBanner:
			conexion.mensajeError || (tocado && !errorDescartado ? errorValidacion : null),
		probarConexion,
		guardarFormulario,
		limpiarError,
	};
}
