import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    outDir: "../build",
  },
});
