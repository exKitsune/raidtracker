import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/raidtracker/",
  plugins: [svelte({
      preprocess: preprocess(),
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
})
