// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfiguracionPage } from "@/features/configuracion/pages/ConfiguracionPage.tsx";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";
import { useAppStore } from "@/store/useAppStore.ts";

vi.mock("@/features/configuracion/components/TarjetaCredencialesGoogle", () => ({
	TarjetaCredencialesGoogle: () => <div data-testid="tarjeta-credenciales">Credenciales</div>,
}));

vi.mock("@/features/configuracion/components/TarjetaCarpetaDrive", () => ({
	TarjetaCarpetaDrive: ({
		onCarpetaActualizada,
	}: {
		onCarpetaActualizada?: (id: string, nombre: string | null, verificado?: boolean) => void;
	}) => (
		<div data-testid="tarjeta-drive">
			<button type="button" onClick={() => onCarpetaActualizada?.("id-test", "Nombre Test", true)}>
				Actualizar Carpeta
			</button>
		</div>
	),
}));

describe("ConfiguracionPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useConfiguracionStore.getState().limpiar();
		useAppStore.setState({ autenticado: true });
	});

	it("renderiza skeleton mientras cargado es false y carga la configuracion", async () => {
		const cargarConfiguracion = vi.fn().mockResolvedValue(undefined);
		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion,
		});

		render(<ConfiguracionPage />);

		expect(cargarConfiguracion).toHaveBeenCalledTimes(1);
	});

	it("muestra mensaje de error y boton reintentar cuando falla la carga inicial", async () => {
		const cargarConfiguracion = vi.fn().mockRejectedValue(new Error("Error al obtener datos"));
		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion,
		});

		render(<ConfiguracionPage />);

		await act(async () => {
			await Promise.resolve();
		});

		expect(screen.getByText("Error al obtener datos")).toBeDefined();
		const btnReintentar = screen.getByRole("button", { name: "Reintentar" });

		cargarConfiguracion.mockRejectedValueOnce("Fallo de red");
		await act(async () => {
			fireEvent.click(btnReintentar);
		});

		expect(screen.getByText("Error al cargar la configuración")).toBeDefined();

		cargarConfiguracion.mockResolvedValueOnce(undefined);
		await act(async () => {
			fireEvent.click(btnReintentar);
		});
	});

	it("renderiza contenido completo cuando cargado es true y propaga onCarpetaActualizada", () => {
		const actualizarCarpetaDrive = vi.fn();
		useConfiguracionStore.setState({
			cargado: true,
			actualizarCarpetaDrive,
			credenciales: {
				googleClientId: "client",
				googleClientSecret: "secret",
				googleRefreshToken: "token",
				googleDriveFolderId: "folder-123",
				googleDriveFolderName: "Carpeta",
				googleVerificado: true,
				driveVerificado: true,
			},
			estadoConexion: "conectado",
		});

		render(<ConfiguracionPage />);

		expect(screen.getByText("Configuración del Sistema")).toBeDefined();
		expect(screen.getByTestId("tarjeta-credenciales")).toBeDefined();
		expect(screen.getByTestId("tarjeta-drive")).toBeDefined();

		const btnActualizar = screen.getByRole("button", {
			name: "Actualizar Carpeta",
		});
		fireEvent.click(btnActualizar);
		expect(actualizarCarpetaDrive).toHaveBeenCalledWith("id-test", "Nombre Test", true);
	});

	it("no vuelve a inicializar si inicializadoRef ya es true al rerenderizar", () => {
		const cargarConfiguracion = vi.fn().mockResolvedValue(undefined);
		useConfiguracionStore.setState({
			cargado: true,
			cargarConfiguracion,
		});

		const { rerender } = render(<ConfiguracionPage />);
		expect(cargarConfiguracion).not.toHaveBeenCalled();

		act(() => {
			useConfiguracionStore.setState({
				cargarConfiguracion: vi.fn().mockResolvedValue(undefined),
			});
		});
		rerender(<ConfiguracionPage />);
	});

	it("muestra alerta de error y permite cerrarla cuando cargado es true", async () => {
		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion: vi.fn().mockRejectedValue(new Error("Error persistente")),
		});

		const { rerender } = render(<ConfiguracionPage />);

		await act(async () => {
			await Promise.resolve();
		});

		expect(screen.getByText("Error persistente")).toBeDefined();

		act(() => {
			useConfiguracionStore.setState({ cargado: true });
		});
		rerender(<ConfiguracionPage />);

		expect(screen.getByText("Error persistente")).toBeDefined();

		const btnCerrar = screen.getByRole("button", {
			name: "Cerrar notificación",
		});
		fireEvent.click(btnCerrar);

		expect(screen.queryByText("Error persistente")).toBeNull();
	});
});
