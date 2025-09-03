interface BannerAdProps {
  adCode?: string;
  className?: string;
}

export function BannerAd({ adCode, className = "" }: BannerAdProps) {
  if (!adCode) {
    return (
      <div className={`bg-muted/10 p-1 text-center text-xs text-muted-foreground border-b border-border w-[300px] h-[250px] flex items-center justify-center ${className}`}>
        Banner ad space 300x250 (provide ad code)
      </div>
    );
  }

  // When ad code is provided, render it
  return (
    <div 
      className={`w-[300px] h-[250px] border-b border-border bg-card/50 backdrop-blur-sm ${className}`}
      dangerouslySetInnerHTML={{ __html: adCode }}
    />
  );
}