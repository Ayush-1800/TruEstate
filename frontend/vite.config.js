import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Dynamic API URL
  const API_URL =
    mode === "development"
      ? "http://localhost:4000/api" // local backend
      : process.env.VITE_API_URL;   // Render backend

  return {
    plugins: [react()],

    // Expose API URL to frontend
    define: {
      "process.env.VITE_API_URL": JSON.stringify(API_URL),
    },

    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
