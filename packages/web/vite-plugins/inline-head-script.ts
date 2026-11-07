import { build } from "vite";
import type { Plugin } from "vite";

async function bundleToIife(entry: string) {
  const result = await build({
    configFile: false,
    logLevel: "silent",
    resolve: { tsconfigPaths: true },
    build: {
      write: false,
      copyPublicDir: false,
      rolldownOptions: { input: entry, output: { format: "iife" } },
    },
  });
  if (Array.isArray(result) || !("output" in result)) {
    throw new Error(`Expected a single bundle for ${entry}`);
  }
  return result.output[0].code;
}

// Script file bundled and inlined into <head> (runs before first paint)
export function inlineHeadScript(entry: string): Plugin {
  return {
    name: "inline-head-script",
    transformIndexHtml: async () => [
      { tag: "script", children: await bundleToIife(entry), injectTo: "head" },
    ],
  };
}
