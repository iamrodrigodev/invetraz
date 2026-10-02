import { describe, expect, it } from "vitest";
import { resolverVistaCarpetaDrive as resolverVistaReexport } from "@/components/drive/estadoCarpetaDrive.ts";
import { resolverVistaCarpetaDrive } from "@/features/drive/estadoCarpetaDrive.ts";

describe("resolverVistaCarpetaDrive", () => {
	it("retorna estado no configurado si no hay carpetaId", () => {
		const vista = resolverVistaCarpetaDrive({});
		expect(vista.estaConfigurada).toBe(false);
		expect(vista.nombreVisible).toBeNull();
	});

	it("maneja estado verificando preservando el nombre de la carpeta", () => {
		const vista = resolverVistaCarpetaDrive({
			carpetaId: "folder-123",
			carpetaNombre: "Plantillas Oficiales",
			estado: "verificando",
		});

		expect(vista.estado).toBe("verificando");
		expect(vista.estaVerificando).toBe(true);
		expect(vista.estaPendiente).toBe(false);
		expect(vista.nombreVisible).toBe("Plantillas Oficiales");
		expect(vista.badgeTexto).toBe("Verificando...");
	});

	it("maneja estado verificando sin nombre previo mostrando texto de verificación", () => {
		const vista = resolverVistaCarpetaDrive({
			carpetaId: "folder-123",
			carpetaNombre: null,
			estado: "verificando",
		});

		expect(vista.estado).toBe("verificando");
		expect(vista.estaVerificando).toBe(true);
		expect(vista.estaPendiente).toBe(false);
		expect(vista.nombreVisible).toBe("Carpeta en verificación");
		expect(vista.badgeTexto).toBe("Verificando...");
	});

	it("maneja estado pendiente mostrando advertencia y texto por defecto", () => {
		const vista = resolverVistaCarpetaDrive({
			carpetaId: "folder-123",
			carpetaNombre: null,
			estado: "pendiente",
		});

		expect(vista.estado).toBe("pendiente");
		expect(vista.estaPendiente).toBe(true);
		expect(vista.estaVerificando).toBe(false);
		expect(vista.nombreVisible).toBe("Carpeta guardada sin verificar");
		expect(vista.badgeTexto).toBe("Guardada, no verificada");
	});

	it("maneja estado verificada con éxito", () => {
		const vista = resolverVistaCarpetaDrive({
			carpetaId: "folder-123",
			carpetaNombre: "Plantillas 2026",
			estado: "verificada",
		});

		expect(vista.estado).toBe("verificada");
		expect(vista.estaVerificando).toBe(false);
		expect(vista.estaPendiente).toBe(false);
		expect(vista.nombreVisible).toBe("Plantillas 2026");
		expect(vista.badgeTexto).toBe("Carpeta vinculada");
	});

	it("maneja estado no_disponible con y sin nombre previo", () => {
		const vistaConNombre = resolverVistaCarpetaDrive({
			carpetaId: "folder-123",
			carpetaNombre: "Plantillas Inaccesibles",
			estado: "no_disponible",
		});
		expect(vistaConNombre.estado).toBe("no_disponible");
		expect(vistaConNombre.estaNoDisponible).toBe(true);
		expect(vistaConNombre.nombreVisible).toBe("Plantillas Inaccesibles");
		expect(vistaConNombre.badgeTexto).toBe("No se puede usar");

		const vistaSinNombre = resolverVistaCarpetaDrive({
			carpetaId: "folder-123",
			carpetaNombre: null,
			estado: "no_disponible",
		});
		expect(vistaSinNombre.estado).toBe("no_disponible");
		expect(vistaSinNombre.estaNoDisponible).toBe(true);
		expect(vistaSinNombre.nombreVisible).toBe("Carpeta no disponible");
		expect(vistaSinNombre.badgeTexto).toBe("No se puede usar");
	});

	it("reexporta correctamente desde components/drive/estadoCarpetaDrive", () => {
		expect(resolverVistaReexport).toBe(resolverVistaCarpetaDrive);
	});
});
