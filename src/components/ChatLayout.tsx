import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NetworkStatus } from "@/components/NetworkStatus";
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
            <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <h1 className="text-xl font-bold gradient-text">Nexora AI</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <NetworkStatus />
                <ThemeToggle />
              </div>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col">
              <ChatInterface />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}