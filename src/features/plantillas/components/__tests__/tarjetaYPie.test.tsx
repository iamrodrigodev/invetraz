import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DefaultPie, {
	PiePaginacionPlantillas,
} from "@/features/plantillas/components/PiePaginacionPlantillas.tsx";
import DefaultTarjeta, {
	TarjetaPlantilla,
} from "@/features/plantillas/components/TarjetaPlantilla.tsx";
import type { PlantillaXlsx } from "@/features/plantillas/types/plantillas.types.ts";

describe("Plantillas Components", () => {
	describe("TarjetaPlantilla", () => {
		const plantillaMock: PlantillaXlsx = {
			id: "plan-1",
			nombre: "Plantilla 1.xlsx",
			tipoMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			enlaceWeb: "https://drive.google.com/open?id=plan-1",
			enlaceDescarga: "https://drive.google.com/uc?id=plan-1",
			tamanoBytes: 2048,
			ultimaModificacion: "2026-05-15T14:30:00Z",
		};

		it("renderiza datos de archivo XLSX y abre enlace web", () => {
			const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
			render(<TarjetaPlantilla plantilla={plantillaMock} />);

			expect(screen.getByText("Plantilla 1.xlsx")).toBeDefined();
			expect(screen.getByText("XLSX")).toBeDefined();
			expect(screen.getByText("2 KB")).toBeDefined();

			const btnAbrir = screen.getByRole("button", { name: /abrir plantilla/iu });
			fireEvent.click(btnAbrir);
			expect(openSpy).toHaveBeenCalledWith(
				plantillaMock.enlaceWeb,
				"_blank",
				"noopener,noreferrer",
			);
			(plantillaMock as any).enlaceWeb = null;
			fireEvent.click(btnAbrir);
			openSpy.mockRestore();
		});

		it("renderiza datos de Google Sheets sin tamano ni fecha", () => {
			const sheetMock: PlantillaXlsx = {
				id: "sheet-1",
				nombre: "Plantilla Sheets",
				tipoMime: "application/vnd.google-apps.spreadsheet",
				enlaceWeb: null,
				enlaceDescarga: null,
				tamanoBytes: 0,
				ultimaModificacion: null,
			};

			render(<TarjetaPlantilla plantilla={sheetMock} />);
			expect(screen.getByText("Google Sheets")).toBeDefined();
			expect(screen.getByText("Hoja de cálculo en nube")).toBeDefined();
			expect(screen.getByText("Sin fecha registrada")).toBeDefined();
		});

		it("maneja error en formateo de fecha retornando string original", () => {
			const dateSpy = vi.spyOn(Intl, "DateTimeFormat").mockImplementationOnce(() => {
				throw new Error("Formato invalido");
			});

			render(
				<TarjetaPlantilla
					plantilla={{
						...plantillaMock,
						ultimaModificacion: "fecha-invalida",
					}}
				/>,
			);

			expect(screen.getByText("fecha-invalida")).toBeDefined();
			dateSpy.mockRestore();
		});

		it("soporta export por defecto", () => {
			expect(DefaultTarjeta).toBe(TarjetaPlantilla);
		});
	});

	describe("PiePaginacionPlantillas", () => {
		it("renderiza singular cuando totalItems es 1 y no muestra controles si totalPaginas es 1", () => {
			const { container } = render(
				<PiePaginacionPlantillas
					indiceInicio={0}
					indiceFin={10}
					totalItems={1}
					paginaActual={1}
					totalPaginas={1}
					onCambiarPagina={vi.fn()}
				/>,
			);

			expect(container.textContent).toContain("1 plantilla");
			expect(screen.queryByRole("button", { name: "Anterior" })).toBeNull();
		});

		it("renderiza controles de paginacion y maneja clics en pagina, anterior y siguiente", () => {
			const cambiarPagina = vi.fn();
			const { rerender } = render(
				<PiePaginacionPlantillas
					indiceInicio={10}
					indiceFin={20}
					totalItems={25}
					paginaActual={2}
					totalPaginas={3}
					onCambiarPagina={cambiarPagina}
				/>,
			);

			const btnAnterior = screen.getByRole("button", { name: /anterior/iu });
			fireEvent.click(btnAnterior);
			expect(cambiarPagina).toHaveBeenCalledWith(1);

			const btnPagina2 = screen.getByRole("button", { name: "2" });
			fireEvent.click(btnPagina2);
			expect(cambiarPagina).toHaveBeenCalledWith(2);

			const btnSiguiente = screen.getByRole("button", { name: /siguiente/iu });
			fireEvent.click(btnSiguiente);
			expect(cambiarPagina).toHaveBeenCalledWith(3);

			rerender(
				<PiePaginacionPlantillas
					indiceInicio={20}
					indiceFin={30}
					totalItems={25}
					paginaActual={3}
					totalPaginas={3}
					onCambiarPagina={cambiarPagina}
				/>,
			);

			const btnSiguienteFinal = screen.getByRole("button", {
				name: /siguiente/iu,
			});
			expect(btnSiguienteFinal.hasAttribute("disabled")).toBe(true);
		});

		it("soporta export por defecto", () => {
			expect(DefaultPie).toBe(PiePaginacionPlantillas);
		});
	});
});
