import { create } from "zustand";
import {
	actualizarConfiguracion,
	obtenerConfiguracion,
	verificarConfiguracion,
} from "@/features/configuracion/api/configuracion.api.ts";
import type { TipoEstadoConexion } from "@/features/configuracion/components/EstadoConexionBadge.tsx";
import type {
	ActualizarCredencialesPeticion,
	ResultadoVerificacion,
} from "@/features/configuracion/types/ActualizarCredencialesPeticion.ts";
import { registrarLimpiadorSesion } from "@/utils/eventosSesion.ts";

export function sonCredencialesIguales(
	a: ActualizarCredencialesPeticion | null | undefined,
	b: ActualizarCredencialesPeticion | null | undefined,
): boolean {
	if (!(a && b)) {
		return false;
	}
	return (
		(a.googleClientId ?? "").trim() === (b.googleClientId ?? "").trim() &&
		(a.googleClientSecret ?? "").trim() === (b.googleClientSecret ?? "").trim() &&
		(a.googleRefreshToken ?? "").trim() === (b.googleRefreshToken ?? "").trim()
	);
}

export function esConfiguracionListaParaActividades(
	credenciales: ActualizarCredencialesPeticion | null | undefined,
	estadoConexion: TipoEstadoConexion,
): boolean {
	if (!credenciales) {
		return false;
	}
	const googleValido = estadoConexion === "conectado" && Boolean(credenciales.googleVerificado);
	const driveValido = Boolean(credenciales.googleDriveFolderId && credenciales.driveVerificado);
	return googleValido && driveValido;
}

type ConfiguracionState = {
	credenciales: ActualizarCredencialesPeticion;
	estadoConexion: TipoEstadoConexion;
	cargado: boolean;
	cargando: boolean;
	cargarConfiguracion: (forzar?: boolean) => Promise<ActualizarCredencialesPeticion>;
	guardarConfiguracion: (datos: ActualizarCredencialesPeticion) => Promise<ResultadoVerificacion>;
	verificarConexion: (datos?: ActualizarCredencialesPeticion) => Promise<ResultadoVerificacion>;
	actualizarCarpetaDrive: (id: string, nombre: string | null, verificado?: boolean) => void;
	limpiar: () => void;
};

const VALORES_POR_DEFECTO: ActualizarCredencialesPeticion = {
	googleClientId: "",
	googleClientSecret: "",
	googleRefreshToken: "",
	googleDriveFolderId: null,
	googleDriveFolderName: null,
	googleVerificado: false,
	driveVerificado: false,
};

export const useConfiguracionStore = create<ConfiguracionState>((set, get) => ({
	credenciales: VALORES_POR_DEFECTO,
	estadoConexion: "no_configurado",
	cargado: false,
	cargando: false,

	cargarConfiguracion: async (forzar = false) => {
		const { cargado, cargando, credenciales } = get();
		if (cargado && !forzar) {
			return credenciales;
		}
		if (cargando) {
			return credenciales;
		}

		set({ cargando: true });
		try {
			const config = await obtenerConfiguracion();
			const nuevasCredenciales: ActualizarCredencialesPeticion = {
				googleClientId: config.googleClientId || "",
				googleClientSecret: config.googleClientSecret || "",
				googleRefreshToken: config.googleRefreshToken || "",
				googleDriveFolderId: config.googleDriveFolderId ?? null,
				googleDriveFolderName: config.googleDriveFolderName ?? null,
				googleVerificado: config.googleVerificado ?? false,
				driveVerificado: config.driveVerificado ?? false,
			};

			const tieneCredenciales = Boolean(
				nuevasCredenciales.googleClientId &&
					nuevasCredenciales.googleClientSecret &&
					nuevasCredenciales.googleRefreshToken,
			);

			const estadoDeterminado: TipoEstadoConexion = tieneCredenciales
				? config.googleVerificado
					? "conectado"
					: "guardado_pendiente"
				: "no_configurado";

			set({
				credenciales: nuevasCredenciales,
				estadoConexion: estadoDeterminado,
				cargado: true,
				cargando: false,
			});

			return nuevasCredenciales;
		} catch (error) {
			set({ cargando: false });
			throw error;
		}
	},

	guardarConfiguracion: async (datos: ActualizarCredencialesPeticion) => {
		set({ cargando: true, estadoConexion: "verificando" });
		try {
			let resVerificacion: ResultadoVerificacion;
			try {
				resVerificacion = await verificarConfiguracion(datos);
			} catch (error) {
				resVerificacion = {
					valido: false,
					mensaje: error instanceof Error ? error.message : "No se pudo verificar la conexión",
				};
			}
			const datosConEstado = {
				...datos,
				googleVerificado: resVerificacion.valido,
			};
			await actualizarConfiguracion(datosConEstado);

			set({
				credenciales: datosConEstado,
				estadoConexion: resVerificacion.valido ? "conectado" : "guardado_pendiente",
				cargado: true,
			});

			return resVerificacion.valido
				? resVerificacion
				: {
						valido: false,
						mensaje: `Credenciales guardadas, pero no verificadas: ${resVerificacion.mensaje}`,
					};
		} catch (error) {
			set({ estadoConexion: "error" });
			throw error;
		} finally {
			set({ cargando: false });
		}
	},

	verificarConexion: async (datos?: ActualizarCredencialesPeticion) => {
		const creds = datos || get().credenciales;
		set({ estadoConexion: "verificando" });
		try {
			const res = await verificarConfiguracion(creds);
			if (!res.valido) {
				throw new Error(res.mensaje);
			}
			set({
				credenciales: {
					...get().credenciales,
					googleVerificado: true,
				},
				estadoConexion: "conectado",
			});
			return res;
		} catch (error) {
			set({
				estadoConexion: "error",
			});
			throw error;
		}
	},

	actualizarCarpetaDrive: (id: string, nombre: string | null, verificado?: boolean) => {
		set((state) => ({
			credenciales: {
				...state.credenciales,
				googleDriveFolderId: id,
				googleDriveFolderName: nombre,
				driveVerificado:
					verificado === undefined
						? Boolean(nombre || state.credenciales.driveVerificado)
						: verificado,
			},
		}));
	},

	limpiar: () => {
		set({
			credenciales: VALORES_POR_DEFECTO,
			estadoConexion: "no_configurado",
			cargado: false,
			cargando: false,
		});
	},
}));

registrarLimpiadorSesion(() => {
	useConfiguracionStore.getState().limpiar();
});
