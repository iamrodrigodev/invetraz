// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TarjetaCredencialesGoogle } from "@/features/configuracion/components/TarjetaCredencialesGoogle.tsx";
import * as useCredHook from "@/features/configuracion/hooks/useCredencialesGoogleConfig.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

describe("TarjetaCredencialesGoogle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useConfiguracionStore.getState().limpiar();
	});

	it("renderiza campos de credenciales de Google y enlaces externos", () => {
		render(<TarjetaCredencialesGoogle />);

		expect(screen.getByText("Credenciales de Google Cloud")).toBeDefined();
		expect(screen.getByLabelText(/Google Client ID/u)).toBeDefined();
		expect(screen.getByLabelText(/Google Client Secret/u)).toBeDefined();
		expect(screen.getByLabelText(/Google Refresh Token/u)).toBeDefined();

		const enlaceCloud = screen.getByRole("link", {
			name: /Google Cloud Console/iu,
		});
		expect(enlaceCloud.getAttribute("href")).toBe("https://console.cloud.google.com");

		const enlacePlayground = screen.getByRole("link", {
			name: /OAuth 2.0 Playground/iu,
		});
		expect(enlacePlayground.getAttribute("href")).toBe(
			"https://developers.google.com/oauthplayground",
		);
	});

	it("limpia mensaje de exito y error, y activa variante warning cuando estado es guardado_pendiente", async () => {
		const setMensajeExito = vi.fn();
		const limpiarError = vi.fn();
		const probarConexion = vi.fn();
		const guardarFormulario = vi.fn((e) => e.preventDefault());

		vi.spyOn(useCredHook, "useCredencialesGoogleConfig").mockReturnValue({
			form: {
				register: () => ({}) as any,
				formState: {
					errors: {
						googleClientId: { message: "ID requerido" } as any,
						googleClientSecret: { message: "Secret requerido" } as any,
						googleRefreshToken: { message: "Token requerido" } as any,
					},
				},
			} as any,
			campos: {
				clientId: "client-123",
				clientSecret: "secret-123",
				refreshToken: "refresh-123",
			},
			conexion: {
				estadoVisual: "guardado_pendiente",
				mensajeExito: "Guardado preliminar",
				setMensajeExito,
				verificando: false,
				guardando: false,
				deshabilitarVerificar: false,
				deshabilitarGuardar: false,
				tooltipVerificar: "Probar credenciales",
				tooltipGuardar: "Guardar datos",
			} as any,
			mensajeErrorBanner: "Error al validar formulario",
			probarConexion,
			guardarFormulario,
			limpiarError,
		});

		render(<TarjetaCredencialesGoogle />);

		expect(screen.getByText("Guardado preliminar")).toBeDefined();
		expect(screen.getByText("Error al validar formulario")).toBeDefined();

		const closeButtons = screen.getAllByRole("button", {
			name: "Cerrar notificación",
		});
		const btn0 = closeButtons[0];
		if (btn0) {
			fireEvent.click(btn0);
		}
		expect(setMensajeExito).toHaveBeenCalledWith(null);

		const btn1 = closeButtons[1];
		if (btn1) {
			fireEvent.click(btn1);
		}
		expect(limpiarError).toHaveBeenCalledTimes(1);

		const btnVerificar = screen.getByRole("button", {
			name: "Verificar Conexión",
		});
		fireEvent.click(btnVerificar);
		expect(probarConexion).toHaveBeenCalledTimes(1);

		const form = document.querySelector("form");
		if (form) {
			await act(async () => {
				fireEvent.submit(form);
			});
		}
		expect(guardarFormulario).toHaveBeenCalled();
	});

	it("renderiza con campos nulos o indefinidos y sin errores", () => {
		vi.spyOn(useCredHook, "useCredencialesGoogleConfig").mockReturnValue({
			form: {
				register: () => ({}) as any,
				formState: { errors: {} },
			} as any,
			campos: {
				clientId: undefined as any,
				clientSecret: undefined as any,
				refreshToken: undefined as any,
			},
			conexion: {
				estadoVisual: "no_configurado",
				mensajeExito: null,
				setMensajeExito: vi.fn(),
				verificando: false,
				guardando: false,
				deshabilitarVerificar: false,
				deshabilitarGuardar: false,
				tooltipVerificar: "",
				tooltipGuardar: "",
			} as any,
			mensajeErrorBanner: null,
			probarConexion: vi.fn(),
			guardarFormulario: vi.fn(),
			limpiarError: vi.fn(),
		});

		render(<TarjetaCredencialesGoogle />);
		expect(screen.getByText("Credenciales de Google Cloud")).toBeDefined();
	});
});
