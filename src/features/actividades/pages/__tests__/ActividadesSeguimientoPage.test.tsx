import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActividadesSeguimientoPage } from "@/features/actividades/pages/ActividadesSeguimientoPage.tsx";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

vi.mock("@/features/actividades/components/ModalGenerarActividad", () => ({
	ModalGenerarActividad: ({ abierto, alCerrar }: { abierto: boolean; alCerrar: () => void }) =>
		abierto ? (
			<div data-testid="modal-generar">
				<span>Modal Abierto</span>
				<button type="button" onClick={alCerrar}>
					Cerrar Modal
				</button>
			</div>
		) : null,
}));

describe("ActividadesSeguimientoPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useConfiguracionStore.getState().limpiar();
		usePlantillasSeguimientoStore.getState().limpiar();
	});

	it("muestra skeleton mientras carga la configuracion inicial y luego el estado vacio", async () => {
		const cargarConfiguracion = vi.fn().mockResolvedValue(undefined);
		const cargarPlantillas = vi.fn().mockResolvedValue([]);

		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion,
		});
		usePlantillasSeguimientoStore.setState({
			cargarPlantillas,
		});

		render(<ActividadesSeguimientoPage />);

		await act(async () => {
			await new Promise((r) => setTimeout(r, 250));
		});

		expect(cargarConfiguracion).toHaveBeenCalled();
		expect(cargarPlantillas).toHaveBeenCalled();
		expect(screen.getByText("Actividades de seguimiento")).toBeDefined();
		expect(screen.getByText("No hay actividades de seguimiento registradas")).toBeDefined();
	});

	it("deshabilita botones de generar y muestra advertencia si la configuracion no es valida", async () => {
		useConfiguracionStore.setState({
			cargado: true,
			estadoConexion: "no_configurado",
		});
		usePlantillasSeguimientoStore.setState({
			cargado: true,
			cargarPlantillas: vi.fn().mockResolvedValue([]),
		});

		render(<ActividadesSeguimientoPage />);

		await act(async () => {
			await new Promise((r) => setTimeout(r, 250));
		});

		const advertencias = screen.getAllByText(
			"La configuración no está lista para generar actividades",
		);
		expect(advertencias.length).toBeGreaterThan(0);

		const btnsGenerar = screen.getAllByRole("button", { name: /generar/iu });
		for (const btn of btnsGenerar) {
			expect(btn.getAttribute("disabled")).not.toBeNull();
			fireEvent.click(btn);
		}
		expect(screen.queryByTestId("modal-generar")).toBeNull();
	});

	it("permite abrir y cerrar el modal de generar cuando la configuracion es valida", async () => {
		useConfiguracionStore.setState({
			cargado: true,
			estadoConexion: "conectado",
			credenciales: {
				googleClientId: "id",
				googleClientSecret: "sec",
				googleRefreshToken: "tok",
				googleVerificado: true,
				googleDriveFolderId: "folder",
				driveVerificado: true,
			},
		});
		usePlantillasSeguimientoStore.setState({
			cargado: true,
			cargarPlantillas: vi.fn().mockResolvedValue([]),
		});

		render(<ActividadesSeguimientoPage />);

		await act(async () => {
			await new Promise((r) => setTimeout(r, 250));
		});

		const btnGenerar = screen.getByRole("button", {
			name: "Generar actividad",
		});
		expect(btnGenerar.getAttribute("disabled")).toBeNull();
		fireEvent.click(btnGenerar);

		expect(screen.getByTestId("modal-generar")).toBeDefined();

		const btnCerrar = screen.getByRole("button", { name: "Cerrar Modal" });
		fireEvent.click(btnCerrar);
		expect(screen.queryByTestId("modal-generar")).toBeNull();

		const btnGenerarTop = screen.getByRole("button", {
			name: /^Generar$/iu,
		});
		expect(btnGenerarTop.getAttribute("disabled")).toBeNull();
		fireEvent.click(btnGenerarTop);
		expect(screen.getByTestId("modal-generar")).toBeDefined();

		const btnCerrarTop = screen.getByRole("button", { name: "Cerrar Modal" });
		fireEvent.click(btnCerrarTop);
		expect(screen.queryByTestId("modal-generar")).toBeNull();
	});

	it("captura errores de inicializacion sin interrumpir", async () => {
		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion: vi.fn().mockRejectedValue(new Error("Fallo config")),
		});
		usePlantillasSeguimientoStore.setState({
			cargarPlantillas: vi.fn().mockRejectedValue(new Error("Fallo plantillas")),
		});

		render(<ActividadesSeguimientoPage />);

		await act(async () => {
			await new Promise((r) => setTimeout(r, 250));
		});

		expect(screen.getByText("Actividades de seguimiento")).toBeDefined();
	});
});
