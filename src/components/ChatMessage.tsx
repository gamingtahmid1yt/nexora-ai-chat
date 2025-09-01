import { User, Bot, Copy, Check, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

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
          "rounded-xl shadow-sm border transition-all duration-200",
          isUser 
            ? "bg-gradient-to-br from-nexora-primary to-nexora-primary/90 text-white ml-auto max-w-[85%] backdrop-blur-sm border-nexora-primary/20 p-4" 
            : "bg-card/80 backdrop-blur-sm max-w-[95%] border-border/50 border-l-4 border-l-nexora-primary/30 hover:border-l-nexora-primary/50 p-4"
        )}>
          {isUser ? (
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="space-y-2">
              <MarkdownRenderer 
                content={message.content} 
                className="text-sm leading-relaxed" 
              />
            </div>
          )}
          
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