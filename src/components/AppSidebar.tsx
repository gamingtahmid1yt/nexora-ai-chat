import { useState, useEffect } from "react";
import { MessageCircle, Settings, Plus, Trash2, History, Search } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SettingsModal } from "@/components/SettingsModal";
import { useChatStore } from "@/stores/chatStore";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { chatSessions, currentSessionId, createNewSession, switchSession, deleteSession } = useChatStore();

  const startNewChat = () => {
    createNewSession();
  };

  // Filter chat sessions based on search query
  const filteredSessions = chatSessions.filter((session) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const title = (session.title || `Chat ${session.id.slice(0, 8)}`).toLowerCase();
    const hasMatchingMessage = session.messages?.some(message => 
      message.content?.toLowerCase().includes(query)
    ) || false;
    
    return title.includes(query) || hasMatchingMessage;
  });

  return (
    <Sidebar className={collapsed ? "w-14" : "w-72"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Settings Button */}
        <div className="p-3">
          <Button
            variant="ghost"
            onClick={() => setShowSettings(true)}
            className="w-full justify-start gap-2 mb-3"
            size={collapsed ? "sm" : "default"}
          >
            <Settings className="h-4 w-4" />
            {!collapsed && <span>Settings</span>}
          </Button>
          
          {/* New Chat Button */}
          <Button 
            onClick={startNewChat}
            className="w-full justify-start gap-2 bg-nexora-primary hover:bg-nexora-primary/90"
            size={collapsed ? "sm" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span>New Chat</span>}
          </Button>
        </div>

        {/* Search Bar */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-background/50"
              />
            </div>
          </div>
        )}

        {/* Chat History */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-3">
            {!collapsed && "Recent Chats"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-64">
              <SidebarMenu className="px-2">
                {filteredSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={session.id === currentSessionId}
                      className="group cursor-pointer"
                    >
                      <div
                        onClick={() => switchSession(session.id)}
                        className="flex items-center gap-2 w-full"
                      >
                        <MessageCircle className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate text-sm">
                              {session.title || `Chat ${session.id.slice(0, 8)}`}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {filteredSessions.length === 0 && !collapsed && (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    {searchQuery.trim() ? "No matching chats found" : "No chats yet. Start a new conversation!"}
                  </div>
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </Sidebar>
  );
}