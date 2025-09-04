import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing AI...");

  useEffect(() => {
    const texts = [
      "Initializing AI...",
      "Loading neural networks...",
      "Preparing interface...",
      "Almost ready..."
    ];
    
    let textIndex = 0;
    const textTimer = setInterval(() => {
      setLoadingText(texts[textIndex]);
      textIndex = (textIndex + 1) % texts.length;
    }, 400);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          clearInterval(textTimer);
          setTimeout(onComplete, 50);
          return 100;
        }
        return prev + 25;
      });
    }, 60);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center z-50">
      <div className="text-center space-y-8 animate-fade-in max-w-md mx-auto px-6">
        {/* Enhanced Logo Container */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-2xl animate-pulse">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 animate-[spin_3s_linear_infinite]"></div>
            <img 
              src="https://tahmid1dev.github.io/nexora-ai-logo/NexoraAILogo.jpg" 
              alt="Nexora AI" 
              width={64}
              height={64}
              loading="eager"
              decoding="sync"
              className="w-16 h-16 rounded-full object-cover relative z-10 shadow-lg"
            />
          </div>
          {/* Floating particles effect */}
          <div className="absolute -inset-8 opacity-30">
            <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full animate-[float_2s_ease-in-out_infinite]"></div>
            <div className="absolute top-4 right-2 w-1 h-1 bg-secondary rounded-full animate-[float_2.5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-2 left-4 w-1.5 h-1.5 bg-primary/70 rounded-full animate-[float_3s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Enhanced Text Section */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold gradient-text tracking-tight">Nexora AI</h1>
          <p className="text-muted-foreground text-lg font-medium animate-pulse">
            {loadingText}
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="space-y-3">
          <div className="w-72 h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/50 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-primary via-primary-foreground to-secondary transition-all duration-300 ease-out rounded-full shadow-lg"
              style={{ 
                width: `${progress}%`,
                boxShadow: `0 0 10px hsl(var(--primary) / 0.5)`
              }}
            />
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {progress}% Complete
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}