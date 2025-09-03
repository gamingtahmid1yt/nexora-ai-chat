import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export function ScrollToBottomButton({ scrollAreaRef }: ScrollToBottomButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    
    if (!scrollContainer) {
      console.log('ScrollToBottomButton: No scroll container found');
      return;
    }

    const handleScroll = () => {
      try {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
        setIsVisible(!isAtBottom && scrollHeight > clientHeight);
      } catch (error) {
        console.error('ScrollToBottomButton scroll error:', error);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      try {
        scrollContainer.removeEventListener('scroll', handleScroll);
      } catch (error) {
        console.error('ScrollToBottomButton cleanup error:', error);
      }
    };
  }, [scrollAreaRef]);

  const scrollToBottom = () => {
    try {
      const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('ScrollToBottomButton scroll to bottom error:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <Button
        onClick={scrollToBottom}
        size="sm"
        className="rounded-full shadow-lg bg-nexora-primary hover:bg-nexora-primary/90 text-white border-2 border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-200"
        title="Scroll to bottom"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}