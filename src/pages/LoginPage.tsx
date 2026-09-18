import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { LoginPeticionSchema, type LoginPeticion } from "../types";

export function LoginPage() {
	const navigate = useNavigate();
	const [errorApi, setErrorApi] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginPeticion>({
		resolver: zodResolver(LoginPeticionSchema),
	});

	const onSubmit = async (data: LoginPeticion) => {
		try {
			setErrorApi(null);
			const respuesta = await login(data);
			localStorage.setItem("jwt", respuesta.tokenAcceso);
			navigate("/", { replace: true });
		} catch (error: any) {
			setErrorApi(error.message || "Credenciales inválidas");
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
			<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold tracking-tight text-slate-900">
						Iniciar Sesión
					</h1>
					<p className="mt-2 text-sm text-slate-600">
						Ingresa para administrar el sistema.
					</p>
				</div>

				{errorApi && (
					<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
						{errorApi}
					</div>
				)}

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="mb-2 block text-sm font-medium text-slate-700"
						>
							Correo Electrónico
						</label>
						<input
							id="email"
							type="email"
							{...register("email")}
							className="block w-full rounded-lg border-0 px-4 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							placeholder="tu@correo.com"
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
							Contraseña
						</label>
						<input
							id="password"
							type="password"
							{...register("password")}
							className="block w-full rounded-lg border-0 px-4 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
							placeholder="••••••••"
						/>
						{errors.password && (
							<p className="mt-2 text-sm text-red-600">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex w-full cursor-pointer justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
					>
						{isSubmitting ? "Ingresando..." : "Ingresar"}
					</button>
				</form>
			</div>
		</div>
	);
}
