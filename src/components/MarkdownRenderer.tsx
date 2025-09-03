import { useState, useEffect } from 'react';
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
    console.log('MarkdownRenderer: Processing content length:', content.length);
    
    // Bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    
    // Italic text
    processed = processed.replace(/\*(.*?)\*/g, '<em class="italic text-foreground">$1</em>');
    
    // Strikethrough text
    processed = processed.replace(/~~(.*?)~~/g, '<del class="line-through text-muted-foreground">$1</del>');
    
    // Headers with improved styling
    processed = processed.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-foreground mt-4 mb-2 border-l-4 border-primary pl-3">$1</h3>');
    processed = processed.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-foreground mt-6 mb-3 border-b-2 border-border pb-2">$1</h2>');
    processed = processed.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-foreground mt-6 mb-4 border-b-2 border-primary pb-3">$1</h1>');
    
    // Lists with better formatting
    processed = processed.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc text-foreground mb-1">$1</li>');
    processed = processed.replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc text-foreground mb-1">$1</li>');
    processed = processed.replace(/^\+ (.*$)/gm, '<li class="ml-4 list-disc text-foreground mb-1">$1</li>');
    processed = processed.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-foreground mb-1">$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    processed = processed.replace(/(<li class="ml-4 list-disc[^>]*>.*?<\/li>(\s*<li class="ml-4 list-disc[^>]*>.*?<\/li>)*)/gs, '<ul class="my-2 space-y-1">$1</ul>');
    processed = processed.replace(/(<li class="ml-4 list-decimal[^>]*>.*?<\/li>(\s*<li class="ml-4 list-decimal[^>]*>.*?<\/li>)*)/gs, '<ol class="my-2 space-y-1">$1</ol>');
    
    // Blockquotes with better styling
    processed = processed.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 my-3 text-muted-foreground italic bg-muted/30 py-2 rounded-r">$1</blockquote>');
    
    // Horizontal rules
    processed = processed.replace(/^---$/gm, '<hr class="border-border my-6">');
    processed = processed.replace(/^\*\*\*$/gm, '<hr class="border-border my-6">');
    
    // Math expressions with better styling
    processed = processed.replace(/\$\$(.*?)\$\$/g, '<div class="math-block font-mono text-sm bg-muted px-4 py-3 rounded-lg block my-3 border-l-4 border-primary overflow-x-auto">$1</div>');
    processed = processed.replace(/\$(.*?)\$/g, '<span class="math-inline font-mono text-sm bg-muted px-2 py-1 rounded border">$1</span>');
    
    // Tables (basic support)
    processed = processed.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split('|').map((cell: string) => cell.trim());
      return '<tr>' + cells.map((cell: string) => `<td class="border border-border px-3 py-2">${cell}</td>`).join('') + '</tr>';
    });
    
    // Comparison tables and vs patterns with better spacing
    processed = processed.replace(/(\w+)\s+vs\.?\s+(\w+)/gi, '<span class="comparison-highlight bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 px-3 py-2 rounded-lg font-medium mx-1 inline-block">$1 <span class="text-muted-foreground font-normal">vs</span> $2</span>');
    
    // Number comparisons with highlighting
    processed = processed.replace(/(\d+(?:\.\d+)?)\s*([><≥≤=≠±]+)\s*(\d+(?:\.\d+)?)/g, '<span class="number-comparison bg-muted px-2 py-1 rounded font-mono text-sm">$1 <span class="text-primary font-bold">$2</span> $3</span>');
    
    // Inline code (backticks) - but not code blocks
    processed = processed.replace(/`([^`\n]+)`/g, '<code class="px-2 py-1 mx-1 bg-muted rounded text-sm font-mono text-primary break-all border">$1</code>');
    
    // Special symbols and emojis - process these BEFORE angle brackets
    processed = processed.replace(/:-?\)/g, '<span class="text-yellow-500">😊</span>');
    processed = processed.replace(/:-?\(/g, '<span class="text-blue-500">😢</span>');
    processed = processed.replace(/:D/g, '<span class="text-yellow-500">😃</span>');
    processed = processed.replace(/;\)/g, '<span class="text-yellow-500">😉</span>');
    processed = processed.replace(/\(c\)/gi, '<span class="text-muted-foreground">©</span>');
    processed = processed.replace(/\(r\)/gi, '<span class="text-muted-foreground">®</span>');
    processed = processed.replace(/\(tm\)/gi, '<span class="text-muted-foreground">™</span>');
    processed = processed.replace(/\+\/-/g, '<span class="text-muted-foreground">±</span>');
    processed = processed.replace(/\.\.\./g, '<span class="text-muted-foreground">…</span>');
    
    // Arrow symbols - process before angle brackets
    processed = processed.replace(/->/g, '<span class="text-primary font-mono">→</span>');
    processed = processed.replace(/<-/g, '<span class="text-primary font-mono">←</span>');
    processed = processed.replace(/=>/g, '<span class="text-primary font-mono">⇒</span>');
    processed = processed.replace(/<=/g, '<span class="text-primary font-mono">⇐</span>');
    
    // URLs - must be processed before angle brackets
    processed = processed.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g, 
      '<a href="$&" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200 break-all">$&</a>');
    
    // Email addresses
    processed = processed.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 
      '<a href="mailto:$&" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors duration-200">$&</a>');
    
    // Angle brackets (HTML-like tags) - escape them but avoid breaking already processed HTML
    processed = processed.replace(/<(?!\/?(strong|code|span|a|br|h[1-6]|li|blockquote|hr|em|del|ul|ol|div|tr|td|table)\b)[^<>]*>/g, (match) => {
      const content = match.slice(1, -1);
      return `<span class="text-blue-600 dark:text-blue-400 font-mono">&lt;${content}&gt;</span>`;
    });
    
    // Better spacing and line breaks
    processed = processed.replace(/\n\n/g, '<br><br>');
    processed = processed.replace(/\n/g, '<br>');
    
    // Improve spacing around elements
    processed = processed.replace(/(<\/?(h[1-6]|blockquote|ul|ol|div|hr)>)/g, '$1\n');
    
    console.log('MarkdownRenderer: Code blocks found:', codeBlocks.length);
    console.log('MarkdownRenderer: Processed content length:', processed.length);
    
    return { processed, codeBlocks };
  });

  const renderContent = () => {
    const { processed, codeBlocks } = processedData;
    const parts = processed.split(/(__CODE_BLOCK_\d+__)/);
    
    console.log('MarkdownRenderer: Rendering parts:', parts.length);
    
    return parts.map((part, index) => {
      // Check if this part is a code block placeholder
      const codeBlock = codeBlocks.find(block => block.id === part);
      if (codeBlock) {
        console.log('MarkdownRenderer: Rendering code block', codeBlock.language);
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

  // Add URLs processing after all other processing
  useEffect(() => {
    console.log('MarkdownRenderer: Component rendered with content length:', content.length);
  }, [content]);

  return (
    <div 
      className={`prose prose-sm max-w-none dark:prose-invert leading-relaxed space-y-2 ${className}`}
      style={{
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%',
        lineHeight: '1.7'
      }}
    >
      {renderContent()}
    </div>
  );
}