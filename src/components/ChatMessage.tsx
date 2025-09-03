import { User, Bot, Copy, Check, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useAuth } from "@/hooks/useAuth";


interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  className?: string;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, className, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
      duration: 2000,
    });
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };

  return (
    <div className={cn("flex gap-3 group", className)}>
      <Avatar className="w-8 h-8 mt-1">
        {isUser && user?.photoURL ? (
          <AvatarImage src={user.photoURL} alt="User avatar" />
        ) : !isUser ? (
          <AvatarImage src="https://tahmid1dev.github.io/nexora-ai-logo/NexoraAILogo.jpg" alt="Nexora AI" />
        ) : null}
        <AvatarFallback className={cn(
          "text-sm font-medium",
          isUser 
            ? "bg-nexora-primary text-white" 
            : "bg-nexora-secondary text-white"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2 group">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : "Nexora AI"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {!isUser && (
            <div className="flex gap-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0"
                title="Copy message"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>

        <div className={cn(
          "rounded-2xl shadow-lg border transition-all duration-300 transform hover:scale-[1.02]",
          isUser 
            ? "bg-gradient-to-br from-nexora-primary via-nexora-primary/95 to-nexora-primary/85 text-white ml-auto max-w-[85%] backdrop-blur-sm border-nexora-primary/30 shadow-nexora-primary/20 p-5 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-2xl" 
            : "bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-md max-w-[95%] border-border/60 border-l-4 border-l-nexora-primary/40 hover:border-l-nexora-primary/70 shadow-md hover:shadow-lg p-5 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-2xl"
        )}>
          <div className="space-y-2">
            <MarkdownRenderer 
              content={message.content} 
              className="text-sm leading-relaxed" 
            />
          </div>
          
          {message.imageUrl && (
            <div className="mt-3">
              <img
                src={message.imageUrl}
                alt="Generated image"
                className="rounded-lg max-w-full h-auto border border-border"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Regenerate button for AI messages */}
        {!isUser && onRegenerate && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRegenerate}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Regenerate response"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}