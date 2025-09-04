import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LoginPage } from "@/components/LoginPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Enhanced error logging
console.log('App.tsx: Loading application components');

const queryClient = new QueryClient();

function AppContent() {
  const [showLoading, setShowLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log('AppContent: Initializing with auth state:', { isAuthenticated, authLoading });
    
    // Show loading screen for 300ms (reduced for faster load)
    const timer = setTimeout(() => {
      console.log('AppContent: Loading timer complete, hiding loading screen');
      setShowLoading(false);
    }, 300);

    return () => {
      console.log('AppContent: Cleaning up loading timer');
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.log('AppContent: Auth state changed:', { isAuthenticated, authLoading });
  }, [isAuthenticated, authLoading]);

  if (showLoading) {
    console.log('AppContent: Showing loading screen');
    return <LoadingScreen onComplete={() => {
      console.log('AppContent: Loading screen complete callback');
      setShowLoading(false);
    }} />;
  }

  if (authLoading) {
    console.log('AppContent: Showing auth loading screen');
    return <LoadingScreen onComplete={() => {
      console.log('AppContent: Auth loading complete callback');
    }} />;
  }

  if (!isAuthenticated && showLogin) {
    console.log('AppContent: Showing login page');
    return <LoginPage 
      onLogin={() => {
        console.log('AppContent: Login successful');
      }} 
      onSkip={() => {
        console.log('AppContent: Login skipped');
        setShowLogin(false);
      }} 
    />;
  }

  console.log('AppContent: Rendering main application');

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

const App = () => {
  console.log('App: Rendering root component');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;