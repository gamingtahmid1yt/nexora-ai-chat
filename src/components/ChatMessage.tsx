import { User, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === "user";

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

      <div className="flex-1 space-y-2">
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
        </div>

        <div className={cn(
          "rounded-lg p-3 max-w-[80%]",
          isUser 
            ? "bg-chat-bubble-user text-white ml-auto" 
            : "bg-chat-bubble-ai"
        )}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          
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
      </div>
    </div>
  );
}