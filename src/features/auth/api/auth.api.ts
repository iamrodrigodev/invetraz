// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
import { entorno } from "@/config/entorno.ts";
import type { LoginPeticion } from "@/features/auth/types/LoginPeticion.ts";
import {
	type LoginRespuesta,
	LoginRespuestaSchema,
	VerificarAutenticacionRespuestaSchema,
} from "@/schemas/api.schemas.ts";
import { ejecutarAccion, ejecutarPeticion, leerDatos } from "@/utils/api.ts";
import { fetchSeguro } from "@/utils/fetch.ts";

export async function login(peticion: LoginPeticion): Promise<LoginRespuesta> {
	return ejecutarPeticion(
		`${entorno.VITE_API_BASE_URL}/auth/login`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(peticion),
		},
		LoginRespuestaSchema,
		"Credenciales inválidas",
	);
}

export interface ResultadoAutenticacion {
	autenticado: boolean;
	email?: string | null;
}

export async function verificarAutenticacion(): Promise<ResultadoAutenticacion> {
	const res = await fetchSeguro(`${entorno.VITE_API_BASE_URL}/auth/me`, {
		method: "GET",
	});
	if (res.status === 401) {
		return { autenticado: false };
	}

	const datos = await leerDatos(
		res,
		VerificarAutenticacionRespuestaSchema,
		"No se pudo verificar la sesión",
	);
	return {
		autenticado: datos.autenticado,
		email: datos.email ?? null,
	};
}

export async function logout(): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/auth/logout`,
		{ method: "POST" },
		"Error al cerrar sesión",
	);
}

export async function verificarPasswordActual(password: string): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/auth/verificar-password`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		},
		"La contraseña actual es incorrecta",
	);
}

export async function cambiarPassword(
	passwordActual: string,
	passwordNueva: string,
): Promise<void> {
	return ejecutarAccion(
		`${entorno.VITE_API_BASE_URL}/auth/cambiar-password`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ passwordActual, passwordNueva }),
		},
		"Hubo un error al actualizar la contraseña",
	);
}
