import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), svgr()],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "") }],
    },
    server: {
      proxy: {
        "/api/v1/records": "https://www.nslookup.io",
        "/api": env.VITE_APP_API_HOST,
      },
    },
  };
});
