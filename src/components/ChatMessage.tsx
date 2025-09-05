import { User, Bot, Copy, Check, RotateCcw, Volume2, VolumeX, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useAuth } from "@/hooks/useAuth";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { TextSelectionModal } from "@/components/TextSelectionModal";


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
  const { speak, stop, isPlaying, isLoading } = useTextToSpeech();
  const [showTextModal, setShowTextModal] = useState(false);

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

  const handleTextToSpeech = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(message.content);
    }
  };

  const handleSelectText = () => {
    setShowTextModal(true);
  };

  return (
    <div className={cn("flex gap-3 group", className)}>
      <Avatar className="w-8 h-8 mt-1">
        {isUser && user?.photoURL ? (
          <AvatarImage src={user.photoURL} alt="User avatar" />
        ) : !isUser ? (
          <AvatarImage src="https://tahmid1dev.github.io/nexora-ai-logo/NexoraAILogo.jpg" alt="Qwell AI" />
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

      <div className="flex-1 space-y-2 group min-w-0 overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isUser ? "You" : "Qwell AI"}
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
          "rounded-2xl shadow-lg border transition-all duration-300 break-words overflow-hidden",
          isUser 
            ? "bg-gradient-to-br from-nexora-primary via-nexora-primary/95 to-nexora-primary/85 text-white ml-auto max-w-[85%] backdrop-blur-sm border-nexora-primary/30 shadow-nexora-primary/20 p-5 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-2xl transform hover:scale-[1.02] word-wrap" 
            : "bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-md max-w-[95%] border-border/60 border-l-4 border-l-nexora-primary/40 hover:border-l-nexora-primary/70 shadow-md hover:shadow-lg p-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-2xl select-none"
        )}>
          <div className="space-y-3 overflow-hidden">
            <MarkdownRenderer 
              content={message.content} 
              className={cn(
                "leading-relaxed overflow-hidden break-words",
                isUser ? "text-sm" : "text-sm tracking-wide"
              )}
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

        {/* Action buttons */}
        <div className="mt-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectText}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            title="Select text"
          >
            <FileText className="h-3 w-3 mr-1" />
            Select Text
          </Button>
          {!isUser && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTextToSpeech}
                disabled={isLoading}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                title={isPlaying ? "Stop audio" : "Play audio"}
              >
                {isLoading ? (
                  <div className="h-3 w-3 mr-1 animate-spin rounded-full border border-current border-t-transparent" />
                ) : isPlaying ? (
                  <VolumeX className="h-3 w-3 mr-1" />
                ) : (
                  <Volume2 className="h-3 w-3 mr-1" />
                )}
                {isLoading ? "Loading..." : isPlaying ? "Stop" : "Listen"}
              </Button>
              {onRegenerate && (
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
              )}
            </>
          )}
        </div>
      </div>

      <TextSelectionModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        text={message.content}
        title={isUser ? "Your Message" : "AI Message"}
      />
    </div>
  );
}