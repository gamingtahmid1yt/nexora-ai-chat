import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useChatStore } from "@/stores/chatStore";
import { useAI } from "@/hooks/useAI";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { currentSession, addMessage } = useChatStore();
  const { sendMessage, isLoading } = useAI();

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

  const handleImageGeneration = async () => {
    if (!input.trim() || isGeneratingImage) return;

    const prompt = input.trim();
    setInput("");
    setIsGeneratingImage(true);

    try {
      // Add user message for image request
      addMessage({
        role: "user",
        content: `Generate image: ${prompt}`,
        timestamp: new Date(),
      });

      // Call image generation API with correct format
      const response = await fetch('https://api.tahmideditofficial.workers.dev', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer tgp_v1_AzgKHSbFIyq98yBIhyZJhlRZYtyQQb132lrLT15pcR4`
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell-Free",
          prompt: prompt,
          width: 512,
          height: 512,
          num_inference_steps: 4,
          guidance_scale: 1.0,
          num_images_per_prompt: 1
        })
      });

      const data = await response.json();
      console.log('Image API Response:', data);
      
      // Handle different possible response formats
      let imageUrl = null;
      if (data.images && data.images[0]) {
        imageUrl = data.images[0].url || data.images[0];
      } else if (data.data && data.data[0]) {
        imageUrl = data.data[0].url || data.data[0].imageURL || data.data[0];
      } else if (data.url) {
        imageUrl = data.url;
      } else if (data.output && data.output[0]) {
        imageUrl = data.output[0];
      }
      
      if (imageUrl) {
        addMessage({
          role: "assistant",
          content: "Here's your generated image:",
          imageUrl: imageUrl,
          timestamp: new Date(),
        });
      } else {
        console.error('No image URL found in response:', data);
        addMessage({
          role: "assistant",
          content: "Sorry, I couldn't generate the image. The API response didn't contain an image URL. Please try again with a different prompt.",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Image generation error:', error);
      addMessage({
        role: "assistant",
        content: `Sorry, there was an error generating the image: ${error.message}. Please check your internet connection and try again.`,
        timestamp: new Date(),
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [currentSession?.messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {!currentSession?.messages.length ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 gradient-text">Welcome to Nexora AI</h2>
              <p className="text-muted-foreground">
                Your intelligent AI assistant. Ask me anything or generate images!
              </p>
            </div>
          ) : (
            currentSession.messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                className="message-fade-in"
              />
            ))
          )}
          
          {(isLoading || isGeneratingImage) && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input Area - Always Visible */}
      <div className="sticky bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Nexora AI... (Try: 'Explain quantum physics' or 'Generate a sunset image')"
                className="min-h-[60px] max-h-32 resize-none bg-background/80 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={isLoading || isGeneratingImage}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={!input.trim() || isLoading || isGeneratingImage}
                className="bg-nexora-primary hover:bg-nexora-primary/90"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={handleImageGeneration}
                disabled={!input.trim() || isLoading || isGeneratingImage}
                variant="outline"
                size="icon"
                className="border-nexora-primary text-nexora-primary hover:bg-nexora-primary hover:text-white"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Nexora AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}