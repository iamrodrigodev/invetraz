import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actividadesApi from "@/features/actividades/api/actividades.api.ts";
import { ActividadesSeguimientoPage } from "@/features/actividades/pages/ActividadesSeguimientoPage.tsx";
import { useClasesDocenteStore } from "@/features/actividades/store/useClasesDocenteStore.ts";
import { usePlantillasSeguimientoStore } from "@/features/actividades/store/usePlantillasSeguimientoStore.ts";
import { useConfiguracionStore } from "@/features/configuracion/store/useConfiguracionStore.ts";

vi.mock("@/features/actividades/components/ModalGenerarActividad", () => ({
	ModalGenerarActividad: ({
		abierto,
		alCerrar,
		onActividadGenerada,
	}: {
		abierto: boolean;
		alCerrar: () => void;
		onActividadGenerada?: () => void;
	}) =>
		abierto ? (
			<div data-testid="modal-generar">
				<span>Modal Abierto</span>
				<button type="button" onClick={alCerrar}>
					Cerrar Modal
				</button>
				<button
					type="button"
					onClick={() => {
						alCerrar();
						if (onActividadGenerada) {
							onActividadGenerada();
						}
					}}
				>
					Completar Generacion
				</button>
			</div>
		) : null,
}));

describe("ActividadesSeguimientoPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useConfiguracionStore.getState().limpiar();
		usePlantillasSeguimientoStore.getState().limpiar();
		useClasesDocenteStore.getState().limpiar();
		vi.spyOn(actividadesApi, "obtenerActividadesSeguimiento").mockResolvedValue([]);
		vi.spyOn(actividadesApi, "sincronizarActividadesSeguimiento").mockResolvedValue([]);
	});

	it("muestra skeleton mientras carga la configuracion inicial y luego el estado vacio", async () => {
		const cargarConfiguracion = vi.fn().mockResolvedValue(undefined);
		const cargarPlantillas = vi.fn().mockResolvedValue([]);
		const cargarClases = vi.fn().mockResolvedValue([]);

		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion,
		});
		usePlantillasSeguimientoStore.setState({
			cargarPlantillas,
		});
		useClasesDocenteStore.setState({
			cargarClases,
		});

		render(<ActividadesSeguimientoPage />);

		expect(screen.getByTestId("actividades-seguimiento-skeleton")).toBeDefined();

		await act(async () => {
			await new Promise((r) => setTimeout(r, 250));
		});

		expect(cargarConfiguracion).toHaveBeenCalled();
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

	it("muestra skeleton -> Actividades de seguimiento al generar una nueva actividad y al sincronizar", async () => {
		const cargarPlantillas = vi.fn().mockResolvedValue([]);
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
			cargarPlantillas,
		});

		render(<ActividadesSeguimientoPage />);

		await act(async () => {
			await new Promise((r) => setTimeout(r, 100));
		});

		let resolverActividades!: (valor: actividadesApi.TareaClassroomDto[]) => void;
		vi.spyOn(actividadesApi, "obtenerActividadesSeguimiento").mockReturnValueOnce(
			new Promise((resolve) => {
				resolverActividades = resolve;
			}),
		);

		fireEvent.click(screen.getByRole("button", { name: /^Generar$/iu }));
		fireEvent.click(screen.getByRole("button", { name: "Completar Generacion" }));

		expect(screen.getByTestId("actividades-seguimiento-skeleton")).toBeDefined();

		await act(async () => {
			resolverActividades([
				{
					idTarea: "t-nueva-1",
					idClase: "c-101",
					nombreClase: "Tesis I",
					titulo: "Avance de Matriz de Consistencia",
					nombrePlantilla: "Matriz.xlsx",
					estado: "PUBLISHED",
					enlaceTarea: "https://classroom.google.com/c/1/a/1",
				},
			]);
		});

		expect(screen.getByTestId("lista-actividades-seguimiento")).toBeDefined();
		expect(screen.getByText("Avance de Matriz de Consistencia")).toBeDefined();
		expect(cargarPlantillas).toHaveBeenCalledWith(true);

		vi.spyOn(actividadesApi, "sincronizarActividadesSeguimiento").mockResolvedValueOnce([
			{
				idTarea: "t-nueva-1",
				idClase: "c-101",
				nombreClase: "Tesis I",
				titulo: "Avance Sincronizado",
				nombrePlantilla: "Matriz.xlsx",
				estado: "PUBLISHED",
			},
		]);

		const btnSincronizar = screen.getByRole("button", { name: /sincronizar/iu });
		await act(async () => {
			fireEvent.click(btnSincronizar);
		});

		expect(screen.getByText("Avance Sincronizado")).toBeDefined();
	});

	it("captura errores de inicializacion sin interrumpir", async () => {
		useConfiguracionStore.setState({
			cargado: false,
			cargarConfiguracion: vi.fn().mockRejectedValue(new Error("Fallo config")),
		});
		usePlantillasSeguimientoStore.setState({
			cargarPlantillas: vi.fn().mockRejectedValue(new Error("Fallo plantillas")),
		});
		vi.spyOn(actividadesApi, "obtenerActividadesSeguimiento").mockRejectedValueOnce(
			new Error("Fallo red"),
		);

		render(<ActividadesSeguimientoPage />);

		await act(async () => {
			await new Promise((r) => setTimeout(r, 250));
		});

		expect(screen.getByText("Actividades de seguimiento")).toBeDefined();
	});
});
