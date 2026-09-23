import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalGenerarActividad } from "@/features/actividades/components/ModalGenerarActividad";

vi.mock("@/features/actividades/store/usePlantillasSeguimientoStore", () => ({
	usePlantillasSeguimientoStore: () => ({
		plantillas: [
			{
				id: "plan-1",
				nombre: "Plantilla 1.xlsx",
				enlaceWeb: "https://docs.google.com/test",
				frecuenciaUso: 0,
				estructuraValida: true,
			},
		],
		cargando: false,
		cargado: true,
		cargarPlantillas: vi.fn().mockResolvedValue([]),
	}),
}));

vi.mock("@/features/configuracion/store/useConfiguracionStore", () => ({
	useConfiguracionStore: () => ({
		credenciales: {
			googleCloudClientId: "client-id",
			googleCloudClientSecret: "client-secret",
			googleDriveFolderId: "folder-123",
			googleDriveFolderName: "Carpeta de Prueba",
		},
		estadoConexion: "conectado",
		cargado: true,
		cargando: false,
		cargarConfiguracion: vi.fn(),
	}),
	esConfiguracionListaParaActividades: () => true,
}));

describe("ModalGenerarActividad", () => {
	it("no renderiza cuando abierto es false", () => {
		const { container } = render(
			<ModalGenerarActividad abierto={false} alCerrar={vi.fn()} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza correctamente cuando abierto es true", () => {
		render(<ModalGenerarActividad abierto={true} alCerrar={vi.fn()} />);

		expect(
			screen.getByText("Generar actividades de seguimiento"),
		).toBeDefined();
		expect(
			screen.getByText(
				"Complete la información necesaria para generar una actividad de seguimiento.",
			),
		).toBeDefined();
		expect(screen.getByText("Abrir en Drive")).toBeDefined();
		expect(screen.getByText("Clase")).toBeDefined();
		expect(screen.getByText("Título")).toBeDefined();
		expect(screen.getByText("Fecha de vencimiento")).toBeDefined();
		expect(screen.getByText("Plantilla de seguimiento")).toBeDefined();
		expect(screen.getByText("Hora de vencimiento")).toBeDefined();
		expect(screen.getByText("Tema")).toBeDefined();
		expect(screen.getByText("Descripción")).toBeDefined();
		expect(screen.getByRole("button", { name: /generar/i })).toBeDefined();
		expect(screen.getByRole("button", { name: /cancelar/i })).toBeDefined();
	});
});
