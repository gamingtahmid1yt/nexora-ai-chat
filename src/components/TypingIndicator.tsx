import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 group">
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback className="bg-nexora-secondary text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Nexora AI</span>
        </div>

        <div className="bg-chat-bubble-ai rounded-lg p-3 max-w-[80%]">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-nexora-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-nexora-primary rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-nexora-primary rounded-full animate-pulse delay-200" />
            </div>
            <span className="text-sm text-muted-foreground ml-2 typing-indicator">
              Nexora is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}