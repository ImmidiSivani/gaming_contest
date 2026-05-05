import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["monaco-editor"],
  },
  server: {
  proxy: {
    "/api": "http://localhost:5000",
    "/socket.io": {
      target: "http://localhost:5000",
      ws: true,
    },
  },
},
})
