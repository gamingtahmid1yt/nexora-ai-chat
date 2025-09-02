import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  enableTypewriter?: boolean;
}

export function MarkdownRenderer({ content, className = "", enableTypewriter = false }: MarkdownRendererProps) {
  const [processedData] = useState(() => {
    let processed = content;
    const codeBlocks: { id: string; code: string; language: string }[] = [];
    
    // Extract code blocks first to prevent them from being processed
    let codeBlockIndex = 0;
    
    // Multi-line code blocks with language
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
      const id = `__CODE_BLOCK_${codeBlockIndex++}__`;
      codeBlocks.push({
        id,
        code: code.trim(),
        language: language || 'text'
      });
      return id;
    });
    
    // Single-line code blocks without newlines
    processed = processed.replace(/```([^`\n]+)```/g, (match, code) => {
      const id = `__CODE_BLOCK_${codeBlockIndex++}__`;
      codeBlocks.push({
        id,
        code: code.trim(),
        language: 'text'
      });
      return id;
    });
    
    // Process other markdown elements
    // Bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    
    // Inline code (backticks) - but not code blocks
    processed = processed.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 mx-0.5 bg-muted rounded text-sm font-mono text-primary break-all">$1</code>');
    
    // Angle brackets (HTML-like tags) - escape them but avoid breaking already processed HTML
    processed = processed.replace(/<(?!\/?(strong|code|span|a|br)\b)[^<>]*>/g, (match) => {
      const content = match.slice(1, -1);
      return `<span class="text-blue-600 dark:text-blue-400 font-mono">&lt;${content}&gt;</span>`;
    });
    
    // URLs - make them clickable and blue
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g;
    processed = processed.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline inline-flex items-center gap-1 break-all font-medium transition-colors">${url}<span class="inline-block ml-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></span></a>`;
    });
    
    // Handle line breaks
    processed = processed.replace(/\n/g, '<br>');
    
    return { processed, codeBlocks };
  });

  const renderContent = () => {
    const { processed, codeBlocks } = processedData;
    const parts = processed.split(/(__CODE_BLOCK_\d+__)/);
    
    return parts.map((part, index) => {
      // Check if this part is a code block placeholder
      const codeBlock = codeBlocks.find(block => block.id === part);
      if (codeBlock) {
        return <CodeBlock key={index} code={codeBlock.code} language={codeBlock.language} />;
      }
      
      // Regular text content
      return part ? (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      ) : null;
    }).filter(Boolean);
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