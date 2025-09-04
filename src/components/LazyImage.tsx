import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  loading = "lazy",
  fetchPriority = "auto"
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const shouldLoad = loading === "eager" || isInView;

  return (
    <div 
      ref={imgRef}
      className={cn("overflow-hidden", className)}
      style={{ width, height }}
    >
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && shouldLoad && (
        <div 
          className={cn(
            "bg-muted animate-pulse",
            className
          )}
          style={{ width, height }}
        />
      )}
    </div>
  );
}