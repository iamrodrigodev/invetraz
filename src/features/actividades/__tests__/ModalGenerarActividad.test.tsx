import { act, fireEvent, render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { ModalGenerarActividad } from "@/features/actividades/components/ModalGenerarActividad.tsx";
import * as hookActividad from "@/features/actividades/hooks/useGenerarActividad.ts";

vi.mock("@/features/actividades/components/FormGenerarActividad", () => ({
	FormGenerarActividad: ({
		alEnviar,
		alCancelar,
		onCambioClase,
	}: {
		alEnviar: (datos: any) => void;
		alCancelar: () => void;
		onCambioClase?: (idClase: string) => void;
	}) => (
		<div data-testid="form-generar">
			<button
				type="button"
				onClick={() =>
					alEnviar({
						idClase: "clase-1",
						titulo: "Actividad Test",
						fechaVencimiento: "2026-12-01",
						idPlantilla: "plan-1",
						horaVencimiento: "10:00",
						idTema: "tema-1",
						descripcion: "Mi descripcion",
					})
				}
			>
				Enviar Formulario
			</button>
			<button
				type="button"
				onClick={() =>
					alEnviar({
						idClase: "clase-2",
						titulo: "Sin Opcionales",
						fechaVencimiento: "2026-12-01",
						idPlantilla: "",
						horaVencimiento: "",
						idTema: "",
						descripcion: "",
					})
				}
			>
				Enviar Formulario Minimo
			</button>
			<button type="button" onClick={() => onCambioClase?.("clase-1")}>
				Cambiar Clase
			</button>
			<button type="button" onClick={alCancelar}>
				Cancelar Formulario
			</button>
		</div>
	),
}));

vi.mock("framer-motion", () => ({
	AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
	motion: {
		div: ({
			children,
			ref,
			...props
		}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.RefObject<HTMLDivElement | null> }) => (
			<div ref={ref} {...props}>
				{children}
			</div>
		),
	},
}));

