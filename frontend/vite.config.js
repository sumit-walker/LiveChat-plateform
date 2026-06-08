import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import daisyui from 'daisyui'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        plugins: [daisyui],
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:1000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://127.0.0.1:1000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
})

