import { Microscope } from "lucide-react";
import { cn } from "@/utils/cn.ts";

export interface LogoProps {
	estaColapsado?: boolean;
	className?: string;
}

export function Logo({ estaColapsado = false, className }: LogoProps) {
	return (
		<div
			className={cn(
				"flex min-w-0 select-none items-center font-bold text-base text-slate-900 tracking-tight",
				className,
			)}
		>
			<div className="flex h-11 w-11 shrink-0 items-center justify-center">
				<Microscope className="h-6 w-6 text-primary" strokeWidth={2.2} />
			</div>
			<div
				className={cn(
					"flex items-center overflow-hidden whitespace-nowrap font-heading transition-[margin,max-width,opacity] duration-300 ease-in-out",
					estaColapsado ? "ml-0 max-w-0 opacity-0" : "ml-1.5 max-w-xs opacity-100",
				)}
			>
				<span className="text-slate-900">
					Sistema de <span className="font-bold text-primary">Investigación</span>
				</span>
			</div>
		</div>
	);
}
