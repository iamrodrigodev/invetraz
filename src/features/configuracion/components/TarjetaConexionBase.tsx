import { RefreshCw, Save } from "lucide-react";
import type React from "react";
import {
	Alert,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../../components/ui";
import {
	EstadoConexionBadge,
	type TipoEstadoConexion,
} from "./EstadoConexionBadge";

export interface TarjetaConexionBaseProps {
	titulo: string;
	descripcion: string;
	icono: React.ComponentType<{ size?: number; className?: string }>;
	estado: TipoEstadoConexion;
	mensajeExito?: string | null | undefined;
	mensajeError?: string | null | undefined;
	onLimpiarExito?: (() => void) | undefined;
	onLimpiarError?: (() => void) | undefined;
	verificando?: boolean | undefined;
	guardando?: boolean | undefined;
	deshabilitarVerificar?: boolean | undefined;
	deshabilitarGuardar?: boolean | undefined;
	tooltipVerificar?: string | undefined;
	tooltipGuardar?: string | undefined;
	textoVerificar?: string | undefined;
	textoGuardar?: string | undefined;
	onVerificar?: (() => void) | undefined;
	onGuardar?: ((e?: React.FormEvent) => void) | undefined;
	esFormulario?: boolean | undefined;
	onSubmit?: ((e: React.FormEvent) => void) | undefined;
	cabeceraExtra?: React.ReactNode;
	children: React.ReactNode;
}

export const TarjetaConexionBase: React.FC<TarjetaConexionBaseProps> = ({
	titulo,
	descripcion,
	icono: Icono,
	estado,
	mensajeExito,
	mensajeError,
	onLimpiarExito,
	onLimpiarError,
	verificando = false,
	guardando = false,
	deshabilitarVerificar = false,
	deshabilitarGuardar = false,
	tooltipVerificar,
	tooltipGuardar,
	textoVerificar = "Verificar Conexión",
	textoGuardar = "Guardar Configuración",
	onVerificar,
	onGuardar,
	esFormulario = false,
	onSubmit,
	cabeceraExtra,
	children,
}) => {
	const renderBotones = () => (
		<div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
			<Button
				type="button"
				variant="outline"
				onClick={onVerificar}
				disabled={deshabilitarVerificar}
				className="w-full sm:w-auto"
				title={tooltipVerificar}
			>
				<RefreshCw
					size={16}
					className={`mr-2 ${verificando ? "animate-spin text-primary" : ""}`}
				/>
				{verificando ? "Verificando..." : textoVerificar}
			</Button>

			<Button
				type={esFormulario ? "submit" : "button"}
				variant="default"
				onClick={esFormulario ? undefined : onGuardar}
				disabled={deshabilitarGuardar}
				className="w-full sm:w-auto"
				title={tooltipGuardar}
			>
				{guardando ? (
					<RefreshCw size={16} className="mr-2 animate-spin" />
				) : (
					<Save size={16} className="mr-2" />
				)}
				{guardando ? "Verificando y guardando..." : textoGuardar}
			</Button>
		</div>
	);

	return (
		<Card className="flex flex-col h-full">
			<CardHeader>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
							<Icono size={18} className="text-primary shrink-0" />
							<span>{titulo}</span>
						</CardTitle>
						<CardDescription>{descripcion}</CardDescription>
					</div>
					<EstadoConexionBadge estado={estado} />
				</div>
			</CardHeader>

			<CardContent className="flex flex-col flex-1 space-y-5">
				{mensajeExito && (
					<Alert
						variant="success"
						message={mensajeExito}
						{...(onLimpiarExito ? { onClose: onLimpiarExito } : {})}
					/>
				)}

				{mensajeError && (
					<Alert
						variant="error"
						message={mensajeError}
						{...(onLimpiarError ? { onClose: onLimpiarError } : {})}
					/>
				)}

				{cabeceraExtra}

				{esFormulario ? (
					<form
						onSubmit={onSubmit}
						className="flex flex-col flex-1 justify-between space-y-5"
					>
						<div className="space-y-5">{children}</div>
						{renderBotones()}
					</form>
				) : (
					<div className="flex flex-col flex-1 justify-between space-y-5">
						<div className="space-y-5">{children}</div>
						{renderBotones()}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default TarjetaConexionBase;
