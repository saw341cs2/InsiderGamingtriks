import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

// https://vitejs.dev/config/
export default defineConfig({
  base: '/InsiderGamingtriks/',
  plugins: [
    react(),
    {
      name: 'copy-nojekyll',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
        const nojekyll = path.resolve(__dirname, 'dist/.nojekyll');
        fs.writeFileSync(nojekyll, '');
        console.log('Created .nojekyll in dist folder');
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
