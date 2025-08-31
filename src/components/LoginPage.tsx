import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: () => void;
}

declare global {
  interface Window {
    googleLogin: () => void;
    googleLogout: () => void;
  }
}

export function LoginPage({ onLogin }: LoginPageProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center shadow-lg">
            <MessageSquare className="h-10 w-10 text-white" />
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
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading || !firebaseLoaded}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
              size="lg"
            >
              <Chrome className="h-5 w-5 mr-3" />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>
            
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