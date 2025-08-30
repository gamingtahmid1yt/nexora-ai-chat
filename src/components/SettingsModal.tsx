import { useState } from "react";
import { Trash2, Download, Shield, X, Palette, Monitor, Sun, Moon, Globe, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useChatStore } from "@/stores/chatStore";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { clearAllChats } = useChatStore();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(
    localStorage.getItem('nexora-notifications') !== 'false'
  );
  const [animations, setAnimations] = useState(
    localStorage.getItem('nexora-animations') !== 'false'
  );

  const handleClearAllChats = () => {
    clearAllChats();
    toast({
      title: "Chat history cleared",
      description: "All your conversations have been deleted.",
    });
    onOpenChange(false);
  };

  const handleExportData = () => {
    const data = localStorage.getItem('nexora-chat-store');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexora-chat-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your chat history has been downloaded.",
      });
    }
  };

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('nexora-notifications', checked.toString());
    toast({
      title: checked ? "Notifications enabled" : "Notifications disabled",
      description: checked ? "You'll receive notifications" : "Notifications are turned off",
    });
  };

  const handleAnimationsChange = (checked: boolean) => {
    setAnimations(checked);
    localStorage.setItem('nexora-animations', checked.toString());
    toast({
      title: checked ? "Animations enabled" : "Animations disabled",
      description: checked ? "UI animations are turned on" : "UI animations are turned off",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-nexora-primary to-nexora-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            Nexora AI Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-sm">Theme</Label>
                <div className="flex gap-1">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="h-8 px-3"
                  >
                    <Sun className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="h-8 px-3"
                  >
                    <Moon className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="h-8 px-3"
                  >
                    <Monitor className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-sm">Animations</Label>
                <Switch
                  id="animations"
                  checked={animations}
                  onCheckedChange={handleAnimationsChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">App Info</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Version: 2025.08</p>
              <p>Last Updated: 12 Aug 2025</p>
              <p>Created by: Tahmid</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3">Data Management</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="w-full justify-start gap-2"
              >
                <Download className="h-4 w-4" />
                Export Chat Data
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleClearAllChats}
                className="w-full justify-start gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Chats
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Links & Resources
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => window.open('https://gamingtahmid1yt.github.io/nexora.ai-download/', '_blank')}
                className="w-full justify-start gap-2"
              >
                <Download className="h-4 w-4" />
                Download APK
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://gamingtahmid1yt.github.io/nexora.ai-privacy/', '_blank')}
                className="w-full justify-start gap-2"
              >
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/gamingtahmid1yt/nexora-ai', '_blank')}
                className="w-full justify-start gap-2"
              >
                <Code className="h-4 w-4" />
                Source Code
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>100% Free & Safe</p>
            <p>No Login/Data Collection</p>
            <p>Messages saved locally in your browser</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}