import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Code copied!",
      description: "Code has been copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border/50 bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-sm max-w-full">
      <div className="flex items-center justify-between bg-gradient-to-r from-muted/80 to-muted/50 px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
            <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
          </div>
          <span className="text-xs font-mono text-muted-foreground/80 uppercase tracking-wide ml-2">
            {language}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyCode}
          className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-md"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <div className="relative overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            maxWidth: '100%',
            overflow: 'auto',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 pointer-events-none"></div>
      </div>
    </div>
  );
}