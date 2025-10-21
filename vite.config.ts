import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    target: "node20",
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
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
      input: {
        "run-textlint": path.resolve(__dirname, "src/bin/run-textlint.ts"),
        "setup-npmignore": path.resolve(__dirname, "src/scripts/setup-npmignore.ts")
      },
      output: [
        {
          entryFileNames: "dist/[name].js",
          format: "esm"
        },
        {
          entryFileNames: "scripts/[name].js",
          format: "esm"
        }
      ]
    }
  },
  optimizeDeps: {
    noDiscovery: true
  }
});
