import { render, screen } from "@testing-library/react";
import { Wrench } from "lucide-react";
import { describe, expect, it } from "vitest";
import { ModuloEnConstruccion } from "@/components/ui/ModuloEnConstruccion.tsx";

describe("ModuloEnConstruccion", () => {
	it("renderiza titulo y descripcion por defecto", () => {
		render(<ModuloEnConstruccion titulo="Módulo de Reportes" />);
		expect(screen.getByText("Módulo de Reportes")).toBeDefined();
		expect(screen.getByText(/estamos trabajando arduamente/iu)).toBeDefined();
	});

	it("renderiza con descripcion e icono personalizados", () => {
		render(
			<ModuloEnConstruccion
				titulo="Módulo Custom"
				descripcion="Pronto estará disponible"
				icono={Wrench}
			/>,
		);
		expect(screen.getByText("Módulo Custom")).toBeDefined();
		expect(screen.getByText("Pronto estará disponible")).toBeDefined();
	});
});
