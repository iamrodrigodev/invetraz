import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Microscope } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import { useAppStore } from "../../../store/useAppStore";
import { login } from "../../auth/api/auth.api";
import { crearAdmin } from "../api/setup.api";
import {
	type CrearAdminPeticion,
	CrearAdminPeticionSchema,
} from "../types/CrearAdminPeticion";

export function SetupPage() {
	const navigate = useNavigate();
	const setConfigurado = useAppStore((state) => state.setConfigurado);
	const setAutenticado = useAppStore((state) => state.setAutenticado);
	const [errorApi, setErrorApi] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<CrearAdminPeticion>({
		resolver: zodResolver(CrearAdminPeticionSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: CrearAdminPeticion) => {
		try {
			setErrorApi(null);
			const { confirmPassword, ...payload } = data;
			await crearAdmin(payload);

			// Auto-login instantáneo
			await login({
				email: payload.email,
				password: payload.password,
			});
			// El token ahora vive seguro en una Cookie HttpOnly
			setConfigurado(true);
			setAutenticado(true);
			navigate("/", { replace: true });
		} catch (error) {
			setErrorApi(
				error instanceof Error ? error.message : "Error al crear la cuenta",
			);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
			<div className="w-full max-w-120 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs md:p-12">
				<div className="mb-8 flex flex-col items-center text-center">
					<Microscope
						className="mb-4 h-14 w-14 shrink-0 text-primary"
						strokeWidth={2.2}
					/>
					<h1 className="mb-2 font-extrabold font-heading text-2xl text-slate-900 tracking-tight md:text-3xl">
						Sistema de InvestigaciÃ³n
					</h1>
					<p className="max-w-md text-slate-500 text-sm leading-relaxed md:text-base">
						Crea tu cuenta de administrador para continuar.
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-medium text-slate-700"
						>
							Correo ElectrÃ³nico
						</label>
						<Input
							id="email"
							type="email"
							placeholder="admin@ulasalle.edu.pe"
							maxLength={VALIDATION_LIMITS.MAX_EMAIL}
							showCount
							error={!!errors.email}
							{...register("email")}
						/>
						{errors.email && (
							<p className="mt-2 text-sm text-red-600">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-medium text-slate-700"
						>
							ContraseÃ±a
						</label>
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="MÃ­nimo 8 caracteres, 1 mayÃºscula y 1 nÃºmero"
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							showCount
							error={!!errors.password}
							{...register("password")}
							rightElement={
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							}
						/>
						{errors.password && (
							<p className="mt-2 text-sm text-red-600">
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="mb-2 block text-sm font-medium text-slate-700"
						>
							Confirmar ContraseÃ±a
						</label>
						<Input
							id="confirmPassword"
							type={showConfirm ? "text" : "password"}
							placeholder="Vuelve a escribir tu contraseÃ±a"
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							showCount
							error={!!errors.confirmPassword}
							{...register("confirmPassword")}
							rightElement={
								<button
									type="button"
									onClick={() => setShowConfirm(!showConfirm)}
									className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
								>
									{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							}
						/>
						{errors.confirmPassword && (
							<p className="mt-2 text-sm text-red-600">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					{errorApi && (
						<Alert message={errorApi} onClose={() => setErrorApi(null)} />
					)}
					<Button
						type="submit"
						disabled={!isValid}
						isLoading={isSubmitting}
						className="w-full font-bold"
						size="lg"
					>
						{isSubmitting ? "Creando..." : "Crear Administrador"}
					</Button>
				</form>
			</div>
		</div>
	);
}
