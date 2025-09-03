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
      title: "✨ New Chat Started",
      description: "Ready for a fresh conversation with Nexora AI",
      duration: 2000,
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


  useEffect(() => {
    console.log('ChatInterface: Auto-scroll effect triggered', {
      messageCount: currentSession?.messages?.length,
      isLoading,
      scrollAreaRef: !!scrollAreaRef.current
    });
    
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      console.log('ChatInterface: Scroll container found:', !!scrollContainer);
      
      if (scrollContainer) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
          console.log('ChatInterface: Scrolled to bottom');
        });
      }
    }
  }, [currentSession?.messages, isLoading]);

  return (
    <div className="flex flex-col h-screen">
      <ScrollToBottomButton scrollAreaRef={scrollAreaRef} />
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2 md:p-4 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-4 pb-56 md:pb-64">
          {!currentSession?.messages.length ? (
            <div className="text-center py-12 md:py-20 animate-fade-in px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-full bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center shadow-xl nexora-card">
                <img 
                  src="/src/assets/nexora-logo.png" 
                  alt="Nexora AI" 
                  className="h-12 w-12 md:h-14 md:w-14 object-contain filter brightness-0 invert"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 gradient-text">Welcome to Nexora AI</h1>
              <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed text-base md:text-lg mb-6">
                Your intelligent AI assistant powered by advanced reasoning. Ask me anything, and I'll provide detailed, accurate responses tailored to your needs.
              </p>
              <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto px-2">
                <div className="text-sm bg-gradient-to-r from-nexora-primary/10 to-nexora-secondary/10 border border-nexora-primary/20 px-3 md:px-4 py-2 rounded-lg nexora-card">
                  <div className="text-lg mb-1">💡</div>
                  <div className="font-medium">Creative Writing</div>
                </div>
                <div className="text-sm bg-gradient-to-r from-nexora-primary/10 to-nexora-secondary/10 border border-nexora-primary/20 px-3 md:px-4 py-2 rounded-lg nexora-card">
                  <div className="text-lg mb-1">🔍</div>
                  <div className="font-medium">Research & Analysis</div>
                </div>
                <div className="text-sm bg-gradient-to-r from-nexora-primary/10 to-nexora-secondary/10 border border-nexora-primary/20 px-3 md:px-4 py-2 rounded-lg nexora-card">
                  <div className="text-lg mb-1">💻</div>
                  <div className="font-medium">Code Assistance</div>
                </div>
                <div className="text-sm bg-gradient-to-r from-nexora-primary/10 to-nexora-secondary/10 border border-nexora-primary/20 px-3 md:px-4 py-2 rounded-lg nexora-card">
                  <div className="text-lg mb-1">📝</div>
                  <div className="font-medium">Problem Solving</div>
                </div>
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

      {/* Input Area - Enhanced Design */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-gradient-to-t from-background via-background/95 to-background/90 backdrop-blur-xl shadow-2xl">
        <div className="max-w-4xl mx-auto p-2 md:p-4">
          {/* Quick Actions Bar - Enhanced */}
          {currentSession?.messages.length > 0 && (
            <div className="flex gap-2 mb-2 md:mb-3 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="gap-1 md:gap-2 text-xs h-8 border-nexora-primary/30 hover:bg-nexora-primary/10 hover:border-nexora-primary/50 transition-all duration-300"
                title="Clear chat (Ctrl+K)"
              >
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
              </Button>
              <div className="text-xs text-muted-foreground px-3 py-1 bg-gradient-to-r from-nexora-primary/5 to-nexora-secondary/5 border border-nexora-primary/20 rounded-lg h-8 flex items-center">
                {currentSession.messages.length} message{currentSession.messages.length > 1 ? 's' : ''}
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
                className="min-h-[50px] md:min-h-[60px] max-h-24 md:max-h-32 resize-none bg-background/80 border-border/50 focus:border-nexora-primary/50 focus:ring-2 focus:ring-nexora-primary/20 transition-all duration-300 text-sm md:text-base rounded-xl"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="nexora-button h-[50px] md:h-[60px] w-12 md:w-14 rounded-xl"
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
        {/* Banner Ads - Enhanced Design */}
        <div className="border-t border-border/30 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-sm">
          <BannerAd adCode='<div id="adm-container-1772"></div><script data-cfasync="false" async type="text/javascript" src="//bdadsnetwork.com/display/items.php?1772&1329&0&0&18&0&0"></script>' />
        </div>
      </div>
    </div>
  );
}