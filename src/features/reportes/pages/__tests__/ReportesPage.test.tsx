import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DefaultReportesPage, { ReportesPage } from "@/features/reportes/pages/ReportesPage.tsx";

describe("ReportesPage", () => {
	it("renderiza el modulo en construccion de reportes", () => {
		render(<ReportesPage />);
		expect(screen.getByText("Reportes")).toBeDefined();
		expect(screen.getByText(/Estamos trabajando arduamente en este módulo/iu)).toBeDefined();
	});

	it("soporta default export", () => {
		expect(DefaultReportesPage).toBe(ReportesPage);
	});
});
