import { AlertCircle, Check, LogOut, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/Button.tsx";
import { Modal } from "@/components/ui/Modal.tsx";

export type PropsModalConfirmacion = {
	abierto: boolean;
	titulo: string;
	descripcion: string;
	textoConfirmar?: string;
	textoCancelar?: string;
	cargando?: boolean;
	varianteBoton?: "destructivo" | "primario";
	alConfirmar: () => void;
	alCerrar: () => void;
};

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
			className="relative max-w-sm p-5 text-center sm:p-6"
		>
			<button
				type="button"
				onClick={alCerrar}
				disabled={cargando}
				aria-label="Cerrar modal"
				className="absolute top-3 right-3 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-slate-500 opacity-70 outline-none transition-all hover:bg-black/5 hover:text-slate-800 hover:opacity-100 active:scale-95 disabled:pointer-events-none sm:top-4 sm:right-4"
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
					<h3 className="text-center font-bold font-heading text-slate-900 text-xl">{titulo}</h3>
					<p className="mt-2 text-center text-[15px] text-slate-600 leading-relaxed">
						{descripcion}
					</p>
				</div>
			</div>

			<div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-col">
				<Button
					type="button"
					variant={varianteBoton === "destructivo" ? "destructive" : "default"}
					onClick={alConfirmar}
					disabled={cargando}
					className="min-h-11 w-full rounded-xl font-semibold text-[15px] shadow-sm active:scale-98"
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
					className="min-h-11 w-full rounded-xl font-medium text-[15px] text-slate-600 hover:bg-slate-100 active:scale-98"
					size="lg"
				>
					<X size={18} className="mr-2" />
					{textoCancelar}
				</Button>
			</div>
		</Modal>
	);
}
