import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card.tsx";

describe("Card", () => {
	it("renderiza todos los subcomponentes de Card con sus respectivos estilos", () => {
		render(
			<Card className="custom-card">
				<CardHeader className="custom-header">
					<CardTitle className="custom-title">Título de Tarjeta</CardTitle>
					<CardDescription className="custom-desc">Descripción de la tarjeta</CardDescription>
				</CardHeader>
				<CardContent className="custom-content">Contenido principal</CardContent>
				<CardFooter className="custom-footer">Pie de tarjeta</CardFooter>
			</Card>,
		);

		expect(screen.getByText("Título de Tarjeta")).toBeDefined();
		expect(screen.getByText("Descripción de la tarjeta")).toBeDefined();
		expect(screen.getByText("Contenido principal")).toBeDefined();
		expect(screen.getByText("Pie de tarjeta")).toBeDefined();
	});
});
