import { CheckCircle2 } from "lucide-react";
import type React from "react";
import { Button, Modal } from "../../../components/ui";

export interface ModalExitoGeneracionProps {
	abierto: boolean;
	alAceptar: () => void;
}

export const ModalExitoGeneracion: React.FC<ModalExitoGeneracionProps> = ({
	abierto,
	alAceptar,
}) => {
	return (
		<Modal
			abierto={abierto}
			alCerrar={alAceptar}
			className="relative max-w-sm p-6 text-center"
		>
			<div className="flex flex-col items-center justify-center gap-3 pt-2 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
					<CheckCircle2 size={36} strokeWidth={2} />
				</div>

				<div className="text-center">
					<h3 className="font-heading font-bold text-slate-900 text-xl">
						Actividad de seguimiento generada
					</h3>
					<p className="mt-2 text-sm text-slate-600 leading-relaxed">
						¡Actividad de seguimiento generada con éxito!
					</p>
				</div>
			</div>

			<div className="mt-6">
				<Button
					type="button"
					variant="default"
					onClick={alAceptar}
					className="h-11 w-full rounded-xl font-semibold text-[15px] shadow-sm active:scale-98"
					size="lg"
				>
					Aceptar
				</Button>
			</div>
		</Modal>
	);
};

export default ModalExitoGeneracion;
