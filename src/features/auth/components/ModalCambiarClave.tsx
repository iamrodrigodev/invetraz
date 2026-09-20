import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
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

	const formPaso1 = useForm<CambiarClavePaso1FormData>({
		resolver: zodResolver(CambiarClavePaso1Schema),
		mode: "onChange",
	});

	const formPaso2 = useForm<CambiarClavePaso2FormData>({
		resolver: zodResolver(CambiarClavePaso2Schema),
		mode: "onChange",
	});

	const manejarCierre = () => {
		alCerrar();
		setTimeout(() => {
			reiniciar();
			formPaso1.reset();
			formPaso2.reset();
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
					<p className="text-sm text-slate-500">
						Tu contraseña ha sido cambiada exitosamente.
					</p>
				</div>
			) : paso === 1 ? (
				<form
					onSubmit={formPaso1.handleSubmit(onVerificarPaso1)}
					className="space-y-5"
				>
					<p className="text-sm text-slate-600">
						Por motivos de seguridad, por favor ingresa tu contraseña actual
						para verificar tu identidad.
					</p>

					{errorApi && (
						<Alert variant="error" message={errorApi} onClose={limpiarError} />
					)}

					<div>
						<label
							htmlFor="claveActual"
							className="mb-1.5 block text-sm font-medium text-slate-700"
						>
							Contraseña actual <span className="text-red-500">*</span>
						</label>
						<Input
							id="claveActual"
							type="password"
							placeholder="Ingresa tu contraseña actual"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							errorMessage={formPaso1.formState.errors.claveActual?.message}
							{...formPaso1.register("claveActual")}
						/>
					</div>

					<div className="mt-6 flex justify-end gap-3 pt-2">
						<Button
							variant="ghost"
							type="button"
							onClick={manejarCierre}
							disabled={cargando}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={!formPaso1.formState.isValid || cargando}
							isLoading={cargando}
						>
							Verificar
						</Button>
					</div>
				</form>
			) : (
				<form
					onSubmit={formPaso2.handleSubmit(onActualizarClave)}
					className="space-y-5"
				>
					{errorApi && (
						<Alert variant="error" message={errorApi} onClose={limpiarError} />
					)}

					<div>
						<label
							htmlFor="nuevaClave"
							className="mb-1.5 block text-sm font-medium text-slate-700"
						>
							Nueva contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="nuevaClave"
							type="password"
							placeholder="Crea tu nueva contraseña"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							errorMessage={formPaso2.formState.errors.nuevaClave?.message}
							{...formPaso2.register("nuevaClave")}
						/>
					</div>

					<div>
						<label
							htmlFor="confirmarClave"
							className="mb-1.5 block text-sm font-medium text-slate-700"
						>
							Confirmar contraseña <span className="text-red-500">*</span>
						</label>
						<Input
							id="confirmarClave"
							type="password"
							placeholder="Confirma la nueva contraseña"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							errorMessage={formPaso2.formState.errors.confirmarClave?.message}
							{...formPaso2.register("confirmarClave")}
						/>
					</div>

					<div className="mt-6 flex justify-end gap-3 pt-2">
						<Button
							variant="ghost"
							type="button"
							onClick={() => setPaso(1)}
							disabled={cargando}
						>
							Atrás
						</Button>
						<Button
							type="submit"
							disabled={!formPaso2.formState.isValid || cargando}
							isLoading={cargando}
						>
							Actualizar contraseña
						</Button>
					</div>
				</form>
			)}
		</Modal>
	);
}
