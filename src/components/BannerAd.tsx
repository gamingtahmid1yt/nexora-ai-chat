interface BannerAdProps {
  adCode?: string;
  className?: string;
}

export function BannerAd({ adCode, className = "" }: BannerAdProps) {
  if (!adCode) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-[99999] bg-muted/90 backdrop-blur-sm p-2 text-center text-xs text-muted-foreground border-t border-border w-full h-[60px] flex items-center justify-center ${className}`}>
        Banner ad space 320x50 (provide ad code)
      </div>
    );
  }

  // When ad code is provided, render it
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-[99999] w-full h-[60px] bg-card/90 backdrop-blur-sm border-t border-border overflow-hidden ${className}`}>
      <div 
        className="w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    </div>
  );
}