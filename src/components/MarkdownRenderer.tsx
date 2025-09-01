import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const [processedContent] = useState(() => {
    let processed = content;
    
    // Process markdown-style text with proper overflow handling
    // Bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    
    // Code blocks (backticks)
    processed = processed.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 mx-0.5 bg-muted rounded text-sm font-mono text-primary break-all">$1</code>');
    
    // Angle brackets (HTML-like tags)
    processed = processed.replace(/&lt;([^&]+)&gt;/g, '<span class="text-blue-600 dark:text-blue-400 font-mono">&lt;$1&gt;</span>');
    processed = processed.replace(/<([^<>]+)>/g, '<span class="text-blue-600 dark:text-blue-400 font-mono">&lt;$1&gt;</span>');
    
    // URLs - make them clickable and blue
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
    processed = processed.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline inline-flex items-center gap-1 break-all font-medium">${url}<span class="inline-block"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></span></a>`;
    });
    
    // Handle line breaks and preserve formatting
    processed = processed.replace(/\n/g, '<br>');
    
    return processed;
  });

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
      style={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%'
      }}
    />
  );
}