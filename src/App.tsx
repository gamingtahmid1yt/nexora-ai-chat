import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("@/components/LoginPage").then(module => ({ default: module.LoginPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (new name for cacheTime)
    },
  },
});

function AppContent() {
  const [showLoading, setShowLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Reduced loading time for better perceived performance
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  if (authLoading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!isAuthenticated && showLogin) {
    return (
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <LoginPage 
          onLogin={() => {}} 
          onSkip={() => setShowLogin(false)} 
        />
      </Suspense>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen onComplete={() => {}} />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const App = () => {
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