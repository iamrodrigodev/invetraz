import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Microscope, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Input } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import { useAppStore } from "../../../store/useAppStore";
import { login } from "../api/auth.api";
import {
	type LoginPeticion,
	LoginPeticionSchema,
} from "../types/LoginPeticion";

export function LoginPage() {
	const navigate = useNavigate();
	const setAutenticado = useAppStore((state) => state.setAutenticado);
	const [errorApi, setErrorApi] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		sessionStorage.removeItem("motivo_salida");
	}, []);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
	} = useForm<LoginPeticion>({
		resolver: zodResolver(LoginPeticionSchema),
		mode: "onChange",
	});

	const onSubmit = async (data: LoginPeticion) => {
		try {
			setErrorApi(null);
			const respuesta = await login(data);
			setAutenticado(
				true,
				data.email.trim().toLowerCase(),
				respuesta.tokenAcceso,
			);
			navigate("/actividades", { replace: true });
		} catch (error) {
			setErrorApi(
				error instanceof Error ? error.message : "Credenciales inválidas",
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
						Sistema de <span className="text-primary">Investigación</span>
					</h1>
					<p className="max-w-md text-slate-600 text-sm leading-relaxed md:text-base">
						Inicia sesión para administrar la plataforma.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					autoComplete="off"
					className="space-y-6"
				>
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-medium text-slate-800"
						>
							Correo Electrónico <span className="text-red-500">*</span>
						</label>
						<Input
							id="email"
							type="email"
							placeholder="admin@ulasalle.edu.pe"
							maxLength={VALIDATION_LIMITS.MAX_EMAIL}
							autoComplete="off"
							data-lpignore="true"
							data-1p-ignore="true"
							errorMessage={errors.email?.message}
							{...register("email")}
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-2 block text-sm font-medium text-slate-800"
						>
							Contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Ingresa tu contraseña"
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							autoComplete="off"
							data-lpignore="true"
							data-1p-ignore="true"
							errorMessage={errors.password?.message}
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
					</div>

					{errorApi && (
						<Alert
							key="error-login"
							message={errorApi}
							onClose={() => setErrorApi(null)}
						/>
					)}
					<Button
						type="submit"
						disabled={!isValid || isSubmitting}
						className="w-full font-bold"
						size="lg"
					>
						{isSubmitting ? (
							<>
								<RefreshCw size={18} className="mr-2 animate-spin" />
								Ingresando...
							</>
						) : (
							<>
								<LogIn size={18} className="mr-2" />
								Ingresar
							</>
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
