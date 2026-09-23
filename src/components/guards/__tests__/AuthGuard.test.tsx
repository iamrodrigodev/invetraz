import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthGuard } from "@/components/guards/AuthGuard.tsx";
import { useAppStore } from "@/store/useAppStore.ts";

describe("AuthGuard", () => {
	beforeEach(() => {
		useAppStore.setState({ autenticado: false });
	});

	it("redirecciona a /login cuando no esta autenticado", () => {
		useAppStore.setState({ autenticado: false });

		render(
			<MemoryRouter initialEntries={["/protegido"]}>
				<Routes>
					<Route path="/login" element={<div>Pagina Login</div>} />
					<Route element={<AuthGuard />}>
						<Route path="/protegido" element={<div>Pagina Secreta</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Pagina Login")).toBeDefined();
		expect(screen.queryByText("Pagina Secreta")).toBeNull();
	});

	it("renderiza el Outlet cuando esta autenticado", () => {
		useAppStore.setState({ autenticado: true });

		render(
			<MemoryRouter initialEntries={["/protegido"]}>
				<Routes>
					<Route path="/login" element={<div>Pagina Login</div>} />
					<Route element={<AuthGuard />}>
						<Route path="/protegido" element={<div>Pagina Secreta</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);

		expect(screen.getByText("Pagina Secreta")).toBeDefined();
	});
});
