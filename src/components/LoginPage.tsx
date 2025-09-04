import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface LoginPageProps {
  onLogin: () => void;
  onSkip?: () => void;
}

declare global {
  interface Window {
    googleLogin: () => void;
    googleLogout: () => void;
  }
}

export function LoginPage({ onLogin, onSkip }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load Firebase script
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      // Import Firebase SDKs
      import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
      import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
        from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

      // Your Firebase Config
      const firebaseConfig = {
        apiKey: "AIzaSyCEJcoBHBxl2UY-1eFURduX3h5M2bAP-Gc",
        authDomain: "nexora-ai-cabb7.firebaseapp.com",
        projectId: "nexora-ai-cabb7",
        storageBucket: "nexora-ai-cabb7.firebasestorage.app",
        messagingSenderId: "709302061659",
        appId: "1:709302061659:web:ddab826758da672ded4d7e"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      // Login function
      window.googleLogin = function() {
        signInWithPopup(auth, provider)
          .then((result) => {
            const user = result.user;
            localStorage.setItem('nexora_user', JSON.stringify({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            }));
            window.dispatchEvent(new CustomEvent('nexora_login_success'));
          })
          .catch((error) => {
            console.error(error);
            window.dispatchEvent(new CustomEvent('nexora_login_error', { detail: error.message }));
          });
      };

      // Logout function
      window.googleLogout = function() {
        signOut(auth).then(() => {
          localStorage.removeItem('nexora_user');
          window.dispatchEvent(new CustomEvent('nexora_logout_success'));
        }).catch((error) => {
          console.error(error);
        });
      };

      // Auto-detect login status
      onAuthStateChanged(auth, (user) => {
        if (user) {
          localStorage.setItem('nexora_user', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          }));
          window.dispatchEvent(new CustomEvent('nexora_auth_ready', { detail: { loggedIn: true } }));
        } else {
          localStorage.removeItem('nexora_user');
          window.dispatchEvent(new CustomEvent('nexora_auth_ready', { detail: { loggedIn: false } }));
        }
      });

      window.dispatchEvent(new CustomEvent('nexora_firebase_loaded'));
    `;
    
    document.head.appendChild(script);

    // Listen for Firebase events
    const handleFirebaseLoaded = () => setFirebaseLoaded(true);
    const handleLoginSuccess = () => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome to Nexora AI!",
      });
      onLogin();
    };
    const handleLoginError = (event: any) => {
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: event.detail || "Please try again",
        variant: "destructive",
      });
    };
    const handleAuthReady = (event: any) => {
      if (event.detail.loggedIn) {
        onLogin();
      }
    };

    window.addEventListener('nexora_firebase_loaded', handleFirebaseLoaded);
    window.addEventListener('nexora_login_success', handleLoginSuccess);
    window.addEventListener('nexora_login_error', handleLoginError);
    window.addEventListener('nexora_auth_ready', handleAuthReady);

    return () => {
      window.removeEventListener('nexora_firebase_loaded', handleFirebaseLoaded);
      window.removeEventListener('nexora_login_success', handleLoginSuccess);
      window.removeEventListener('nexora_login_error', handleLoginError);
      window.removeEventListener('nexora_auth_ready', handleAuthReady);
      document.head.removeChild(script);
    };
  }, [onLogin, toast]);

  const handleGoogleLogin = () => {
    if (!firebaseLoaded) {
      toast({
        title: "Please wait",
        description: "Firebase is still loading...",
      });
      return;
    }
    
    setIsLoading(true);
    window.googleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 relative">
      {/* Skip Button */}
      {onSkip && (
        <Button
          variant="ghost"
          onClick={onSkip}
          className="absolute top-4 right-4 z-10"
        >
          <X className="h-4 w-4 mr-2" />
          Skip
        </Button>
      )}
      
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-white p-2 shadow-lg">
            <img src="https://tahmid1dev.github.io/nexora-ai-logo/NexoraAILogo.jpg" alt="Nexora AI" className="w-full h-full object-contain rounded-full" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">Nexora AI</h1>
            <p className="text-muted-foreground">Your intelligent AI assistant</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to access your personalized AI experience
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <span className="text-red-600 dark:text-red-400 font-semibold">
                Google login/sign up is optional, you can skip and continue to chat
              </span>
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading || !firebaseLoaded}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
                size="lg"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              {onSkip && (
                <Button
                  onClick={onSkip}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Maybe Later
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our terms of service
              </p>
              <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Secure authentication via Google</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl">🧠</div>
            <p className="text-xs text-muted-foreground">Advanced AI</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">💬</div>
            <p className="text-xs text-muted-foreground">Smart Conversations</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🔒</div>
            <p className="text-xs text-muted-foreground">Privacy Focused</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">⚡</div>
            <p className="text-xs text-muted-foreground">Lightning Fast</p>
          </div>
        </div>
      </div>
    </div>
  );
}