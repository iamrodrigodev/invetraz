import { Eye, EyeOff } from "lucide-react";
import type React from "react";
import { forwardRef, useState } from "react";
import { Input, type InputProps } from "../../../components/ui/Input";

export interface CampoCredencialProps extends Omit<InputProps, "rightElement"> {
	label: string;
	descripcion?: React.ReactNode;
	obligatorio?: boolean;
	esSensible?: boolean;
}

export const CampoCredencial = forwardRef<
	HTMLInputElement,
	CampoCredencialProps
>(
	(
		{
			id,
			label,
			descripcion,
			obligatorio = true,
			esSensible = false,
			type = "text",
			maxLength,
			showCount = true,
			errorMessage,
			...props
		},
		ref,
	) => {
		const [mostrarTexto, setMostrarTexto] = useState(false);

		const tipoInput = esSensible ? (mostrarTexto ? "text" : "password") : type;

		const elementoDerecho = esSensible ? (
			<button
				type="button"
				onClick={() => setMostrarTexto((prev) => !prev)}
				aria-label={mostrarTexto ? "Ocultar contenido" : "Mostrar contenido"}
				className="cursor-pointer text-primary/70 transition-colors hover:text-primary focus:outline-none"
			>
				{mostrarTexto ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		) : undefined;

		return (
			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<label
						htmlFor={id}
						className="block text-sm font-medium text-slate-700"
					>
						{label} {obligatorio && <span className="text-red-500">*</span>}
					</label>
				</div>

				{descripcion && <p className="text-xs text-slate-500">{descripcion}</p>}

				<Input
					id={id}
					ref={ref}
					type={tipoInput}
					maxLength={maxLength}
					showCount={showCount}
					errorMessage={errorMessage}
					rightElement={elementoDerecho}
					{...props}
				/>
			</div>
		);
	},
);

CampoCredencial.displayName = "CampoCredencial";
