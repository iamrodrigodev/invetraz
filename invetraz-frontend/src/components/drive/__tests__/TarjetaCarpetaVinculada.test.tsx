import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TarjetaCarpetaReexport, {
	TarjetaCarpetaVinculada as TarjetaReexportNamed,
} from "@/components/drive/TarjetaCarpetaVinculada.tsx";
import { TarjetaCarpetaVinculada } from "@/features/drive/TarjetaCarpetaVinculada.tsx";

describe("TarjetaCarpetaVinculada", () => {
	it("renderiza correctamente cuando el estado es verificando", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Carpeta de Investigación"
				estado="verificando"
			/>,
		);

		expect(screen.getByText("Carpeta de Investigación")).toBeDefined();
		expect(screen.getByText("Verificando...")).toBeDefined();
		expect(screen.getByText("folder-abc-123")).toBeDefined();
		expect(screen.getByText("Abrir en Drive")).toBeDefined();
	});

	it("renderiza correctamente en estado verificada", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Carpeta Verificada"
				estado="verificada"
			/>,
		);

		expect(screen.getByText("Carpeta Verificada")).toBeDefined();
		expect(screen.getByText("Carpeta vinculada")).toBeDefined();
	});

	it("renderiza correctamente en estado pendiente", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Carpeta Sin Verificar"
				estado="pendiente"
			/>,
		);

		expect(screen.getByText(/carpeta guardada sin verificar/iu)).toBeDefined();
		expect(screen.getByText("Guardada, no verificada")).toBeDefined();
	});

	it("renderiza correctamente en estado no_disponible con nombre preservado y badge 'No se puede usar'", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-abc-123"
				nombre="Plantillas de Seguimiento"
				estado="no_disponible"
			/>,
		);

		expect(screen.getByText("Plantillas de Seguimiento")).toBeDefined();
		expect(screen.getByText("No se puede usar")).toBeDefined();
	});

	it("renderiza modo compacto correctamente", () => {
		render(
			<TarjetaCarpetaVinculada
				carpetaId="folder-compacto"
				nombre="Carpeta Compacta"
				estado="verificada"
				compacto={true}
			/>,
		);

		expect(screen.getByText("Carpeta Compacta")).toBeDefined();
		expect(screen.getByText("Carpeta vinculada")).toBeDefined();
	});

	it("reexporta correctamente desde components/drive/TarjetaCarpetaVinculada", () => {
		expect(TarjetaCarpetaReexport).toBeDefined();
		expect(TarjetaReexportNamed).toBeDefined();

		const { unmount } = render(
			<TarjetaCarpetaReexport
				carpetaId="folder-reexport"
				nombre="Carpeta Reexportada"
				estado="verificada"
			/>,
		);
		expect(screen.getByText("Carpeta Reexportada")).toBeDefined();
		unmount();
	});
});
