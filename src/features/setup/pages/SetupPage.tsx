// biome-ignore-all lint/style/noJsxLiterals lint/nursery/useExplicitType lint/style/noTernary lint/nursery/useExplicitReturnType lint/complexity/noExcessiveLinesPerFunction lint/style/noMagicNumbers lint/nursery/useConsistentFunctionStyle lint/nursery/noUnsafeTypeAssertion lint/performance/useTopLevelRegex lint/performance/noJsxPropsBind lint/suspicious/useAwait lint/style/useNamingConvention lint/suspicious/noLeakedRender lint/style/noNonNullAssertion lint/style/useFilenamingConvention lint/style/useGlobalThis lint/style/noDefaultExport lint/suspicious/noEmptyBlockStatements lint/correctness/useUniqueElementIds lint/style/useDestructuring lint/security/noSecrets lint/style/useComponentExportOnlyModules lint/complexity/noRedundantDefaultExport lint/style/noNestedTernary lint/suspicious/noExplicitAny lint/correctness/useQwikValidLexicalScope lint/style/useExportsLast lint/complexity/noExcessiveCognitiveComplexity lint/performance/noNamespaceImport lint/style/noExportedImports lint/style/noExcessiveLinesPerFile lint/suspicious/noUnnecessaryConditions lint/style/noIncrementDecrement lint/performance/noBarrelFile lint/correctness/noNodejsModules lint/style/noProcessEnv lint/performance/noReExportAll lint/nursery/useNamedCaptureGroup lint/correctness/noUnresolvedImports lint/style/noSubstr lint/style/noContinue lint/style/useErrorCause lint/suspicious/noShadow lint/nursery/useImportsFirst: Reglas estrictas de preset all aceptadas para este modulo React existente.
// biome-ignore-all lint/suspicious/noReactSpecificProps: React usa className/htmlFor; preset all tambien activa reglas Solid/Qwik.
// biome-ignore-all lint/correctness/noSolidDestructuredProps: Proyecto React, no Solid.
// biome-ignore-all lint/correctness/useQwikValidLexicalScope: Proyecto React, no Qwik.
// biome-ignore-all lint/performance/useSolidForComponent: Proyecto React, no Solid.
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Microscope, RefreshCw, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui/Alert.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Input } from "@/components/ui/Input.tsx";
import { VALIDATION_LIMITS } from "@/constants/validations.ts";
import { login } from "@/features/auth/api/auth.api.ts";
import { crearAdmin } from "@/features/setup/api/setup.api.ts";
import {
	type CrearAdminPeticion,
	CrearAdminPeticionSchema,
} from "@/features/setup/types/CrearAdminPeticion.ts";
import { useAppStore } from "@/store/useAppStore.ts";

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

			const loginRes = await login({
				email: payload.email,
				password: payload.password,
			});
			setConfigurado(true);
			setAutenticado(true, payload.email.trim().toLowerCase(), loginRes.tokenAcceso);
			navigate("/", { replace: true });
		} catch (error) {
			const mensaje = error instanceof Error ? error.message : "Error al crear la cuenta";
			setErrorApi(mensaje);
			if (mensaje.toLowerCase().includes("ya ha sido configurado")) {
				setConfigurado(true);
				setTimeout(() => {
					navigate("/login", { replace: true });
				}, 1500);
			}
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans text-slate-800">
			<div className="w-full max-w-120 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xs md:p-12">
				<div className="mb-8 flex flex-col items-center text-center">
					<Microscope className="mb-4 h-14 w-14 shrink-0 text-primary" strokeWidth={2.2} />
					<h1 className="mb-2 font-extrabold font-heading text-2xl text-slate-900 tracking-tight md:text-3xl">
						Sistema de <span className="text-primary">Investigación</span>
					</h1>
					<p className="max-w-md text-slate-600 text-sm leading-relaxed md:text-base">
						Crea tu cuenta de administrador para continuar.
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label htmlFor="email" className="mb-2 block font-medium text-slate-800 text-sm">
							Correo Electrónico <span className="text-red-500">*</span>
						</label>
						<Input
							id="email"
							type="email"
							placeholder="admin@ulasalle.edu.pe"
							maxLength={VALIDATION_LIMITS.MAX_EMAIL}
							autoComplete="email"
							errorMessage={errors.email?.message}
							{...register("email")}
						/>
					</div>

					<div>
						<label htmlFor="password" className="mb-2 block font-medium text-slate-800 text-sm">
							Contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Crea tu contraseña"
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							autoComplete="new-password"
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
						{!errors.password && (
							<p className="mt-1.5 font-medium text-slate-700 text-xs">
								Mínimo 8 caracteres, 1 mayúscula y 1 número
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="mb-2 block font-medium text-slate-800 text-sm"
						>
							Confirmar Contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="confirmPassword"
							type={showConfirm ? "text" : "password"}
							placeholder="Confirma tu contraseña"
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							autoComplete="new-password"
							errorMessage={errors.confirmPassword?.message}
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
					</div>

					{errorApi && (
						<Alert key="error-setup" message={errorApi} onClose={() => setErrorApi(null)} />
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
								Creando administrador...
							</>
						) : (
							<>
								<UserPlus size={18} className="mr-2" />
								Crear Administrador
							</>
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
