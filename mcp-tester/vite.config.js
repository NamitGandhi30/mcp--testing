import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios']
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'axios': 'node_modules/axios/dist/axios.min.js'
    }
  }
})
