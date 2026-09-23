import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";
import { obtenerPlantillas } from "@/features/plantillas/api/plantillas.api.ts";
import DefaultPage, {
	PlantillasSeguimientoPage,
} from "@/features/plantillas/pages/PlantillasSeguimientoPage.tsx";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock("@/features/plantillas/api/plantillas.api", () => ({
	obtenerPlantillas: vi.fn(),
}));

describe("PlantillasSeguimientoPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useConfiguracionStore.setState({
			cargado: true,
			estadoConexion: "conectado",
			cargarConfiguracion: vi.fn().mockResolvedValue(undefined),
		});
	});

	it("muestra skeleton mientras carga inicialmente", () => {
		vi.mocked(obtenerPlantillas).mockReturnValue(new Promise(() => {}));
		render(<PlantillasSeguimientoPage />);

		expect(screen.queryByText("Archivos y formatos de investigación")).toBeNull();
	});

	it("muestra mensaje cuando la carpeta de drive no esta configurada y navega a configuracion", async () => {
		vi.mocked(obtenerPlantillas).mockResolvedValueOnce({
			carpetaConfigurada: false,
			carpetaId: null,
			carpetaNombre: null,
			driveVerificado: false,
			plantillas: [],
		});

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(screen.getByText("Carpeta de Google Drive no configurada")).toBeDefined();
		});

		const btnConfigurar = screen.getByRole("button", {
			name: /configurar carpeta ahora/iu,
		});
		fireEvent.click(btnConfigurar);
		expect(mockNavigate).toHaveBeenCalledWith("/configuracion");
	});

	it("muestra estado vacio de plantillas cuando no hay archivos y credenciales estan verificadas", async () => {
		vi.mocked(obtenerPlantillas).mockResolvedValueOnce({
			carpetaConfigurada: true,
			carpetaId: "folder-1",
			carpetaNombre: "Carpeta Pruebas",
			driveVerificado: true,
			plantillas: [],
		});

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(screen.getByText("Carpeta Pruebas")).toBeDefined();
			expect(screen.getByText("No hay archivos en la carpeta")).toBeDefined();
		});
	});

	it("muestra aviso de Google Cloud pendiente cuando credenciales no estan conectadas", async () => {
		useConfiguracionStore.setState({
			cargado: true,
			estadoConexion: "guardado_pendiente",
		});

		vi.mocked(obtenerPlantillas).mockResolvedValueOnce({
			carpetaConfigurada: true,
			carpetaId: "folder-1",
			carpetaNombre: "Carpeta Pruebas",
			driveVerificado: false,
			plantillas: [],
		});

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(screen.getByText("Google Cloud pendiente de verificación")).toBeDefined();
		});
	});

	it("renderiza lista de plantillas y permite paginar y sincronizar", async () => {
		const plantillasMock = Array.from({ length: 15 }, (_, i) => ({
			id: `plan-${i + 1}`,
			nombre: `Plantilla ${i + 1}.xlsx`,
			tipoMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			enlaceWeb: `https://drive.google.com/open?id=plan-${i + 1}`,
			enlaceDescarga: `https://drive.google.com/uc?id=plan-${i + 1}`,
			tamanoBytes: 1024 * (i + 1),
			ultimaModificacion: "2026-05-15T14:30:00Z",
		}));

		vi.mocked(obtenerPlantillas).mockResolvedValue({
			carpetaConfigurada: true,
			carpetaId: "folder-1",
			carpetaNombre: "Carpeta Plantillas",
			driveVerificado: true,
			plantillas: plantillasMock,
		});

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(screen.getByText("Plantilla 1.xlsx")).toBeDefined();
			expect(screen.getByText("Plantilla 12.xlsx")).toBeDefined();
			expect(screen.queryByText("Plantilla 13.xlsx")).toBeNull();
		});

		const btnSiguiente = screen.getByRole("button", { name: /siguiente/iu });
		fireEvent.click(btnSiguiente);

		expect(screen.getByText("Plantilla 13.xlsx")).toBeDefined();

		const btnSincronizar = screen.getByRole("button", {
			name: /sincronizar/iu,
		});
		await act(async () => {
			fireEvent.click(btnSincronizar);
		});

		expect(obtenerPlantillas).toHaveBeenCalledTimes(2);
	});

	it("muestra mensaje de error cuando falla la peticion y permite cerrarlo", async () => {
		vi.mocked(obtenerPlantillas).mockRejectedValueOnce(new Error("Error de red con Drive"));

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(screen.getByText("Error de red con Drive")).toBeDefined();
		});

		const closeAlert = screen.getByRole("button", {
			name: "Cerrar notificación",
		});
		fireEvent.click(closeAlert);
		expect(screen.queryByText("Error de red con Drive")).toBeNull();
	});

	it("carga configuracion al montar si no estaba cargada y maneja error", async () => {
		const mockCargarConfig = vi.fn().mockRejectedValueOnce(new Error("Fallo al cargar config"));
		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion: mockCargarConfig,
		});
		vi.mocked(obtenerPlantillas).mockResolvedValueOnce({
			carpetaConfigurada: false,
			carpetaId: null,
			carpetaNombre: null,
			driveVerificado: false,
			plantillas: [],
		});

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(mockCargarConfig).toHaveBeenCalled();
			expect(screen.getByText("Fallo al cargar config")).toBeDefined();
		});
	});

	it("resetea la pagina actual a 1 si excede el total de paginas", async () => {
		const plantillas15 = Array.from({ length: 15 }, (_, i) => ({
			id: `plan-${i + 1}`,
			nombre: `Plantilla ${i + 1}.xlsx`,
			tipoMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			enlaceWeb: null,
			enlaceDescarga: null,
			tamanoBytes: 1000,
			ultimaModificacion: null,
		}));

		vi.mocked(obtenerPlantillas).mockResolvedValueOnce({
			carpetaConfigurada: true,
			carpetaId: "folder-1",
			carpetaNombre: "Carpeta",
			driveVerificado: true,
			plantillas: plantillas15,
		});

		render(<PlantillasSeguimientoPage />);

		await waitFor(() => {
			expect(screen.getByText("Plantilla 1.xlsx")).toBeDefined();
		});

		const btnSiguiente = screen.getByRole("button", { name: /siguiente/iu });
		fireEvent.click(btnSiguiente);
		expect(screen.getByText("Plantilla 13.xlsx")).toBeDefined();

		vi.mocked(obtenerPlantillas).mockResolvedValueOnce({
			carpetaConfigurada: true,
			carpetaId: "folder-1",
			carpetaNombre: "Carpeta",
			driveVerificado: true,
			plantillas: plantillas15.slice(0, 5),
		});

		const btnSincronizar = screen.getByRole("button", { name: /sincronizar/iu });
		await act(async () => {
			fireEvent.click(btnSincronizar);
		});

		await waitFor(() => {
			expect(screen.queryByText("Plantilla 13.xlsx")).toBeNull();
			expect(screen.getByText("Plantilla 1.xlsx")).toBeDefined();
		});
	});

	it("soporta default export", () => {
		expect(DefaultPage).toBe(PlantillasSeguimientoPage);
	});
});
