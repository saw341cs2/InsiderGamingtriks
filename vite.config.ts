import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

export default defineConfig({
  base: '/InsiderGamingtriks/',
  plugins: [
    react(),
    {
      name: 'copy-nojekyll',
      closeBundle() {
        const docsDir = path.resolve(__dirname, 'docs');
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }
        const nojekyll = path.resolve(__dirname, 'docs/.nojekyll');
        fs.writeFileSync(nojekyll, '');
        console.log('Created .nojekyll in docs folder');
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
