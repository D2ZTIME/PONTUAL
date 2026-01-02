import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Usar base relativa para facilitar o deploy em subpastas ou root
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
