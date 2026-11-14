import { defineConfig } from "electron-vite";

export default defineConfig({
  main: {},
  // CommonJS preload (sandboxed preloads can't be ES modules)
  preload: { build: { rolldownOptions: { output: { format: "cjs" } } } },
});
