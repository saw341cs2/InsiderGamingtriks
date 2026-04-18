import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";

function App() {
  return (
    <>
      <Toaster />

      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;