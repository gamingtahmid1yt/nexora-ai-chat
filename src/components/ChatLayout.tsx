import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NetworkStatus } from "@/components/NetworkStatus";
import { BannerAd } from "@/components/BannerAd";
import { useTheme } from "@/hooks/useTheme";

export function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    // Set dark theme as default for Nexora
    if (isDark === null) {
      document.documentElement.classList.add('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 h-12 md:h-14 border-b border-border flex items-center justify-between px-2 md:px-4 bg-card/80 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 md:gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white p-1 flex items-center justify-center">
                    <img 
                      src="https://tahmid1dev.github.io/nexora-ai-logo/NexoraAILogo.jpg" 
                      alt="Nexora AI" 
                      width={32}
                      height={32}
                      loading="eager"
                      decoding="sync"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <h1 className="text-lg md:text-xl font-bold gradient-text">Nexora AI</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-1 md:gap-2">
                <NetworkStatus />
                <ThemeToggle />
              </div>
            </header>

            {/* Banner Ad */}
            <div className="flex justify-center p-4 bg-muted/30 border-b border-border">
              <BannerAd 
                adCode='<!-- BD Ads Network - Ad Display Code --><div id="adm-container-1772"></div><script data-cfasync="false" async type="text/javascript" src="//bdadsnetwork.com/display/items.php?1772&1329&0&0&18&0&0"></script><!-- BD Ads Network - Ad Display Code -->'
                className="flex-shrink-0"
              />
            </div>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
              <ChatInterface />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}