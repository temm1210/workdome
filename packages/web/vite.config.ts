import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

import { inlineHeadScript } from "./vite-plugins/inline-head-script";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    inlineHeadScript(
      fileURLToPath(
        new URL("./src/head-scripts/color-mode.ts", import.meta.url),
      ),
    ),
  ],
  resolve: { tsconfigPaths: true },
  server: {
    proxy: { "/api": "http://127.0.0.1:4310" },
  },
});
