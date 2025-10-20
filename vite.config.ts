import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: "node20",
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "bin/run-textlint.ts"),
      formats: ["es"],
      fileName: () => "run-textlint.js"
    },
    minify: false,
    rollupOptions: {
      external: [
        "textlint",
        "node:fs",
        "node:path",
        "node:url",
        "node:child_process",
        "node:process",
        "node:module"
      ],
      output: {
        format: "esm"
      }
    },
    sourcemap: true
  },
  optimizeDeps: {
    noDiscovery: true
  }
});
