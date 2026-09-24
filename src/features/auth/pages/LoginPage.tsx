import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Microscope, RefreshCw } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/Alert.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { VALIDATION_LIMITS } from "@/constants/validations.ts";
import { login, precalentarConexion } from "@/features/auth/api/auth.api.ts";
import { type LoginPeticion, LoginPeticionSchema } from "@/features/auth/types/LoginPeticion.ts";
import { useAppStore } from "@/store/useAppStore.ts";

export function LoginPage() {
	const navigate = useNavigate();
	const emailId = useId();
	const passwordId = useId();
	const setAutenticado = useAppStore((state) => state.setAutenticado);
	const [errorApi, setErrorApi] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		sessionStorage.removeItem("motivo_salida");
		precalentarConexion();
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
			setAutenticado(true, data.email.trim().toLowerCase(), respuesta.tokenAcceso);
			navigate("/actividades", { replace: true });
		} catch (error) {
			setErrorApi(error instanceof Error ? error.message : "Credenciales inválidas");
		}
	};

	return (
		<div className="flex min-h-dvh w-full items-center justify-center bg-slate-50 p-4 font-sans text-slate-800 sm:p-6">
			<div className="w-full max-w-120 rounded-2xl bg-white p-5 shadow-xs sm:rounded-3xl sm:border sm:border-slate-200/60 sm:p-8 md:p-12">
				<div className="mb-7 flex flex-col items-center text-center sm:mb-8">
					<Microscope
						className="mb-4 h-12 w-12 shrink-0 text-primary sm:h-14 sm:w-14"
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
					className="space-y-5 sm:space-y-6"
				>
					<div>
						<label htmlFor={emailId} className="mb-2 block font-medium text-slate-800 text-sm">
							Correo Electrónico <span className="text-red-500">*</span>
						</label>
						<Input
							id={emailId}
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
						<label htmlFor={passwordId} className="mb-2 block font-medium text-slate-800 text-sm">
							Contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id={passwordId}
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
									className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-primary/70 transition-colors hover:bg-slate-100 hover:text-primary focus:outline-none"
									aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							}
						/>
					</div>

					{errorApi && (
						<Alert key="error-login" message={errorApi} onClose={() => setErrorApi(null)} />
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
