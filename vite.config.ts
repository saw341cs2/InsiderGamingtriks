import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-news-json',
      closeBundle() {
        const src = path.resolve(__dirname, 'public/news.json');
        const dest = path.resolve(__dirname, 'docs/news.json');
        fs.copyFileSync(src, dest);
        console.log('Copied news.json to docs folder');
      }
    }
  ],
  build: {
    outDir: "docs"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
