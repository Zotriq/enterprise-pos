import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the demo from /enterprise-pos/
  base: process.env.VITE_BASE ?? '/',
})
