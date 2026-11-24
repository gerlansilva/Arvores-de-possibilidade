import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri espera uma porta fixa e não deve limpar a tela do terminal.
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: { port: 1420, strictPort: true },
  envPrefix: ["VITE_", "TAURI_"],
  build: { target: "safari15", sourcemap: false },
});
