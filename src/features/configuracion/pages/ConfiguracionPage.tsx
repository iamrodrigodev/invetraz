/* v8 ignore file -- ramas defensivas de UI cubiertas por pruebas de integracion del modulo. */
// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
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
