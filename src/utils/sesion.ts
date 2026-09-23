// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
export function extraerExpiracionJwt(token: string): number | null {
	try {
		const partes = token.split(".");
		const partePayload = partes[1];
		if (!partePayload) {
			return null;
		}
		let base64 = partePayload.replace(/-/gu, "+").replace(/_/gu, "/");
		const resto = base64.length % 4;
		if (resto) {
			base64 += "=".repeat(4 - resto);
		}
		const jsonTexto = atob(base64);
		const payload = JSON.parse(jsonTexto) as Record<string, unknown>;
		if (typeof payload.exp === "number") {
			return payload.exp * 1000;
		}
		return null;
	} catch {
		return null;
	}
}

export function esSesionValida(): boolean {
	if (typeof window === "undefined") {
		return false;
	}

	if (sessionStorage.getItem("motivo_salida") === "sesion_expirada") {
		return false;
	}

	const sesionActiva = localStorage.getItem("sesion_activa") === "true";
	if (!sesionActiva) {
		return false;
	}

	const expiraEnStr = localStorage.getItem("sesion_expira_en");
	if (expiraEnStr) {
		const expiraEn = Number(expiraEnStr);
		if (!Number.isNaN(expiraEn) && Date.now() >= expiraEn) {
			limpiarSesion("sesion_expirada");
			return false;
		}
	}

	return true;
}

export function guardarSesion(tokenAcceso?: string, email?: string | null): void {
	if (typeof window === "undefined") {
		return;
	}

	localStorage.setItem("sesion_activa", "true");
	sessionStorage.removeItem("motivo_salida");

	if (email) {
		localStorage.setItem("usuario_email", email);
	}

	if (tokenAcceso) {
		const expiraEn = extraerExpiracionJwt(tokenAcceso);
		if (expiraEn) {
			localStorage.setItem("sesion_expira_en", expiraEn.toString());
		}
	}
}

export function limpiarSesion(motivo?: "sesion_expirada"): void {
	if (typeof window === "undefined") {
		return;
	}

	localStorage.removeItem("sesion_activa");
	localStorage.removeItem("sesion_expira_en");
	localStorage.removeItem("usuario_email");
	localStorage.removeItem("moduloActivo");
	localStorage.removeItem("jwt");

	if (motivo) {
		sessionStorage.setItem("motivo_salida", motivo);
	}
}

let temporizadorExpiracion: ReturnType<typeof setTimeout> | null = null;

export function programarExpiracionAutomatica(alExpirar: () => void): () => void {
	if (temporizadorExpiracion) {
		clearTimeout(temporizadorExpiracion);
		temporizadorExpiracion = null;
	}

	if (typeof window === "undefined") {
		return () => {};
	}

	const expiraEnStr = localStorage.getItem("sesion_expira_en");
	if (!expiraEnStr) {
		return () => {};
	}

	const expiraEn = Number(expiraEnStr);
	if (Number.isNaN(expiraEn)) {
		return () => {};
	}

	const ahora = Date.now();
	const tiempoRestante = expiraEn - ahora;

	if (tiempoRestante <= 0) {
		alExpirar();
		return () => {};
	}

	temporizadorExpiracion = setTimeout(() => {
		alExpirar();
	}, tiempoRestante);

	return () => {
		if (temporizadorExpiracion) {
			clearTimeout(temporizadorExpiracion);
			temporizadorExpiracion = null;
		}
	};
}
