import { describe, expect, it } from "vitest";
import {
	CambiarClavePaso1Schema,
	CambiarClavePaso2Schema,
	CrearAdminSchema,
	emailInstitucionalSchema,
	LoginSchema,
	passwordActualSchema,
	passwordSeguroSchema,
} from "@/schemas/auth.schemas.ts";

describe("auth.schemas", () => {
	describe("emailInstitucionalSchema", () => {
		it("normaliza y valida correos institucionales validos", () => {
			expect(emailInstitucionalSchema.parse(" admin@ulasalle.edu.pe ")).toBe(
				"admin@ulasalle.edu.pe",
			);
		});

		it("rechaza correo vacio", () => {
			expect(emailInstitucionalSchema.safeParse("").error?.issues[0]?.message).toBe(
				"El correo es obligatorio",
			);
		});

		it("rechaza formato de correo invalido", () => {
			expect(emailInstitucionalSchema.safeParse("correo-invalido").error?.issues[0]?.message).toBe(
				"Correo inválido",
			);
		});

		it("rechaza dominio no institucional", () => {
			expect(
				emailInstitucionalSchema.safeParse("admin@ejemplo.com").error?.issues[0]?.message,
			).toBe("Debe ser un correo institucional (@ulasalle.edu.pe)");
		});

		it("rechaza correos que excedan 150 caracteres", () => {
			const emailLargo = `${"a".repeat(140)}@ulasalle.edu.pe`;
			const res = emailInstitucionalSchema.safeParse(emailLargo);
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toContain("150 caracteres");
		});
	});

	describe("passwordSeguroSchema", () => {
		it("valida contraseñas que cumplen todos los requisitos", () => {
			expect(passwordSeguroSchema.safeParse("Password123").success).toBe(true);
		});

		it("rechaza contraseña vacia", () => {
			const res = passwordSeguroSchema.safeParse("");
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("La contraseña es obligatoria");
		});

		it("rechaza contraseña menor a 8 caracteres", () => {
			const res = passwordSeguroSchema.safeParse("Pass1");
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toContain("al menos 8 caracteres");
		});

		it("rechaza contraseña mayor a 255 caracteres", () => {
			const res = passwordSeguroSchema.safeParse(`P1${"a".repeat(255)}`);
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toContain("255 caracteres");
		});

		it("rechaza contraseña sin letra mayuscula", () => {
			const res = passwordSeguroSchema.safeParse("password123");
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("Debe contener al menos una letra mayúscula");
		});

		it("rechaza contraseña sin numeros", () => {
			const res = passwordSeguroSchema.safeParse("PasswordSinNumero");
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("Debe contener al menos un número");
		});

		it("rechaza contraseña con saltos de linea", () => {
			const res = passwordSeguroSchema.safeParse("Password123\n");
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("No se permiten saltos de línea");
		});
	});

	describe("passwordActualSchema", () => {
		it("acepta cualquier contraseña no vacia de hasta 255 caracteres", () => {
			expect(passwordActualSchema.safeParse("Cualquiera1").success).toBe(true);
		});

		it("rechaza contraseña actual vacia", () => {
			const res = passwordActualSchema.safeParse("");
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("Ingresa tu contraseña actual");
		});
	});

	describe("LoginSchema", () => {
		it("valida payload de login correcto", () => {
			const res = LoginSchema.safeParse({
				email: "admin@ulasalle.edu.pe",
				password: "Password123",
			});
			expect(res.success).toBe(true);
		});

		it("rechaza contraseña con salto de linea en login", () => {
			const res = LoginSchema.safeParse({
				email: "admin@ulasalle.edu.pe",
				password: "Pass\nword",
			});
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("No se permiten saltos de línea");
		});
	});

	describe("CrearAdminSchema", () => {
		it("acepta si las contraseñas coinciden", () => {
			const res = CrearAdminSchema.safeParse({
				email: "admin@ulasalle.edu.pe",
				password: "Password123",
				confirmPassword: "Password123",
			});
			expect(res.success).toBe(true);
		});

		it("rechaza si las contraseñas no coinciden", () => {
			const res = CrearAdminSchema.safeParse({
				email: "admin@ulasalle.edu.pe",
				password: "Password123",
				confirmPassword: "Password999",
			});
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("Las contraseñas no coinciden");
			expect(res.error?.issues[0]?.path).toEqual(["confirmPassword"]);
		});
	});

	describe("CambiarClavePaso1Schema", () => {
		it("valida correctamente el formulario de paso 1", () => {
			const res = CambiarClavePaso1Schema.safeParse({
				claveActual: "ClaveAntigua1",
			});
			expect(res.success).toBe(true);
		});
	});

	describe("CambiarClavePaso2Schema", () => {
		it("valida cambio de clave cuando coinciden", () => {
			const res = CambiarClavePaso2Schema.safeParse({
				nuevaClave: "NuevaClave123",
				confirmarClave: "NuevaClave123",
			});
			expect(res.success).toBe(true);
		});

		it("rechaza cuando la confirmacion no coincide", () => {
			const res = CambiarClavePaso2Schema.safeParse({
				nuevaClave: "NuevaClave123",
				confirmarClave: "OtraClave123",
			});
			expect(res.success).toBe(false);
			expect(res.error?.issues[0]?.message).toBe("Las contraseñas no coinciden");
		});
	});
});
