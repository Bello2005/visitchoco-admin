import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  // Permite servir el admin bajo un subpath (ej. ADMIN_BASE=/admin/ en producción)
  base: process.env.ADMIN_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
