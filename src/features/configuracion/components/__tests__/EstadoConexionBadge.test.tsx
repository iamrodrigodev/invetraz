import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	EstadoConexionBadge,
	type TipoEstadoConexion,
} from "@/features/configuracion/components/EstadoConexionBadge.tsx";

describe("EstadoConexionBadge", () => {
	it("renderiza todos los estados soportados correctamente", () => {
		const casos: [TipoEstadoConexion, string][] = [
			["conectado", "Conexión activa con Google"],
			["guardado_pendiente", "Guardada, no verificada"],
			["no_disponible", "No se puede usar"],
			["verificando", "Verificando conexión..."],
			["error", "Error de conexión"],
			["no_configurado", "Pendiente de configuración"],
		];

		for (const [estado, textoEsperado] of casos) {
			const { unmount } = render(<EstadoConexionBadge estado={estado} className="custom-badge" />);
			expect(screen.getByText(textoEsperado)).toBeDefined();
			unmount();
		}
	});

	it("retorna null para estados no reconocidos", () => {
		const { container } = render(<EstadoConexionBadge estado={"invalido" as TipoEstadoConexion} />);
		expect(container.firstChild).toBeNull();
	});
});
