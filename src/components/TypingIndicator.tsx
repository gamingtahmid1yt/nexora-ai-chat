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

        <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 max-w-[90%] border border-border/50 border-l-4 border-l-nexora-primary/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 bg-nexora-primary rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-nexora-primary rounded-full animate-bounce delay-100" />
              <div className="w-2.5 h-2.5 bg-nexora-primary rounded-full animate-bounce delay-200" />
            </div>
            <span className="text-sm text-muted-foreground typing-indicator animate-pulse">
              Nexora is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}