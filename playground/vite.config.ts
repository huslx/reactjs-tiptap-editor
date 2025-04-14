import * as path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production'
  const isAnalyze = mode === 'analyze'

  return {
    define: {
      'process.env': {}
    },
    plugins: [
      react(),
    ],
    optimizeDeps: {
      include: ['react'],
    },
    css: {
      devSourcemap: isDev,
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
      sourcemap: isAnalyze,
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }, { find: 'reactjs-tiptap-editor', replacement: 'reactjs-tiptap-editor-pro'}],
    },
    esbuild: {
      sourcemap: isDev,
    },
    server: {
      port: 8000,
    },
    preview: {
      port: 8000,
    },
  }
})
