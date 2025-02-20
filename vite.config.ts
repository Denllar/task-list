import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  // base: command === "build" ? "/task-list/" : "/",
  base: "/task-list",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
)