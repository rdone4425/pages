import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': './src'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://shuqian.ferr01.workers.dev'
      }
    }
  }
}) 