describe("ModalGenerarActividad", () => {
	it("no renderiza cuando abierto es false", () => {
		const { container } = render(<ModalGenerarActividad abierto={false} alCerrar={vi.fn()} />);
		expect(container.firstChild).toBeNull();
	});

	it("renderiza correctamente cuando abierto es true y permite cancelar", () => {
		const alCerrar = vi.fn();
		render(<ModalGenerarActividad abierto={true} alCerrar={alCerrar} />);

		expect(screen.getByText("Generar actividades de seguimiento")).toBeDefined();

		const btnCancelar = screen.getByRole("button", {
			name: "Cancelar Formulario",
		});
		fireEvent.click(btnCancelar);
		expect(alCerrar).toHaveBeenCalled();
	});

	it("flujo completo de confirmacion, generacion exitosa y cierre de exito", async () => {
		const alCerrar = vi.fn();
		const onActividadGenerada = vi.fn();
		const ejecutarGeneracion = vi.fn().mockResolvedValue(true);
		const cargarTemasDeClase = vi.fn();

		vi.spyOn(hookActividad, "useGenerarActividad").mockReturnValue({
			clases: [{ idClassroom: "clase-1", nombre: "Clase Uno" }],
			plantillas: [
				{
					id: "plan-1",
					nombre: "Plantilla Uno",
					enlaceWeb: "https://drive.google.com/sheet",
					frecuenciaUso: 1,
					estructuraValida: true,
				},
			],
			temas: [{ idTema: "tema-1", nombre: "Tema Uno" }],
			carpetaDrive: { id: "folder-1", nombre: "Carpeta" },
			configuracionValida: true,
			cargandoClases: false,
			cargandoPlantillas: false,
			cargandoTemas: false,
			generando: false,
			cargarTemasDeClase,
			cargarPlantillas: vi.fn(),
			cargarClases: vi.fn(),
			ejecutarGeneracion,
		});

		render(
			<ModalGenerarActividad
				abierto={true}
				alCerrar={alCerrar}
				onActividadGenerada={onActividadGenerada}
			/>,
		);

		const btnCambiarClase = screen.getByRole("button", {
			name: "Cambiar Clase",
		});
		fireEvent.click(btnCambiarClase);
		expect(cargarTemasDeClase).toHaveBeenCalledWith("clase-1");

		const btnEnviar = screen.getByRole("button", {
			name: "Enviar Formulario",
		});
		fireEvent.click(btnEnviar);

		expect(screen.getByText("Confirmar actividad de seguimiento")).toBeDefined();

		const btnCancelarConfirmar = screen.getByRole("button", {
			name: "Cancelar",
		});
		fireEvent.click(btnCancelarConfirmar);

		fireEvent.click(btnEnviar);

		const btnConfirmar = screen.getByRole("button", { name: "Confirmar" });
		await act(async () => {
			fireEvent.click(btnConfirmar);
		});

		expect(ejecutarGeneracion).toHaveBeenCalled();

		expect(screen.getByText("Actividad de seguimiento generada")).toBeDefined();

		const btnAceptarExito = screen.getByRole("button", {
			name: "Aceptar",
		});
		fireEvent.click(btnAceptarExito);

		expect(onActividadGenerada).toHaveBeenCalled();
		expect(alCerrar).toHaveBeenCalled();
	});

	it("no abre confirmacion si configuracionValida es false", () => {
		vi.spyOn(hookActividad, "useGenerarActividad").mockReturnValue({
			clases: [],
			plantillas: [],
			temas: [],
			carpetaDrive: { id: "", nombre: "" },
			configuracionValida: false,
			cargandoClases: false,
			cargandoPlantillas: false,
			cargandoTemas: false,
			generando: false,
			cargarTemasDeClase: vi.fn(),
			cargarPlantillas: vi.fn(),
			cargarClases: vi.fn(),
			ejecutarGeneracion: vi.fn(),
		});

		render(<ModalGenerarActividad abierto={true} alCerrar={vi.fn()} />);

		const btnEnviar = screen.getByRole("button", {
			name: "Enviar Formulario",
		});
		fireEvent.click(btnEnviar);

		expect(screen.queryByText("Confirmar actividad de seguimiento")).toBeNull();
	});

	it("no abre exito si la ejecucion de generacion retorna false", async () => {
		const ejecutarGeneracion = vi.fn().mockResolvedValue(false);
		vi.spyOn(hookActividad, "useGenerarActividad").mockReturnValue({
			clases: [],
			plantillas: [],
			temas: [],
			carpetaDrive: { id: "", nombre: "" },
			configuracionValida: true,
			cargandoClases: false,
			cargandoPlantillas: false,
			cargandoTemas: false,
			generando: false,
			cargarTemasDeClase: vi.fn(),
			cargarPlantillas: vi.fn(),
			cargarClases: vi.fn(),
			ejecutarGeneracion,
		});

		render(<ModalGenerarActividad abierto={true} alCerrar={vi.fn()} />);

		fireEvent.click(screen.getByRole("button", { name: "Enviar Formulario" }));

		const btnConfirmar = screen.getByRole("button", { name: "Confirmar" });
		await act(async () => {
			fireEvent.click(btnConfirmar);
		});

		expect(ejecutarGeneracion).toHaveBeenCalled();
		expect(screen.queryByText("Actividad de seguimiento generada")).toBeNull();
	});

	it("maneja fallbacks en resumen cuando no hay coincidencias de clase o plantilla y completa sin callback", async () => {
		const alCerrar = vi.fn();
		const ejecutarGeneracion = vi.fn().mockResolvedValue(true);
		vi.spyOn(hookActividad, "useGenerarActividad").mockReturnValue({
			clases: [],
			plantillas: [],
			temas: [],
			carpetaDrive: { id: "", nombre: "" },
			configuracionValida: true,
			cargandoClases: false,
			cargandoPlantillas: false,
			cargandoTemas: false,
			generando: false,
			cargarTemasDeClase: vi.fn(),
			cargarPlantillas: vi.fn(),
			cargarClases: vi.fn(),
			ejecutarGeneracion,
		});

		render(<ModalGenerarActividad abierto={true} alCerrar={alCerrar} />);

		fireEvent.click(screen.getByRole("button", { name: "Enviar Formulario" }));

		expect(screen.getByText("Confirmar actividad de seguimiento")).toBeDefined();

		const btnConfirmar = screen.getByRole("button", { name: "Confirmar" });
		await act(async () => {
			fireEvent.click(btnConfirmar);
		});

		const btnAceptar = screen.getByRole("button", { name: "Aceptar" });
		fireEvent.click(btnAceptar);

		expect(alCerrar).toHaveBeenCalled();
	});

	it("soporta datos minimos sin descripcion, hora, tema ni idPlantilla", () => {
		vi.spyOn(hookActividad, "useGenerarActividad").mockReturnValue({
			clases: [],
			plantillas: [],
			temas: [],
			carpetaDrive: { id: "", nombre: "" },
			configuracionValida: true,
			cargandoClases: false,
			cargandoPlantillas: false,
			cargandoTemas: false,
			generando: false,
			cargarTemasDeClase: vi.fn(),
			cargarPlantillas: vi.fn(),
			cargarClases: vi.fn(),
			ejecutarGeneracion: vi.fn(),
		});

		render(<ModalGenerarActividad abierto={true} alCerrar={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "Enviar Formulario Minimo" }));

		expect(screen.getByText("Confirmar actividad de seguimiento")).toBeDefined();
	});
});
