import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  title: string;
}

export function TextSelectionModal({ isOpen, onClose, text, title }: TextSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          <div className="whitespace-pre-wrap font-mono text-sm bg-muted/30 p-4 rounded-md border select-text">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}