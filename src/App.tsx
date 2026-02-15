
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect && redirect !== '/InsiderGamingtriks/') {
      sessionStorage.removeItem('redirect');
      navigate(redirect, { replace: true });
    }
  }, [navigate]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/InsiderGamingtriks">
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
import React from 'react';
import banner from '../assets/Banner.png'; // Chemin relatif vers ton image

function App() {
  return (
    <div className="App">
      <img src={banner} alt="Bannière Insider Gaming Tricks" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
      {/* Le reste de ton site */}
    </div>
  );
}


import React from 'react';
import banner from '../Banner.png'; // ✅ Chemin corrigé

function App() {
  return (
    <div className="App">
      <img src={banner} alt="Bannière Insider Gaming Tricks" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
      {/* Le reste de ton site */}
    </div>
  );
}

export default App;