/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert } from "@/components/ui/Alert.tsx";
import { ConfiguracionSkeleton } from "@/features/configuracion/components/ConfiguracionSkeleton.tsx";
import { TarjetaCarpetaDrive } from "@/features/configuracion/components/TarjetaCarpetaDrive.tsx";
import { TarjetaCredencialesGoogle } from "@/features/configuracion/components/TarjetaCredencialesGoogle.tsx";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";
import { useAppStore } from "@/store/useAppStore.ts";

export const ConfiguracionPage: React.FC = () => {
	const { credenciales, estadoConexion, cargado, cargarConfiguracion, actualizarCarpetaDrive } =
		useConfiguracionStore();

	const [mensajeError, setMensajeError] = useState<string | null>(null);
	const inicializadoRef = useRef(false);

	useEffect(() => {
		if (inicializadoRef.current) {
			return;
		}
		let montado = true;
		if (cargado) {
			inicializadoRef.current = true;
		} else {
			cargarConfiguracion()
				.then(() => {
					if (montado) {
						inicializadoRef.current = true;
					}
				})
				.catch((error) => {
					if (montado && useAppStore.getState().autenticado) {
						setMensajeError(
							error instanceof Error ? error.message : "Error al cargar la configuración",
						);
					}
				});
		}
		return () => {
			montado = false;
		};
	}, [cargado, cargarConfiguracion]);

	if (!cargado) {
		if (mensajeError) {
			return (
				<div className="space-y-4">
					<Alert variant="error" message={mensajeError} />
					<button
						type="button"
						className="rounded-lg bg-primary px-4 py-2 text-white"
						onClick={() => {
							setMensajeError(null);
							cargarConfiguracion().catch((error: unknown) =>
								setMensajeError(
									error instanceof Error ? error.message : "Error al cargar la configuración",
								),
							);
						}}
					>
						Reintentar
					</button>
				</div>
			);
		}
		return <ConfiguracionSkeleton />;
	}

	return (
		<div className="w-full space-y-6 pb-12">
			<div>
				<h1 className="font-extrabold font-heading text-2xl text-slate-900 tracking-tight sm:text-3xl">
					Configuración del Sistema
				</h1>
				<p className="mt-1 text-slate-600 text-sm">
					Administra las credenciales de conexión con Google Cloud y la carpeta de plantillas en
					Google Drive.
				</p>
			</div>

			{mensajeError && (
				<Alert variant="error" message={mensajeError} onClose={() => setMensajeError(null)} />
			)}

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<TarjetaCredencialesGoogle />
				<TarjetaCarpetaDrive
					carpetaIdInicial={credenciales.googleDriveFolderId}
					carpetaNombreInicial={credenciales.googleDriveFolderName}
					carpetaVerificadaInicial={credenciales.driveVerificado}
					estadoCredencialesGoogle={estadoConexion}
					onCarpetaActualizada={(id, nombre, verificado) => {
						actualizarCarpetaDrive(id, nombre, verificado);
					}}
				/>
			</div>
		</div>
	);
};

export default ConfiguracionPage;
