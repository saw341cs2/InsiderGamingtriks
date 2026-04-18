import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </>
  );
}

export default App;