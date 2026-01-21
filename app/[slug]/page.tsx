"use client";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  contentUrl: string;
  contentType: string;
  show: boolean;
}

interface FeedItemProps {
  product: Product;
  isActive: boolean;
  shouldRender: boolean;
  onFinished: () => void;
  isPaused: boolean;
}

const FeedItem = memo(({ product, isActive, shouldRender, onFinished, isPaused }: FeedItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isImage = product.contentType.startsWith("image");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manejo de Videos
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && !isPaused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      videoRef.current.pause();
    }
  }, [isActive, isPaused]);

  // Manejo de Imágenes (Timer de 4 segundos)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isActive && isImage && !isPaused) {
      timerRef.current = setTimeout(() => {
        onFinished();
      }, 4000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, isPaused, isImage, onFinished]);

  return (
    <div className="relative h-dvh w-full snap-start shrink-0 bg-black">
      {shouldRender ? (
        <div className="absolute inset-0 animate-in fade-in duration-300">
          {isImage ? (
            <Image 
              unoptimized 
              fill 
              className="object-cover" 
              src={product.contentUrl} 
              alt="image" 
              priority={isActive} 
              sizes="100vw" 
            />
          ) : (
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover" 
              loop={false}
              muted 
              playsInline 
              preload="metadata" 
              src={product.contentUrl}
              onEnded={onFinished}
            />
          )}
          <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-b from-transparent to-black pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-900/20" />
      )}

      {/* Información del producto */}
      <div className="relative h-full flex flex-col justify-end pb-12 px-6 pointer-events-none">
        <div className="mb-2 pointer-events-auto">
          <span className="inline-block px-4 py-1 rounded-full font-bold text-base shadow-lg bg-orange-500 text-white">
            ${product.price}
          </span>
        </div>

        <h2 className="text-2xl text-white font-bold mb-3 leading-tight max-w-[85%] drop-shadow-lg">
          {product.name}
        </h2>

        <p className="text-white/95 text-base leading-relaxed max-w-sm drop-shadow-md line-clamp-3">
          {product.description}
        </p>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.shouldRender !== nextProps.shouldRender) return false;
  if (prevProps.isPaused !== nextProps.isPaused) return false;
  return prevProps.product._id === nextProps.product._id;
});

FeedItem.displayName = "FeedItem";

export default function MenuPage() {
  const products = useQuery(api.products.get);

  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filtrar productos visibles
  const visibleProducts = products?.filter(p => p.show) || [];

  // Observer Logic
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, visibleProducts.length);
  }, [visibleProducts.length]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setCurrentVisibleIndex(index);
            if (autoScrollTimeoutRef.current) {
              clearTimeout(autoScrollTimeoutRef.current);
            }
            autoScrollTimeoutRef.current = setTimeout(() => {
              setIsAutoScrolling(false);
            }, 100);
          }
        }
      });
    }, {
      root: scrollContainerRef.current,
      threshold: 0.6
    });

    itemsRef.current.forEach((el) => {
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [visibleProducts.length]);

  // Auto scroll
  const scrollToNextItem = useCallback(() => {
    if (visibleProducts.length === 0 || !scrollContainerRef.current) return;

    let nextIndex = currentVisibleIndex + 1;
    
    if (nextIndex >= visibleProducts.length) {
      nextIndex = 0;
    }

    const element = itemsRef.current[nextIndex];
    if (element) {
      setIsAutoScrolling(true);
      
      const container = scrollContainerRef.current;
      container.style.scrollSnapType = 'none';
      
      const elementTop = element.offsetTop;
      const startPosition = container.scrollTop;
      const distance = elementTop - startPosition;
      const duration = 800;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        container.scrollTop = startPosition + (distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animation);
        } else {
          container.style.scrollSnapType = 'y mandatory';
          setIsAutoScrolling(false);
        }
      };

      requestAnimationFrame(animation);
    }
  }, [currentVisibleIndex, visibleProducts.length]);

  const handleInteractionStart = () => setIsUserInteracting(true);
  const handleInteractionEnd = () => setIsUserInteracting(false);

  if (!products) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white">
      <div className="mx-auto h-full bg-black overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
        
        {/* OVERLAY BOTÓN VER CARTA */}
        <div className={`absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 pointer-events-none ${isUserInteracting ? "opacity-100" : "opacity-0"}`}>
          <Link 
            href="https://www.lacartaa.com/chiringuito-lounge-517" 
            target="_blank"
            className="pointer-events-auto bg-white text-black font-bold py-3 px-8 rounded-full shadow-2xl transform transition-transform hover:scale-105 flex items-center gap-2"
          >
            <span>Ver carta completa</span>
            <ExternalLink size={18} />
          </Link>
        </div>

        {/* VISTA FEED */}
        <div 
          ref={scrollContainerRef} 
          className="h-dvh overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onMouseDown={handleInteractionStart}
          onMouseUp={handleInteractionEnd}
        >
          {visibleProducts.map((product, index) => {
            const isActive = index === currentVisibleIndex;
            const shouldRender = index >= currentVisibleIndex - 1 && index <= currentVisibleIndex + 1;

            return (
              <div 
                key={product._id} 
                ref={(el) => { itemsRef.current[index] = el; }} 
                data-index={index} 
                className="snap-start h-dvh w-full"
              >
                <FeedItem 
                  product={product} 
                  isActive={isActive} 
                  shouldRender={shouldRender} 
                  onFinished={scrollToNextItem}
                  isPaused={isUserInteracting || isAutoScrolling}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}