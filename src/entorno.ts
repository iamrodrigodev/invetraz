import { z } from "zod";

const EntornoSchema = z.object({
	VITE_API_BASE_URL: z.string().default("/api/v1"),
	DEV: z.boolean().default(false),
	PROD: z.boolean().default(true),
});

export const entorno = EntornoSchema.parse({
	VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
	DEV: import.meta.env.DEV,
	PROD: import.meta.env.PROD,
});
