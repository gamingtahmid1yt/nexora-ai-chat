import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 group animate-fade-in">
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback className="bg-nexora-secondary text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Nexora AI</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <div className="bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-sm rounded-2xl p-4 max-w-[90%] border border-border/50 border-l-4 border-l-nexora-primary/50 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-gradient-to-r from-nexora-primary to-nexora-secondary rounded-full animate-[bounce_1.4s_ease-in-out_infinite]" />
              <div className="w-3 h-3 bg-gradient-to-r from-nexora-secondary to-nexora-accent rounded-full animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
              <div className="w-3 h-3 bg-gradient-to-r from-nexora-accent to-nexora-primary rounded-full animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground typing-animation">
                <span className="inline-block animate-pulse">Nexora is thinking</span>
                <span className="typing-dots">
                  <span className="animate-[ping_1s_ease-in-out_infinite]">.</span>
                  <span className="animate-[ping_1s_ease-in-out_0.2s_infinite]">.</span>
                  <span className="animate-[ping_1s_ease-in-out_0.4s_infinite]">.</span>
                </span>
              </span>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 bg-nexora-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground/70">Processing your request</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}