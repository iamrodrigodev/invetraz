import { Search, Settings, User } from "lucide-react";
import { useState } from "react";

export default function App() {
	const [contador, setContador] = useState(0);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-neutral-100">
			<div className="custom-card flex max-w-md flex-col items-center gap-6 border border-neutral-800 bg-neutral-900 p-8 shadow-2xl transition-all">
				<header className="flex items-center gap-4 text-neutral-400">
					<Search className="size-6 cursor-pointer hover:text-white" />
					<User className="size-6 cursor-pointer hover:text-white" />
					<Settings className="size-6 cursor-pointer hover:text-white" />
				</header>

				<h1 className="text-2xl font-bold tracking-tight text-center">
					Sistema de Investigación
				</h1>

				<p className="text-center text-sm text-neutral-400">
					Vite + React 19 + TypeScript + Tailwind CSS 4 + Sass + Lucide + Biome
				</p>

				<button
					type="button"
					onClick={() => setContador((prev) => prev + 1)}
					className="rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-500 active:scale-95"
				>
					Clics: {contador}
				</button>
			</div>
		</main>
	);
}
