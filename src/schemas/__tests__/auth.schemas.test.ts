import { describe, expect, it } from "vitest";
import { emailInstitucionalSchema } from "@/schemas/auth.schemas";

describe("emailInstitucionalSchema", () => {
	it("conserva la validación y normalización del correo", () => {
		expect(emailInstitucionalSchema.parse(" admin@ulasalle.edu.pe ")).toBe(
			"admin@ulasalle.edu.pe",
		);
		expect(
			emailInstitucionalSchema.safeParse("").error?.issues[0]?.message,
		).toBe("El correo es obligatorio");
		expect(
			emailInstitucionalSchema.safeParse("correo-invalido").error?.issues[0]
				?.message,
		).toBe("Correo inválido");
		expect(
			emailInstitucionalSchema.safeParse("admin@ejemplo.com").error?.issues[0]
				?.message,
		).toBe("Debe ser un correo institucional (@ulasalle.edu.pe)");
	});
});
