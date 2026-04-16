import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" attribute="class" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/InsiderGamingtriks">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Index />} />
                <Route path="*" element={<Index />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;