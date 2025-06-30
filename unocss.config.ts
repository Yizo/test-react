import { defineConfig, presetAttributify } from "unocss";
import presetMini from "@unocss/preset-mini";

export default async ({ mode }) => {
	return defineConfig({
		presets: [presetAttributify(), presetMini()],
	});
};
