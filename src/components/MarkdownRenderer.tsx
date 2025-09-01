import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  enableTypewriter?: boolean;
}

export function MarkdownRenderer({ content, className = "", enableTypewriter = false }: MarkdownRendererProps) {
  const [processedContent] = useState(() => {
    let processed = content;
    
    // First, extract and replace code blocks to prevent them from being processed
    const codeBlocks: { placeholder: string; code: string; language: string }[] = [];
    
    // Multi-line code blocks with language
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({
        placeholder,
        code: code.trim(),
        language: language || 'text'
      });
      return placeholder;
    });
    
    // Single-line code blocks
    processed = processed.replace(/```(.*?)```/g, (match, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({
        placeholder,
        code: code.trim(),
        language: 'text'
      });
      return placeholder;
    });
    
    // Process markdown-style text with proper overflow handling
    // Bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    
    // Inline code (backticks) - but not code blocks
    processed = processed.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 mx-0.5 bg-muted rounded text-sm font-mono text-primary break-all">$1</code>');
    
    // URLs - make them clickable and blue
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
    processed = processed.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline inline-flex items-center gap-1 break-all font-medium transition-colors">${url}<span class="inline-block ml-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></span></a>`;
    });
    
    // Handle line breaks and preserve formatting
    processed = processed.replace(/\n/g, '<br>');
    
    // Restore code blocks
    codeBlocks.forEach(({ placeholder, code, language }) => {
      processed = processed.replace(placeholder, `<div data-code-block="${btoa(JSON.stringify({ code, language }))}"></div>`);
    });
    
    return { processed, codeBlocks };
  });

  const renderContent = () => {
    const parts = processedContent.processed.split(/(<div data-code-block="[^"]*"><\/div>)/);
    
    return parts.map((part, index) => {
      const codeBlockMatch = part.match(/data-code-block="([^"]*)"/);
      if (codeBlockMatch) {
        try {
          const { code, language } = JSON.parse(atob(codeBlockMatch[1]));
          return <CodeBlock key={index} code={code} language={language} />;
        } catch {
          return null;
        }
      }
      
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed ${className}`}
      style={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%'
      }}
    >
      {renderContent()}
    </div>
  );
}