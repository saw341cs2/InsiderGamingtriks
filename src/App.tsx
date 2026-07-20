import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppProvider } from "@/contexts/AppContext";
import Index from "@/pages/Index";
import NewsPage from "@/pages/NewsPage";
import ArchivesPage from "@/pages/ArchivesPage";
import ForumPage from "@/pages/Forum";
import ProfilePage from "@/pages/Profile";
import AimRush from "@/pages/AimRush";
import Classement from "@/pages/Classement";
import AstucesPage from "@/pages/Astuces";
import VideosPage from "@/pages/Videos";
import CommunautePage from "@/pages/Communaute";
import MembresPage from "@/pages/Membres";
import PremiumPage from "@/pages/Premium";
import { useState, useEffect } from "react";
function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      backgroundImage: "url('/splash.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <h1 style={{
        color: "white",
        fontSize: "2.5rem",
        fontWeight: "bold",
        textShadow: "0 0 20px red",
        marginBottom: "2rem",
        letterSpacing: "0.1em",
      }}>
        InsiderGamingTricks
      </h1>
      <div style={{
        width: "300px",
        height: "6px",
        backgroundColor: "white",
        borderRadius: "3px",
        overflow: "hidden",
        opacity: 0.3,
      }}>
        <div style={{
          height: "100%",
          width: progress + "%",
          backgroundColor: "red",
          borderRadius: "3px",
        }} />
      </div>
      <p style={{
        color: "white",
        marginTop: "1rem",
        fontSize: "0.9rem",
        opacity: 0.6,
      }}>
        Chargement...
      </p>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <AppProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/astuces" element={<AstucesPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/communaute" element={<CommunautePage />} />
        <Route path="/membres" element={<MembresPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/archives" element={<ArchivesPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/aimrush" element={<AimRush />} />
        <Route path="/classement" element={<Classement />} />
      </Routes>
    </AppProvider>
  );
}

export default App;