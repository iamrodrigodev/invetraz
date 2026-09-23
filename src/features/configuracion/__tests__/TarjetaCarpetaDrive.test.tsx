// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TarjetaCarpetaDrive } from "@/features/configuracion/components/TarjetaCarpetaDrive.tsx";
import * as useDriveHook from "@/features/configuracion/hooks/useCarpetaDriveConfig.ts";

describe("TarjetaCarpetaDrive", () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it("no muestra alerta de advertencia cuando Google Cloud está en estado 'verificando'", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Mis Plantillas"
				carpetaVerificadaInicial={true}
				estadoCredencialesGoogle="verificando"
			/>,
		);

		expect(screen.queryByText(/tampoco lo estarán en las plantillas/iu)).toBeNull();
		expect(screen.queryByText("Conexión activa con Google")).toBeNull();
		expect(screen.getByText("Verificando conexión...")).toBeDefined();

		const botonVerificar = screen.getByRole("button", {
			name: /Verificar Conexión/iu,
		});
		expect(botonVerificar.getAttribute("title")).toBe(
			"Espera a que finalice la verificación de Google Cloud",
		);
	});

	it("muestra alerta de advertencia y estado 'No se puede usar' cuando Google Cloud está en 'guardado_pendiente'", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Mis Plantillas"
				carpetaVerificadaInicial={false}
				estadoCredencialesGoogle="guardado_pendiente"
			/>,
		);

		expect(screen.getByText(/tampoco lo estarán en las plantillas/iu)).toBeDefined();

		expect(screen.getByText("Mis Plantillas")).toBeDefined();
		const badgesNoDisponible = screen.getAllByText("No se puede usar");
		expect(badgesNoDisponible.length).toBeGreaterThan(0);
	});

	it("muestra carpeta vinculada correctamente cuando las credenciales están conectadas", () => {
		render(
			<TarjetaCarpetaDrive
				carpetaIdInicial="folder-123"
				carpetaNombreInicial="Plantillas Verificadas"
				carpetaVerificadaInicial={true}
				estadoCredencialesGoogle="conectado"
			/>,
		);

		expect(screen.getByText("Plantillas Verificadas")).toBeDefined();
		expect(screen.getByText("Carpeta vinculada")).toBeDefined();
		expect(screen.queryByText(/tampoco lo estarán en las plantillas/iu)).toBeNull();
	});

	it("soporta interacciones de input, limpieza de exito y error, y envio de formulario", async () => {
		const cambiarInput = vi.fn();
		const marcarTocado = vi.fn();
		const verificar = vi.fn();
		const guardar = vi.fn((e) => e?.preventDefault?.());
		const limpiarError = vi.fn();
		const setMensajeExito = vi.fn();

		vi.spyOn(useDriveHook, "useCarpetaDriveConfig").mockReturnValue({
			carpetaId: "folder-456",
			inputUrl: "https://drive.google.com/drive/folders/folder-456",
			vistaCarpeta: {
				nombreVisible: "Carpeta Nueva",
				estaPendiente: true,
			} as any,
			conexion: {
				estadoVisual: "guardado_pendiente",
				mensajeExito: "Carpeta enlazada correctamente",
				setMensajeExito,
				verificando: false,
				guardando: false,
				deshabilitarVerificar: false,
				deshabilitarGuardar: false,
				tooltipVerificar: "Probar carpeta",
				tooltipGuardar: "Guardar carpeta",
			} as any,
			credencialesGoogleVerificadas: true,
			credencialesGoogleVerificando: false,
			valorGuardadoVerificado: false,
			estadoConexionCarpeta: "guardado_pendiente",
			mensajeErrorCampo: "ID no válido",
			mensajeErrorBanner: "Error al sincronizar con Drive",
			verificar,
			guardar,
			limpiarError,
			cambiarInput,
			marcarTocado,
		});

		render(<TarjetaCarpetaDrive carpetaIdInicial="folder-456" />);

		expect(screen.getByText("Carpeta enlazada correctamente")).toBeDefined();
		expect(screen.getByText("Error al sincronizar con Drive")).toBeDefined();
		expect(screen.getByText("ID no válido")).toBeDefined();

		const closeButtons = screen.getAllByRole("button", {
			name: "Cerrar notificación",
		});
		const btnCerrarExito = closeButtons[0];
		if (btnCerrarExito) {
			fireEvent.click(btnCerrarExito);
		}
		expect(setMensajeExito).toHaveBeenCalledWith(null);

		const btnCerrarError = closeButtons[1];
		if (btnCerrarError) {
			fireEvent.click(btnCerrarError);
		}
		expect(limpiarError).toHaveBeenCalledTimes(1);

		const input = screen.getByRole("textbox");
		fireEvent.change(input, { target: { value: "1abc999" } });
		expect(cambiarInput).toHaveBeenCalledWith("1abc999");

		fireEvent.blur(input);
		expect(marcarTocado).toHaveBeenCalled();

		const btnVerificar = screen.getByRole("button", {
			name: "Verificar Conexión",
		});
		fireEvent.click(btnVerificar);
		expect(verificar).toHaveBeenCalled();

		const form = document.querySelector("form");
		if (form) {
			await act(async () => {
				fireEvent.submit(form);
			});
		}
		expect(guardar).toHaveBeenCalled();
	});

	it("renderiza correctamente cuando no hay carpeta vinculada inicialmente", () => {
		render(
			<TarjetaCarpetaDrive carpetaIdInicial={null} estadoCredencialesGoogle="no_configurado" />,
		);

		expect(screen.getByLabelText(/Enlace o ID de la carpeta de Google Drive/u)).toBeDefined();
		expect(screen.queryByText("Carpeta vinculada")).toBeNull();

		const enlaceDrive = screen.getByRole("link", { name: /Google Drive/iu });
		expect(enlaceDrive.getAttribute("href")).toBe("https://drive.google.com");
	});
});
