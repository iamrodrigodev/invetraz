import { AlertCircle, X } from "lucide-react";
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
				className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-90 cursor-pointer disabled:pointer-events-none"
			>
				<X className="h-5 w-5" />
			</button>

			<div className="flex flex-col items-center justify-center gap-3 pt-2">
				<div
					className={
						varianteBoton === "destructivo"
							? "flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500"
							: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"
					}
				>
					<AlertCircle
						className="h-8 w-8"
						strokeWidth={1.8}
						aria-hidden="true"
					/>
				</div>

				<div>
					<h3 className="font-heading font-bold text-slate-900 text-xl">
						{titulo}
					</h3>
					<p className="mt-2 text-[15px] text-slate-500 leading-relaxed">
						{descripcion}
					</p>
				</div>
			</div>

			<div className="mt-7 flex flex-col gap-2.5">
				<Button
					type="button"
					variant={varianteBoton === "destructivo" ? "destructive" : "default"}
					onClick={alConfirmar}
					isLoading={cargando}
					className="h-11 w-full rounded-xl font-semibold text-[15px] shadow-sm active:scale-98"
					size="lg"
				>
					{textoConfirmar}
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={alCerrar}
					disabled={cargando}
					className="h-11 w-full rounded-xl font-medium text-[15px] text-slate-600 hover:bg-slate-100 active:scale-98"
					size="lg"
				>
					{textoCancelar}
				</Button>
			</div>
		</Modal>
	);
}
