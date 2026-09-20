import { AlertCircle, Check, LogOut, RefreshCw, X } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

export interface PropsModalConfirmacion {
	abierto: boolean;
	titulo: string;
	descripcion: string;
	textoConfirmar?: string;
	textoCancelar?: string;
	cargando?: boolean;
	varianteBoton?: "destructivo" | "primario";
	alConfirmar: () => void;
	alCerrar: () => void;
}

export type ModalConfirmacionProps = PropsModalConfirmacion;

export function ModalConfirmacion({
	abierto,
	titulo,
	descripcion,
	textoConfirmar = "Confirmar",
	textoCancelar = "Cancelar",
	cargando = false,
	varianteBoton = "destructivo",
	alConfirmar,
	alCerrar,
}: PropsModalConfirmacion) {
	return (
		<Modal
			abierto={abierto}
			alCerrar={alCerrar}
			className="relative max-w-sm p-6 text-center"
		>
			<button
				type="button"
				onClick={alCerrar}
				disabled={cargando}
				aria-label="Cerrar modal"
				className="absolute top-4 right-4 inline-flex cursor-pointer rounded-md p-0.5 text-slate-500 opacity-70 transition-all hover:opacity-100 hover:bg-black/5 hover:text-slate-800 active:scale-95 outline-none disabled:pointer-events-none"
			>
				<X size={18} />
			</button>

			<div className="flex flex-col items-center justify-center gap-3 pt-2 text-center">
				<AlertCircle
					className={
						varianteBoton === "destructivo"
							? "mb-1 h-14 w-14 text-red-600"
							: "mb-1 h-14 w-14 text-primary"
					}
					strokeWidth={1.5}
					aria-hidden="true"
				/>

				<div className="text-center">
					<h3 className="font-heading font-bold text-slate-900 text-xl text-center">
						{titulo}
					</h3>
					<p className="mt-2 text-[15px] text-slate-600 leading-relaxed text-center">
						{descripcion}
					</p>
				</div>
			</div>

			<div className="mt-7 flex flex-col gap-2.5">
				<Button
					type="button"
					variant={varianteBoton === "destructivo" ? "destructive" : "default"}
					onClick={alConfirmar}
					disabled={cargando}
					className="h-11 w-full rounded-xl font-semibold text-[15px] shadow-sm active:scale-98"
					size="lg"
				>
					{cargando ? (
						<>
							<RefreshCw size={18} className="mr-2 animate-spin" />
							Cargando...
						</>
					) : (
						<>
							{varianteBoton === "destructivo" ? (
								<LogOut size={18} className="mr-2" />
							) : (
								<Check size={18} className="mr-2" />
							)}
							{textoConfirmar}
						</>
					)}
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={alCerrar}
					disabled={cargando}
					className="h-11 w-full rounded-xl font-medium text-[15px] text-slate-600 hover:bg-slate-100 active:scale-98"
					size="lg"
				>
					<X size={18} className="mr-2" />
					{textoCancelar}
				</Button>
			</div>
		</Modal>
	);
}
