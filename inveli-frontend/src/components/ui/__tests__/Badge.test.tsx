import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/Badge.tsx";

describe("Badge", () => {
	it("renderiza correctamente con texto y estilos por defecto", () => {
		render(<Badge>Activo</Badge>);
		const badge = screen.getByText("Activo");
		expect(badge).toBeDefined();
		expect(badge.className).toContain("bg-primary-50");
	});

	it("aplica estilos segun la variante especificada", () => {
		const { rerender } = render(<Badge variant="success">Exito</Badge>);
		let badge = screen.getByText("Exito");
		expect(badge.className).toContain("bg-emerald-50");

		rerender(<Badge variant="warning">Alerta</Badge>);
		badge = screen.getByText("Alerta");
		expect(badge.className).toContain("bg-amber-50");

		rerender(<Badge variant="destructive">Peligro</Badge>);
		badge = screen.getByText("Peligro");
		expect(badge.className).toContain("bg-red-50");

		rerender(<Badge variant="slate">Neutro</Badge>);
		badge = screen.getByText("Neutro");
		expect(badge.className).toContain("bg-slate-100");

		rerender(<Badge variant="blue">Azul</Badge>);
		badge = screen.getByText("Azul");
		expect(badge.className).toContain("bg-primary text-white");
	});
});
