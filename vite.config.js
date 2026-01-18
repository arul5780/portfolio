import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: Update this based on your deployment
  // For GitHub Pages: use '/repository-name/'
  // For custom domain or Vercel/Netlify: use '/'
  base: '/portfolio/', // GitHub Pages deployment
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  
  server: {
    port: 5173,
    open: true
  },
  
  preview: {
    port: 4173
  }
})