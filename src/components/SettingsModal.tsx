import { useState } from "react";
import { Trash2, Download, Shield, X, Palette, Monitor, Sun, Moon, Globe, Code, LogOut, User, Mail, Github } from "lucide-react";
import nexoraLogo from "@/assets/nexora-logo.png";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
import { useAuth } from "@/hooks/useAuth";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { clearAllChats } = useChatStore();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
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
    setShowClearConfirm(false);
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white p-1">
              <img src={nexoraLogo} alt="Nexora AI" className="w-full h-full object-contain" />
            </div>
            Nexora AI Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Profile or Login */}
          {user ? (
            <>
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </h3>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-nexora-primary flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-red-600 hover:text-red-700 mt-3" 
                  onClick={() => {
                    logout();
                    onOpenChange(false);
                    toast({
                      title: "Signed out",
                      description: "You have been successfully signed out.",
                    });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              <Separator />
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </h3>
                <div className="p-3 rounded-lg bg-muted/50 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Sign in to save your chats and access them across devices
                  </p>
                  <Button
                    onClick={() => {
                      if (window.googleLogin) {
                        window.googleLogin();
                      }
                    }}
                    className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm w-full"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}

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
                onClick={() => setShowClearConfirm(true)}
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
              <Mail className="h-4 w-4" />
              Support & Resources
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => window.open('mailto:tahmidbusinessyt@gmail.com', '_blank')}
                className="w-full justify-start gap-2"
              >
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>

              <Button
                variant="outline"
                onClick={() => window.open('https://github.com/gamingtahmid1yt/nexora-ai', '_blank')}
                className="w-full justify-start gap-2"
              >
                <Github className="h-4 w-4" />
                Source Code
              </Button>
              
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
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span>Secure Authentication</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Google OAuth</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Local Data Storage</span>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Privacy Focused</span>
              <span className="text-green-600">✓</span>
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={showClearConfirm}
          onOpenChange={setShowClearConfirm}
          title="Clear All Chats"
          description="This will permanently delete all your chat conversations. This action cannot be undone."
          confirmText="Clear All"
          cancelText="Cancel"
          onConfirm={handleClearAllChats}
          variant="destructive"
        />
      </DialogContent>
    </Dialog>
  );
}