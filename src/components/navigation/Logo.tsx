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
				"flex items-center select-none font-bold text-slate-900 text-base tracking-tight w-full",
				className,
			)}
		>
			<div className="flex h-11 w-11 shrink-0 items-center justify-center">
				<Microscope className="h-6 w-6 text-primary" strokeWidth={2.2} />
			</div>
			<div
				className={cn(
					"flex items-center whitespace-nowrap transition-all duration-300 ease-in-out font-heading overflow-hidden",
					estaColapsado
						? "ml-0 max-w-0 opacity-0"
						: "ml-1.5 max-w-xs opacity-100",
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
