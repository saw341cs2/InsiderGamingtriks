import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-nojekyll',
      closeBundle() {
        const nojekyll = path.resolve(__dirname, 'dist/.nojekyll');
        fs.writeFileSync(nojekyll, '');
        console.log('Created .nojekyll in dist folder');
      }
    }
  ],
  build: {
    outDir: "dist"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})
