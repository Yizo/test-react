import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import type { UserConfigExport, ConfigEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async ({ mode }: ConfigEnv): Promise<UserConfigExport> => {
	console.log("mode", mode);
	const env = loadEnv(mode, process.cwd());
	console.log("当前环境变量：", env);

	return defineConfig({
		base: env.VITE_BASE_URL || "/",
		plugins: [UnoCSS(), react()],
		resolve: {
			alias: {
				"@": resolve(__dirname, "src"),
			},
		},
	});
};
