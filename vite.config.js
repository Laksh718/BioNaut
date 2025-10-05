import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL || "https://summarizer-model.onrender.com"
    ),
    "import.meta.env.VITE_GEMINI_API_KEY": JSON.stringify(
      process.env.VITE_GEMINI_API_KEY || ""
    ),
    "import.meta.env.VITE_SUMMARIZER_API_URL": JSON.stringify(
      process.env.VITE_SUMMARIZER_API_URL ||
        "https://summarizer-model.onrender.com"
    ),
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api/summarizer": {
        target: "https://summarizer-model.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/summarizer/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
