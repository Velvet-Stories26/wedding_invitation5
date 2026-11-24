import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/wedding_invitation5",
  plugins: [viteReact(), tailwindcss(), tsConfigPaths()],
  build: {
    outDir: "dist",
  },
});