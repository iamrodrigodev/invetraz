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
				"flex items-center select-none overflow-hidden font-bold text-slate-900 text-lg tracking-tight",
				estaColapsado ? "justify-center w-full" : "w-full",
				className,
			)}
		>
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
				<Microscope className="h-5 w-5 text-primary" strokeWidth={2.2} />
			</div>
			<div
				className={cn(
					"flex items-center whitespace-nowrap transition-all duration-300 ease-in-out font-heading",
					estaColapsado
						? "ml-0 w-0 overflow-hidden opacity-0"
						: "ml-3 w-auto opacity-100",
				)}
			>
				<span className="text-slate-900">
					GCC <span className="text-primary font-bold">Investigación</span>
				</span>
			</div>
		</div>
	);
}
