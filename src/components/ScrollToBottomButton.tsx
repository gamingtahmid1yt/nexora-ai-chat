import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export function ScrollToBottomButton({ scrollAreaRef }: ScrollToBottomButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('ScrollToBottomButton: Effect triggered', { 
      scrollAreaRef: !!scrollAreaRef.current,
      currentVisible: isVisible 
    });
    
    if (!scrollAreaRef.current) {
      console.log('ScrollToBottomButton: scrollAreaRef.current is null');
      return;
    }
    
    // Try multiple selectors to find the scroll container
    let scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
    
    if (!scrollContainer) {
      // Fallback to direct scroll area
      scrollContainer = scrollAreaRef.current;
      console.log('ScrollToBottomButton: Using fallback scroll container');
    }
    
    if (!scrollContainer) {
      console.log('ScrollToBottomButton: No scroll container found at all');
      return;
    }

    console.log('ScrollToBottomButton: Scroll container found:', {
      tagName: scrollContainer.tagName,
      className: scrollContainer.className,
      scrollHeight: scrollContainer.scrollHeight,
      clientHeight: scrollContainer.clientHeight
    });

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
      let scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      
      if (!scrollContainer && scrollAreaRef.current) {
        scrollContainer = scrollAreaRef.current;
      }
      
      if (scrollContainer) {
        console.log('ScrollToBottomButton: Scrolling to bottom', {
          scrollHeight: scrollContainer.scrollHeight,
          currentScrollTop: scrollContainer.scrollTop,
          clientHeight: scrollContainer.clientHeight
        });
        
        // Try immediate scroll first
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        
        // Then smooth scroll as backup
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
        
        console.log('ScrollToBottomButton: Scroll completed');
      } else {
        console.error('ScrollToBottomButton: No scroll container found for scrolling');
      }
    } catch (error) {
      console.error('ScrollToBottomButton scroll to bottom error:', error);
    }
  };

  console.log('ScrollToBottomButton: Render', { isVisible });

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 md:bottom-36 right-6 z-50 animate-fade-in">
      <Button
        onClick={scrollToBottom}
        size="sm"
        className="rounded-full shadow-lg bg-nexora-primary hover:bg-nexora-primary/90 text-white border-2 border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-200 w-12 h-12"
        title="Scroll to bottom"
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
}