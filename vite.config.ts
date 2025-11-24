import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/json5tojsx/',
  plugins: [react()],
  optimizeDeps: {
    include: ['jsonx'],
    esbuildOptions: {
      mainFields: ['main', 'module'],
    }
  },
  resolve: {
    alias: {
      // Force jsonx to use CJS build
      'jsonx': 'jsonx/dist/index.cjs.js'
    }
  },
  build: {
    commonjsOptions: {
      include: [/jsonx/, /node_modules/],
      transformMixedEsModules: true,
    }
  }
})
