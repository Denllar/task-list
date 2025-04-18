import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react(), viteSingleFile()],
  //base: command === "build" ? "/task-list/" : "/",
  base: "/task-list",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true
  }
})
)