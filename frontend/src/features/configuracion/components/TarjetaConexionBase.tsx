import { RefreshCw, Save } from "lucide-react";
import type React from "react";
import { Alert } from "@/components/ui/Alert.tsx";
import { Button } from "@/components/ui/Button.tsx";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card.tsx";
import {
	EstadoConexionBadge,
	type TipoEstadoConexion,
} from "@/features/configuracion/components/EstadoConexionBadge.tsx";

export type TarjetaConexionBaseProps = {
	titulo: string;
	descripcion: string;
	icono: React.ComponentType<{ size?: number; className?: string }>;
	estado: TipoEstadoConexion;
	mensajeExito?: string | null | undefined;
	varianteMensajeExito?: "success" | "warning" | undefined;
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
	onGuardar?: ((e?: React.SyntheticEvent) => void) | undefined;
	esFormulario?: boolean | undefined;
	onSubmit?: ((e: React.SyntheticEvent) => void) | undefined;
	cabeceraExtra?: React.ReactNode;
	children: React.ReactNode;
};

export const TarjetaConexionBase: React.FC<TarjetaConexionBaseProps> = ({
	titulo,
	descripcion,
	icono: Icono,
	estado,
	mensajeExito,
	varianteMensajeExito = "success",
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
		<div className="flex flex-col-reverse gap-2.5 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
			<Button
				type="button"
				variant="outline"
				onClick={onVerificar}
				disabled={deshabilitarVerificar}
				className="min-h-11 w-full sm:w-auto"
				title={tooltipVerificar}
			>
				<RefreshCw size={16} className={`mr-2 ${verificando ? "animate-spin text-primary" : ""}`} />
				{verificando ? "Verificando..." : textoVerificar}
			</Button>

			<Button
				type={esFormulario ? "submit" : "button"}
				variant="default"
				onClick={esFormulario ? undefined : onGuardar}
				disabled={deshabilitarGuardar}
				className="min-h-11 w-full sm:w-auto"
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
		<Card className="flex h-full flex-col">
			<CardHeader className="space-y-2 p-5 pb-4 sm:p-6 sm:pb-4">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<CardTitle className="flex items-center gap-2 font-bold text-base text-slate-900 sm:text-lg">
						<Icono size={19} className="shrink-0 text-primary" />
						<span>{titulo}</span>
					</CardTitle>
					<EstadoConexionBadge estado={estado} className="shrink-0 self-start sm:self-auto" />
				</div>
				<CardDescription className="text-slate-600 text-xs leading-relaxed">
					{descripcion}
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col space-y-5 p-5 pt-0 sm:p-6 sm:pt-0">
				{mensajeExito && (
					<Alert
						variant={varianteMensajeExito}
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
					<form onSubmit={onSubmit} className="flex flex-1 flex-col justify-between space-y-5">
						<div className="space-y-5">{children}</div>
						{renderBotones()}
					</form>
				) : (
					<div className="flex flex-1 flex-col justify-between space-y-5">
						<div className="space-y-5">{children}</div>
						{renderBotones()}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default TarjetaConexionBase;
