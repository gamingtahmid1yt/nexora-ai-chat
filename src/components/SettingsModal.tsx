import { useState } from "react";
import { Trash2, Download, Shield, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useChatStore } from "@/stores/chatStore";
import { useToast } from "@/hooks/use-toast";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { clearAllChats } = useChatStore();
  const { toast } = useToast();

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
            <h3 className="text-sm font-medium mb-3">Links</h3>
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