import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, Button, Input, Modal } from "../../../components/ui";
import { VALIDATION_LIMITS } from "../../../constants/validations";

const Paso1Schema = z.object({
	claveActual: z
		.string()
		.min(1, "Ingresa tu contraseÃ±a actual")
		.max(
			VALIDATION_LIMITS.MAX_PASSWORD,
			`La contraseÃ±a no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
		),
});

const Paso2Schema = z
	.object({
		nuevaClave: z
			.string()
			.min(
				VALIDATION_LIMITS.MIN_PASSWORD,
				`La contraseÃ±a debe tener al menos ${VALIDATION_LIMITS.MIN_PASSWORD} caracteres`,
			)
			.max(
				VALIDATION_LIMITS.MAX_PASSWORD,
				`La contraseÃ±a no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
			),
		confirmarClave: z
			.string()
			.min(1, "Confirma tu nueva contraseÃ±a")
			.max(
				VALIDATION_LIMITS.MAX_PASSWORD,
				`La contraseÃ±a no puede exceder los ${VALIDATION_LIMITS.MAX_PASSWORD} caracteres`,
			),
	})
	.refine((data) => data.nuevaClave === data.confirmarClave, {
		message: "Las contraseÃ±as no coinciden",
		path: ["confirmarClave"],
	});

type Paso1Form = z.infer<typeof Paso1Schema>;
type Paso2Form = z.infer<typeof Paso2Schema>;

export interface ModalCambiarClaveProps {
	abierto: boolean;
	alCerrar: () => void;
}

export function ModalCambiarClave({
	abierto,
	alCerrar,
}: ModalCambiarClaveProps) {
	const [paso, setPaso] = useState<1 | 2>(1);
	const [cargando, setCargando] = useState(false);
	const [errorApi, setErrorApi] = useState<string | null>(null);
	const [exito, setExito] = useState(false);

	const formPaso1 = useForm<Paso1Form>({
		resolver: zodResolver(Paso1Schema),
	});

	const formPaso2 = useForm<Paso2Form>({
		resolver: zodResolver(Paso2Schema),
	});

	const manejarCierre = () => {
		alCerrar();
		setTimeout(() => {
			setPaso(1);
			formPaso1.reset();
			formPaso2.reset();
			setErrorApi(null);
			setExito(false);
		}, 300);
	};

	const onVerificarPaso1 = async (_data: Paso1Form) => {
		setCargando(true);
		setErrorApi(null);
		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			setPaso(2);
		} catch (_error) {
			setErrorApi("La contrasena actual es incorrecta");
		} finally {
			setCargando(false);
		}
	};

	const onActualizarClave = async (_data: Paso2Form) => {
		setCargando(true);
		setErrorApi(null);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setExito(true);
			setTimeout(() => {
				manejarCierre();
			}, 2000);
		} catch (_error) {
			setErrorApi("Hubo un error al actualizar la contrasena");
		} finally {
			setCargando(false);
		}
	};

	return (
		<Modal
			abierto={abierto}
			alCerrar={manejarCierre}
			titulo="Cambiar Contrasena"
		>
			{exito ? (
				<div className="flex flex-col items-center justify-center py-6 text-center">
					<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
						<ShieldCheck className="h-7 w-7" />
					</div>
					<h4 className="mb-2 text-lg font-semibold text-slate-900">
						Contrasena Actualizada
					</h4>
					<p className="text-sm text-slate-500">
						Tu contrasena ha sido cambiada exitosamente.
					</p>
				</div>
			) : paso === 1 ? (
				<form
					onSubmit={formPaso1.handleSubmit(onVerificarPaso1)}
					className="space-y-5"
				>
					<p className="text-sm text-slate-600">
						Por motivos de seguridad, por favor ingresa tu contrasena actual
						para verificar tu identidad.
					</p>

					{errorApi && (
						<Alert
							variant="error"
							message={errorApi}
							onClose={() => setErrorApi(null)}
						/>
					)}

					<div>
						<label
							htmlFor="claveActual"
							className="mb-1.5 block text-sm font-medium text-slate-700"
						>
							Contrasena Actual <span className="text-red-500">*</span>
						</label>
						<Input
							id="claveActual"
							type="password"
							placeholder="Ingresa tu contrasena actual"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							showCount
							error={!!formPaso1.formState.errors.claveActual}
							{...formPaso1.register("claveActual")}
						/>
						{formPaso1.formState.errors.claveActual && (
							<p className="mt-2 text-sm text-red-600">
								{formPaso1.formState.errors.claveActual.message}
							</p>
						)}
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
						<Button type="submit" isLoading={cargando}>
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
						<Alert
							variant="error"
							message={errorApi}
							onClose={() => setErrorApi(null)}
						/>
					)}

					<div>
						<label
							htmlFor="nuevaClave"
							className="mb-1.5 block text-sm font-medium text-slate-700"
						>
							Nueva Contrasena <span className="text-red-500">*</span>
						</label>
						<Input
							id="nuevaClave"
							type="password"
							placeholder="Minimo 8 caracteres"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							showCount
							error={!!formPaso2.formState.errors.nuevaClave}
							{...formPaso2.register("nuevaClave")}
						/>
						{formPaso2.formState.errors.nuevaClave && (
							<p className="mt-2 text-sm text-red-600">
								{formPaso2.formState.errors.nuevaClave.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="confirmarClave"
							className="mb-1.5 block text-sm font-medium text-slate-700"
						>
							Confirmar Contrasena <span className="text-red-500">*</span>
						</label>
						<Input
							id="confirmarClave"
							type="password"
							placeholder="Repite la nueva contrasena"
							disabled={cargando}
							maxLength={VALIDATION_LIMITS.MAX_PASSWORD}
							showCount
							error={!!formPaso2.formState.errors.confirmarClave}
							{...formPaso2.register("confirmarClave")}
						/>
						{formPaso2.formState.errors.confirmarClave && (
							<p className="mt-2 text-sm text-red-600">
								{formPaso2.formState.errors.confirmarClave.message}
							</p>
						)}
					</div>

					<div className="mt-6 flex justify-end gap-3 pt-2">
						<Button
							variant="ghost"
							type="button"
							onClick={() => setPaso(1)}
							disabled={cargando}
						>
							Atras
						</Button>
						<Button type="submit" isLoading={cargando}>
							Actualizar Contrasena
						</Button>
					</div>
				</form>
			)}
		</Modal>
	);
}
