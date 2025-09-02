import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LoginPage } from "@/components/LoginPage";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const [showLoading, setShowLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Show loading screen for 500ms
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  if (authLoading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!isAuthenticated && showLogin) {
    return <LoginPage onLogin={() => {}} onSkip={() => setShowLogin(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
