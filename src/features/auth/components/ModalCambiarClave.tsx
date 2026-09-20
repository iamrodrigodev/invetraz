import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	CheckCircle2,
	Eye,
	EyeOff,
	RefreshCw,
	Save,
	ShieldCheck,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Button, Input, Modal } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";
import {
	type CambiarClavePaso1FormData,
	CambiarClavePaso1Schema,
	type CambiarClavePaso2FormData,
	CambiarClavePaso2Schema,
} from "../../../schemas/auth.schemas";
import { useCambiarClave } from "../hooks/useCambiarClave";

export interface ModalCambiarClaveProps {
	abierto: boolean;
	alCerrar: () => void;
}

export function ModalCambiarClave({
	abierto,
	alCerrar,
}: ModalCambiarClaveProps) {
	const {
		paso,
		setPaso,
		cargando,
		exito,
		errorApi,
		limpiarError,
		verificarPaso1,
		actualizarClave,
		reiniciar,
	} = useCambiarClave();

	const [showActual, setShowActual] = useState(false);
	const [showNueva, setShowNueva] = useState(false);
	const [showConfirmar, setShowConfirmar] = useState(false);

	const formPaso1 = useForm<CambiarClavePaso1FormData>({
		resolver: zodResolver(CambiarClavePaso1Schema),
		mode: "onChange",
		defaultValues: {
			claveActual: "",
		},
	});

	const formPaso2 = useForm<CambiarClavePaso2FormData>({
		resolver: zodResolver(CambiarClavePaso2Schema),
		mode: "onChange",
		defaultValues: {
			nuevaClave: "",
			confirmarClave: "",
		},
	});

	useEffect(() => {
		if (paso === 2) {
			formPaso2.reset({ nuevaClave: "", confirmarClave: "" });
			setShowNueva(false);
			setShowConfirmar(false);
		}
	}, [paso, formPaso2.reset]);

	const manejarCierre = () => {
		alCerrar();
		setTimeout(() => {
			reiniciar();
			formPaso1.reset();
			formPaso2.reset();
			setShowActual(false);
			setShowNueva(false);
			setShowConfirmar(false);
		}, 300);
	};

	const onVerificarPaso1 = async (data: CambiarClavePaso1FormData) => {
		limpiarError();
		await verificarPaso1(data);
	};

	const onActualizarClave = async (data: CambiarClavePaso2FormData) => {
		limpiarError();
		const ok = await actualizarClave(data);
		if (ok) {
			setTimeout(() => {
				manejarCierre();
			}, 2000);
		}
	};

	return (
		<Modal
			abierto={abierto}
			alCerrar={manejarCierre}
			titulo="Cambiar contraseña"
		>
			{exito ? (
				<div className="flex flex-col items-center justify-center py-6 text-center">
					<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
						<ShieldCheck className="h-7 w-7" />
					</div>
					<h4 className="mb-2 text-lg font-semibold text-slate-900 font-heading">
						Contraseña actualizada
					</h4>
					<p className="text-sm text-slate-600">
						Tu contraseña ha sido cambiada exitosamente.
					</p>
				</div>
			) : paso === 1 ? (
				<form
					key="form-paso1"
					onSubmit={formPaso1.handleSubmit(onVerificarPaso1)}
					className="space-y-5"
				>
					<p className="text-sm text-slate-700">
						Por motivos de seguridad, por favor ingresa tu contraseña actual
						para verificar tu identidad.
					</p>

					<div>
						<label
							htmlFor="claveActual"
							className="mb-1.5 block text-sm font-medium text-slate-800"
						>
							Contraseña actual <span className="text-red-500">*</span>
						</label>
						<Input
							id="claveActual"
							type={showActual ? "text" : "password"}
							placeholder="Ingresa tu contraseña actual"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							autoComplete="current-password"
							errorMessage={formPaso1.formState.errors.claveActual?.message}
							{...formPaso1.register("claveActual")}
							rightElement={
								<button
									type="button"
									onClick={() => setShowActual(!showActual)}
									className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
									aria-label={
										showActual ? "Ocultar contraseña" : "Ver contraseña"
									}
								>
									{showActual ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							}
						/>
					</div>

					{errorApi && (
						<Alert
							key="error-paso1"
							variant="error"
							message={errorApi}
							onClose={limpiarError}
						/>
					)}

					<div className="mt-6 flex justify-end gap-3 pt-2">
						<Button
							variant="ghost"
							type="button"
							onClick={manejarCierre}
							disabled={cargando}
						>
							<X size={16} className="mr-1.5" />
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={!formPaso1.formState.isValid || cargando}
						>
							{cargando ? (
								<RefreshCw size={16} className="mr-1.5 animate-spin" />
							) : (
								<CheckCircle2 size={16} className="mr-1.5" />
							)}
							{cargando ? "Verificando..." : "Verificar"}
						</Button>
					</div>
				</form>
			) : (
				<form
					key="form-paso2"
					onSubmit={formPaso2.handleSubmit(onActualizarClave)}
					className="space-y-5"
				>
					<div>
						<label
							htmlFor="nuevaClave"
							className="mb-1.5 block text-sm font-medium text-slate-800"
						>
							Nueva contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="nuevaClave"
							type={showNueva ? "text" : "password"}
							placeholder="Crea tu nueva contraseña"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							autoComplete="new-password"
							errorMessage={formPaso2.formState.errors.nuevaClave?.message}
							{...formPaso2.register("nuevaClave")}
							rightElement={
								<button
									type="button"
									onClick={() => setShowNueva(!showNueva)}
									className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
									aria-label={
										showNueva ? "Ocultar contraseña" : "Ver contraseña"
									}
								>
									{showNueva ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							}
						/>
					</div>

					<div>
						<label
							htmlFor="confirmarClave"
							className="mb-1.5 block text-sm font-medium text-slate-800"
						>
							Confirmar contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="confirmarClave"
							type={showConfirmar ? "text" : "password"}
							placeholder="Confirma la nueva contraseña"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							autoComplete="new-password"
							errorMessage={formPaso2.formState.errors.confirmarClave?.message}
							{...formPaso2.register("confirmarClave")}
							rightElement={
								<button
									type="button"
									onClick={() => setShowConfirmar(!showConfirmar)}
									className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
									aria-label={
										showConfirmar ? "Ocultar contraseña" : "Ver contraseña"
									}
								>
									{showConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							}
						/>
					</div>

					{errorApi && (
						<Alert
							key="error-paso2"
							variant="error"
							message={errorApi}
							onClose={limpiarError}
						/>
					)}

					<div className="mt-6 flex justify-end gap-3 pt-2">
						<Button
							variant="ghost"
							type="button"
							onClick={() => {
								limpiarError();
								setPaso(1);
							}}
							disabled={cargando}
						>
							<ArrowLeft size={16} className="mr-1.5" />
							Atrás
						</Button>
						<Button
							type="submit"
							disabled={!formPaso2.formState.isValid || cargando}
						>
							{cargando ? (
								<RefreshCw size={16} className="mr-1.5 animate-spin" />
							) : (
								<Save size={16} className="mr-1.5" />
							)}
							{cargando ? "Actualizando..." : "Actualizar contraseña"}
						</Button>
					</div>
				</form>
			)}
		</Modal>
	);
}
