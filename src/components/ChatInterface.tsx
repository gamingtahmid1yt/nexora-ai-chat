import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { MobileSettings } from "@/components/MobileSettings";
import { BannerAd } from "@/components/BannerAd";
import { useChatStore } from "@/stores/chatStore";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { currentSession, addMessage, createNewSession, clearAllChats } = useChatStore();
  const { sendMessage, isLoading } = useAI();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    addMessage({
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    });

    // Send to AI
    await sendMessage(userMessage);
  };

  const handleClearChat = () => {
    if (currentSession?.messages.length === 0) return;
    
    createNewSession();
    toast({
      title: "Chat cleared",
      description: "Started a new conversation",
    });
  };


  const handleRegenerate = async () => {
    const messages = currentSession?.messages || [];
    if (messages.length === 0) return;

    // Find the last user message
    let lastUserMessage = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMessage = messages[i].content;
        break;
      }
    }

    if (lastUserMessage) {
      // Remove the last AI response
      const updatedMessages = [...messages];
      if (updatedMessages[updatedMessages.length - 1]?.role === "assistant") {
        updatedMessages.pop();
      }
      
      // Send the message again
      await sendMessage(lastUserMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Ctrl/Cmd + K to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      handleClearChat();
    }
  };


  // Auto-scroll functionality removed per user request

  return (
    <div className="flex flex-col h-screen">
      <ScrollToBottomButton scrollAreaRef={scrollAreaRef} />
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2 md:p-4 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-4 pb-56 md:pb-64">
          {!currentSession?.messages.length ? (
            <div className="text-center py-12 md:py-20 animate-fade-in px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center shadow-lg">
                <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 gradient-text">Welcome to Nexora AI</h1>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed text-sm md:text-base">
                Your intelligent AI assistant. Ask me anything, and I'll help you with detailed, accurate responses.
              </p>
              <div className="mt-4 md:mt-6 flex flex-wrap gap-1.5 md:gap-2 justify-center px-2">
                <div className="text-xs bg-muted px-2 md:px-3 py-1 rounded-full">💡 Creative Writing</div>
                <div className="text-xs bg-muted px-2 md:px-3 py-1 rounded-full">🔍 Research & Analysis</div>
                <div className="text-xs bg-muted px-2 md:px-3 py-1 rounded-full">💻 Code Assistance</div>
                <div className="text-xs bg-muted px-2 md:px-3 py-1 rounded-full">📝 Problem Solving</div>
              </div>
            </div>
          ) : (
            currentSession.messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                className="message-fade-in"
                onRegenerate={message.role === "assistant" ? handleRegenerate : undefined}
              />
            ))
          )}
          
          {(isLoading) && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input Area - Fixed and Always Sticky */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md shadow-lg">
        <div className="max-w-4xl mx-auto p-2 md:p-4">
          {/* Quick Actions Bar */}
          {currentSession?.messages.length > 0 && (
            <div className="flex gap-2 mb-2 md:mb-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="gap-1 md:gap-2 text-xs h-8"
                title="Clear chat (Ctrl+K)"
              >
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
              </Button>
              <div className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded h-8 flex items-center">
                {currentSession.messages.length} msg{currentSession.messages.length > 1 ? 's' : ''}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Nexora AI... (Press Enter to send, Ctrl+K for new chat)"
                className="min-h-[50px] md:min-h-[60px] max-h-24 md:max-h-32 resize-none bg-background/80 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm md:text-base"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-nexora-primary hover:bg-nexora-primary/90 transition-all duration-200 hover:scale-105 h-[50px] md:h-[60px] w-12 md:w-14"
                title="Send message (Enter)"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
          {/* Removed disclaimer texts as requested */}
        </div>
        {/* Banner Ads */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm">
          <BannerAd adCode='<div id="adm-container-1772"></div><script data-cfasync="false" async type="text/javascript" src="//bdadsnetwork.com/display/items.php?1772&1329&0&0&18&0&0"></script>' />
        </div>
      </div>
    </div>
  );
}