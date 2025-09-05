import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BannerAd } from "@/components/BannerAd";


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
        apiKey: "AIzaSyBE6-uLHIPfyMA7rsrHSkEznr_bhgNi3oI",
        authDomain: "qwell-ai.firebaseapp.com",
        projectId: "qwell-ai",
        storageBucket: "qwell-ai.firebasestorage.app",
        messagingSenderId: "264232146695",
        appId: "1:264232146695:web:13d4a712835129e82ed7a2",
        measurementId: "G-1MK21HKTBV"
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
            localStorage.setItem('qwell_user', JSON.stringify({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL
            }));
            window.dispatchEvent(new CustomEvent('qwell_login_success'));
          })
          .catch((error) => {
            console.error(error);
            window.dispatchEvent(new CustomEvent('qwell_login_error', { detail: error.message }));
          });
      };

      // Logout function
      window.googleLogout = function() {
        signOut(auth).then(() => {
          localStorage.removeItem('qwell_user');
          window.dispatchEvent(new CustomEvent('qwell_logout_success'));
        }).catch((error) => {
          console.error(error);
        });
      };

      // Auto-detect login status
      onAuthStateChanged(auth, (user) => {
        if (user) {
          localStorage.setItem('qwell_user', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          }));
          window.dispatchEvent(new CustomEvent('qwell_auth_ready', { detail: { loggedIn: true } }));
        } else {
          localStorage.removeItem('qwell_user');
          window.dispatchEvent(new CustomEvent('qwell_auth_ready', { detail: { loggedIn: false } }));
        }
      });

      window.dispatchEvent(new CustomEvent('qwell_firebase_loaded'));
    `;
    
    document.head.appendChild(script);

    // Listen for Firebase events
    const handleFirebaseLoaded = () => setFirebaseLoaded(true);
    const handleLoginSuccess = () => {
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome to Qwell AI!",
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

    window.addEventListener('qwell_firebase_loaded', handleFirebaseLoaded);
    window.addEventListener('qwell_login_success', handleLoginSuccess);
    window.addEventListener('qwell_login_error', handleLoginError);
    window.addEventListener('qwell_auth_ready', handleAuthReady);

    return () => {
      window.removeEventListener('qwell_firebase_loaded', handleFirebaseLoaded);
      window.removeEventListener('qwell_login_success', handleLoginSuccess);
      window.removeEventListener('qwell_login_error', handleLoginError);
      window.removeEventListener('qwell_auth_ready', handleAuthReady);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Skip Button */}
      {onSkip && (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSkip();
          }}
          className="absolute top-6 right-6 z-50 bg-background/80 backdrop-blur-sm border hover:bg-background/90 transition-all"
        >
          <X className="h-4 w-4 mr-2" />
          Skip
        </Button>
      )}
      
      <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
        {/* Logo and Title */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-background p-3">
                <MessageSquare className="w-full h-full text-primary" />
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Qwell AI
            </h1>
            <p className="text-lg text-muted-foreground font-medium">Your intelligent AI companion</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Advanced AI • Secure • Private</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-2xl bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-3 pb-6">
            <CardTitle className="text-2xl font-semibold">Welcome to Qwell</CardTitle>
            <p className="text-muted-foreground">
              Sign in to unlock personalized AI conversations and save your chat history
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">ℹ</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Authentication is Optional
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    You can start chatting right away or sign in to save your conversations and get personalized responses.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading || !firebaseLoaded}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm transition-all duration-200 hover:shadow-md"
                size="lg"
              >
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </span>
              </Button>

              {onSkip && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSkip();
                  }}
                  variant="outline"
                  className="w-full h-12 border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  size="lg"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chatting Without Account
                </Button>
              )}
            </div>
            
            <div className="text-center space-y-3">
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-border/50">
                <div className="text-center space-y-1">
                  <div className="text-lg">🔒</div>
                  <p className="text-xs text-muted-foreground">Secure</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-lg">⚡</div>
                  <p className="text-xs text-muted-foreground">Fast</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-lg">🧠</div>
                  <p className="text-xs text-muted-foreground">Smart</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our terms of service and privacy policy
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm font-medium text-foreground">Smart Conversations</p>
            <p className="text-xs text-muted-foreground mt-1">Advanced AI responses</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/5 border border-secondary/10">
            <div className="text-2xl mb-2">📱</div>
            <p className="text-sm font-medium text-foreground">Cross-Device Sync</p>
            <p className="text-xs text-muted-foreground mt-1">Access anywhere</p>
          </div>
        </div>
      </div>
      
      {/* Banner Ad */}
      <BannerAd />
    </div>
  );
}