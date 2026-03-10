import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import Index from './pages/Index.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<HashRouter><Index /></HashRouter>);
