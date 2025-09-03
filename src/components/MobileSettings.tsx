import { useState } from "react";
import { Settings, Download, Smartphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function MobileSettings() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownloadAPK = () => {
    alert(`To generate APK:
1. Export project to GitHub via the GitHub button
2. Clone your repository locally  
3. Run: npm install
4. Run: npx cap add android
5. Run: npm run build
6. Run: npx cap sync
7. Run: npx cap run android
8. In Android Studio, Build > Generate Signed Bundle/APK`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1 md:gap-2 text-xs h-8">
          <Settings className="h-3 w-3" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile App Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Nexora AI mobile application
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleDownloadAPK}
                className="w-full bg-nexora-primary hover:bg-nexora-primary/90"
              >
                <Download className="mr-2 h-4 w-4" />
                APK Instructions
              </Button>
              <p className="text-xs text-muted-foreground">
                Get step-by-step instructions to build your Android APK
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                App Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Version:</span>
                <Badge variant="secondary">1.0.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Platform:</span>
                <Badge variant="outline">Capacitor</Badge>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Mobile Ready:</p>
            <ul className="space-y-1">
              <li>• Responsive UI</li>
              <li>• Touch interface</li>
              <li>• Banner ads ready</li>
              <li>• Android & iOS support</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}