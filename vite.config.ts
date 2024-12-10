import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    global: {},
  },
  resolve: {
    alias: {
      "@icon": path.resolve(__dirname, "./src/assets/icon"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@reducers": path.resolve(__dirname, "./src/reducers"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
