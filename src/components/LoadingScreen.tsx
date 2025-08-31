import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 100);
          return 100;
        }
        return prev + 20;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center shadow-lg animate-pulse">
          <MessageSquare className="h-10 w-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold gradient-text">Nexora AI</h1>
          <p className="text-muted-foreground">Loading your AI assistant...</p>
        </div>
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-nexora-primary to-nexora-secondary transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}