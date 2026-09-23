// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { create } from "zustand";
import { logout, verificarAutenticacion } from "@/features/auth/api/auth.api.ts";
import { verificarEstadoSistema } from "@/features/setup/api/setup.api.ts";
import { ejecutarLimpiezaSesion } from "@/utils/eventosSesion.ts";
import { alExpirarSesion } from "@/utils/fetch.ts";
import {
	esSesionValida,
	guardarSesion,
	limpiarSesion,
	programarExpiracionAutomatica,
} from "@/utils/sesion.ts";

interface AppState {
	configurado: boolean | null;
	autenticado: boolean | null;
	usuarioEmail: string | null;
	estadoVerificado: boolean;
	errorVerificacion: string | null;
	verificarEstadoGlobal: () => Promise<void>;
	setConfigurado: (valor: boolean) => void;
	setAutenticado: (valor: boolean, email?: string | null, tokenAcceso?: string) => void;
	cerrarSesion: () => Promise<void>;
}

const configuradoCacheado =
	typeof window !== "undefined" && localStorage.getItem("sistema_configurado") === "true";
const sesionPreviaActiva = esSesionValida();
const usuarioEmailCacheado =
	typeof window !== "undefined" && sesionPreviaActiva
		? localStorage.getItem("usuario_email")
		: null;
let verificacionEnCurso: Promise<void> | null = null;
let revisionSesion = 0;

function manejarExpiracionProactiva() {
	revisionSesion += 1;
	limpiarSesion("sesion_expirada");
	useAppStore.setState({ autenticado: false, usuarioEmail: null });
	ejecutarLimpiezaSesion();
	if (typeof window !== "undefined" && window.location.pathname !== "/login") {
		window.location.replace("/login");
	}
}

if (sesionPreviaActiva) {
	programarExpiracionAutomatica(manejarExpiracionProactiva);
}

export const useAppStore = create<AppState>((set) => ({
	configurado: sesionPreviaActiva || configuradoCacheado ? true : null,
	autenticado: sesionPreviaActiva,
	usuarioEmail: usuarioEmailCacheado,
	estadoVerificado: Boolean(sesionPreviaActiva || configuradoCacheado),
	errorVerificacion: null,
	verificarEstadoGlobal: () => {
		if (verificacionEnCurso) {
			return verificacionEnCurso;
		}
		const revisionInicial = revisionSesion;
		verificacionEnCurso = (async () => {
			try {
				const habiaSesion = esSesionValida();
				const resAuth = habiaSesion
					? await verificarAutenticacion()
					: { autenticado: false, email: null };
				const esConfigurado = resAuth.autenticado ? true : await verificarEstadoSistema();
				if (revisionInicial !== revisionSesion) {
					return;
				}
				if (resAuth.autenticado) {
					guardarSesion(undefined, resAuth.email);
					localStorage.setItem("sistema_configurado", "true");
				} else {
					limpiarSesion(habiaSesion ? "sesion_expirada" : undefined);
				}
				set({
					configurado: esConfigurado,
					autenticado: resAuth.autenticado,
					usuarioEmail: resAuth.autenticado ? (resAuth.email ?? null) : null,
					estadoVerificado: true,
					errorVerificacion: null,
				});
			} catch (error) {
				if (revisionInicial !== revisionSesion) {
					return;
				}
				set({
					configurado: null,
					estadoVerificado: true,
					errorVerificacion:
						error instanceof Error ? error.message : "No se pudo verificar el estado del sistema",
				});
			} finally {
				verificacionEnCurso = null;
			}
		})();
		return verificacionEnCurso;
	},
	setConfigurado: (valor: boolean) => {
		revisionSesion += 1;
		if (valor && typeof window !== "undefined") {
			localStorage.setItem("sistema_configurado", "true");
		}
		set({ configurado: valor });
	},
	setAutenticado: (valor: boolean, email?: string | null, tokenAcceso?: string) => {
		revisionSesion += 1;
		if (valor) {
			guardarSesion(tokenAcceso, email);
			programarExpiracionAutomatica(manejarExpiracionProactiva);
		} else {
			limpiarSesion();
		}
		set((state) => ({
			autenticado: valor,
			usuarioEmail: email === undefined ? state.usuarioEmail : email,
		}));
	},
	cerrarSesion: async () => {
		revisionSesion += 1;
		try {
			await logout();
		} catch {}
		limpiarSesion();
		ejecutarLimpiezaSesion();
		set({ autenticado: false, usuarioEmail: null });
	},
}));

alExpirarSesion(() => {
	manejarExpiracionProactiva();
});
