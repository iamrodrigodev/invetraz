import { Microscope } from "lucide-react";
import { cn } from "../../utils/cn";

export interface LogoProps {
	estaColapsado?: boolean;
	className?: string;
}

export function Logo({ estaColapsado = false, className }: LogoProps) {
	return (
		<div
			className={cn(
				"flex items-center select-none overflow-hidden font-bold text-slate-900 text-base tracking-tight",
				estaColapsado ? "justify-center w-full" : "w-full",
				className,
			)}
		>
			<Microscope className="h-6 w-6 shrink-0 text-primary" strokeWidth={2.2} />
			<div
				className={cn(
					"flex items-center whitespace-nowrap transition-all duration-300 ease-in-out font-heading",
					estaColapsado
						? "ml-0 w-0 overflow-hidden opacity-0"
						: "ml-2.5 w-auto opacity-100",
				)}
			>
				<span className="text-slate-900">
					Sistema de{" "}
					<span className="text-primary font-bold">Investigación</span>
				</span>
			</div>
		</div>
	);
}
