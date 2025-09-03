import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export function ScrollToBottomButton({ scrollAreaRef }: ScrollToBottomButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('ScrollToBottomButton: Effect triggered', { scrollAreaRef: !!scrollAreaRef.current });
    
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    
    if (!scrollContainer) {
      console.log('ScrollToBottomButton: No scroll container found');
      return;
    }

    console.log('ScrollToBottomButton: Scroll container found, setting up listeners');

    const handleScroll = () => {
      try {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
        const shouldShow = !isAtBottom && scrollHeight > clientHeight;
        
        console.log('ScrollToBottomButton: Scroll event', {
          scrollTop,
          scrollHeight,
          clientHeight,
          isAtBottom,
          shouldShow,
          currentVisibility: isVisible
        });
        
        setIsVisible(shouldShow);
      } catch (error) {
        console.error('ScrollToBottomButton scroll error:', error);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check with delay to ensure proper measurement
    setTimeout(handleScroll, 100);

    return () => {
      try {
        scrollContainer.removeEventListener('scroll', handleScroll);
        console.log('ScrollToBottomButton: Event listeners removed');
      } catch (error) {
        console.error('ScrollToBottomButton cleanup error:', error);
      }
    };
  }, [scrollAreaRef, isVisible]);

  const scrollToBottom = () => {
    console.log('ScrollToBottomButton: Button clicked');
    try {
      const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (scrollContainer) {
        console.log('ScrollToBottomButton: Scrolling to bottom', {
          scrollHeight: scrollContainer.scrollHeight,
          currentScrollTop: scrollContainer.scrollTop
        });
        
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        console.log('ScrollToBottomButton: No scroll container found for scrolling');
      }
    } catch (error) {
      console.error('ScrollToBottomButton scroll to bottom error:', error);
    }
  };

  console.log('ScrollToBottomButton: Render', { isVisible });

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-32 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
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