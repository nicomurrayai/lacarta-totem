"use client";

import { useEffect, useState, useRef, useMemo, useCallback, memo } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Menu, X, Grid3x3, Smartphone, ExternalLink } from "lucide-react";
import Link from "next/link";
import { FeedItemProps } from "@/types/types";

// Tipado extendido para incluir las nuevas props de control
interface EnhancedFeedItemProps extends FeedItemProps {
  onFinished: () => void;
  isPaused: boolean;
}

const MenuHeader = memo(({
  categories,
  selectedCategory,
  setSelectedCategory,
  allowGridView,
  viewMode,
  handleViewModeToggle,
  setIsMenuOpen
}: any) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 pt-4 pb-2 pointer-events-none">
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2 pr-[20%] snap-x snap-mandatory px-4 pointer-events-auto">
        {categories.map((category: string) => (
          <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === category ? "bg-white text-black shadow-md" : "bg-black/60 text-white"}`}>
            {category}
          </button>
        ))}
      </div>

      <div className={`flex items-center ${allowGridView ? "justify-between" : "justify-end"}  px-4 pointer-events-auto`}>
        {allowGridView && (
          <button onClick={handleViewModeToggle} className="p-1 rounded-lg bg-black/60 flex items-center justify-center">
            {viewMode === "feed" ? <Grid3x3 className="size-6 text-white" /> : <Smartphone className="size-6 text-white" />}
          </button>
        )}

        <button onClick={() => setIsMenuOpen(true)} className="p-1 rounded-lg bg-black/60 flex items-center justify-center">
          <Menu className="size-6 text-white " />
        </button>
      </div>
    </header>
  );
});

MenuHeader.displayName = "MenuHeader";

// ------------------------------------------------------------------
// COMPONENTE FEED ITEM (Lógica de autoscroll y videos)
// ------------------------------------------------------------------
const FeedItem = memo(({ product, isActive, shouldRender, bgColor, textColor, onFinished, isPaused }: EnhancedFeedItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isImage = product.contentType.startsWith("image");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Manejo de Videos (Play/Pause y onEnded)
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && !isPaused) {
        // Reproducir solo si está activo y NO pausado por el usuario
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {});
        }
    } else {
        videoRef.current.pause();
    }
  }, [isActive, isPaused]);

  // 2. Manejo de Imágenes (Timer de 4 segundos)
  useEffect(() => {
    // Limpiar timer anterior siempre
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isActive && isImage && !isPaused) {
      timerRef.current = setTimeout(() => {
        onFinished();
      }, 4000); // 4 segundos por imagen
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
                loop={false} // Importante: No loop para que funcione el onEnded
                muted 
                playsInline 
                preload="metadata" 
                src={product.contentUrl}
                onEnded={onFinished} // Notificar al padre cuando termina el video
            />
          )}
          <div className="absolute bottom-0 w-full h-[40%] bg-linear-to-b from-transparent to-black pointer-events-none" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-900/20" />
      )}

      {/* Información del producto */}
      <div className="relative h-full flex flex-col justify-end pb-12 px-6 pointer-events-none">
        <div className="mb-2 pointer-events-auto">
          <span className="inline-block px-4 py-1 rounded-full font-bold text-base shadow-lg" style={{ backgroundColor: bgColor, color: textColor }}>
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
  // Optimization check
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.shouldRender !== nextProps.shouldRender) return false;
  if (prevProps.isPaused !== nextProps.isPaused) return false; // Re-render si cambia el estado de pausa

  return (
    prevProps.product._id === nextProps.product._id
  );
});

FeedItem.displayName = "FeedItem";

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------------

export default function MenuPage() {
  const { slug } = useParams<{ slug: string }>();

  // ------------- QUERIES -------------
  const business = useQuery(api.business.getBusinessBySlug, { slug });

  // ------------- BUSINESS CONFIGURATION -------------
  const products = business?.products ?? null;
  const bgColor = business?.backgroundColor ?? "#ed3b00";
  const textColor = business?.foregroundColor ?? "#ffffff";
  const tagsToFilter = business?.filterByTags ?? null;
  const allowGridView = business?.allowGridView ?? null;
  const defaultView = business?.defaultView ?? "feed";
  const categoryOrder = business?.categoryOrder ?? null;

  // ------------- STATES -------------
  const [viewMode, setViewMode] = useState<"feed" | "grid">("feed");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [isViewInitialized, setIsViewInitialized] = useState(false);
  
  // New State: Interaction handling
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  // ------------- REFS -------------
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // ------------- USE EFFECTS -------------

  useEffect(() => {
    if (!business || isViewInitialized) return;
    const initial = allowGridView && defaultView === "grid" ? "grid" : "feed";
    setViewMode(initial);
    setIsViewInitialized(true);
  }, [business, defaultView, allowGridView, isViewInitialized]);

  // Observer Logic
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, filteredProducts.length);
  }, [products, selectedCategory]); // eslint-disable-line

  useEffect(() => {
    if (viewMode !== "feed") return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!isNaN(index)) {
            setCurrentVisibleIndex(index);
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

    return () => observerRef.current?.disconnect();
  }, [viewMode, products, selectedCategory]); // eslint-disable-line

  // ------------- LOGIC: DATA HANDLING -------------
  const categoriesRef = useRef<string[]>([]);
  const categories = useMemo(() => {
    if (!products) return categoriesRef.current;
    
    // Simplificación de lógica para el ejemplo
    const matchesTag = (p: any) => !tagsToFilter?.length || (p.tags && p.tags.some((t: string) => tagsToFilter.includes(t)));
    const filtered = products.filter((p: any) => p.show && matchesTag(p));
    const cats = Array.from(new Set(filtered.map((p: any) => p.category))) as string[];
    
    let result = cats;
    if (categoryOrder?.length) {
        result = [...categoryOrder.filter((c: string) => cats.includes(c)), ...cats.filter(c => !categoryOrder.includes(c))];
    }
    
    if (JSON.stringify(categoriesRef.current) !== JSON.stringify(result)) {
        categoriesRef.current = result;
    }
    return categoriesRef.current;
  }, [products, categoryOrder, tagsToFilter]);

  const activeCategory = selectedCategory ?? categories[0];

  const filteredProducts = useMemo(() => {
    if (!products || !activeCategory) return [];
    const matchesTag = (p: any) => !tagsToFilter?.length || (p.tags && p.tags.some((t: string) => tagsToFilter.includes(t)));
    return products.filter((p: any) => p.show && matchesTag(p) && p.category === activeCategory);
  }, [products, activeCategory, tagsToFilter]);

  // ------------- LOGIC: AUTO SCROLL & INTERACTION -------------

  const scrollToNextItem = useCallback(() => {
    if (filteredProducts.length === 0) return;

    let nextIndex = currentVisibleIndex + 1;
    
    // Si llegamos al final, volvemos al principio (índice 0)
    if (nextIndex >= filteredProducts.length) {
      nextIndex = 0;
    }

    const element = itemsRef.current[nextIndex];
    if (element) {
        // Usamos smooth para que se vea el retroceso (o instant si prefieres un salto brusco)
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentVisibleIndex, filteredProducts.length]);

  const handleInteractionStart = () => setIsUserInteracting(true);
  const handleInteractionEnd = () => setIsUserInteracting(false);

  const handleGridItemClick = (index: number) => {
    setViewMode("feed");
    setCurrentVisibleIndex(index);
    setTimeout(() => {
      const element = itemsRef.current[index];
      if (element) {
        element.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }, 50);
  };

  const handleViewModeToggle = useCallback(() => {
    setViewMode(prev => prev === "feed" ? "grid" : "feed");
  }, []);

  // ------------ RENDER -------------
  return (
    <div className="fixed inset-0 bg-white">
      <div className="max-w-107.5 mx-auto h-full bg-black/90 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
        
        <MenuHeader
          categories={categories}
          selectedCategory={activeCategory}
          setSelectedCategory={setSelectedCategory}
          allowGridView={allowGridView}
          viewMode={viewMode}
          handleViewModeToggle={handleViewModeToggle}
          setIsMenuOpen={setIsMenuOpen}
        />

        {/* --- OVERLAY BOTÓN VER CARTA (Solo visible al tocar) --- */}
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

        {/* Sidebar Menu (Igual que antes) */}
        <div className={`absolute inset-0 bg-black/10 backdrop-blur-md z-30 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)}>
          <div className={`absolute right-0 top-0 h-full w-72 bg-black/40 shadow-2xl transform transition-transform duration-300 rounded-xl ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-white">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-white/80 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-2">
                {categories.map(c => (
                  <button key={c} onClick={() => { setSelectedCategory(c); setIsMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${activeCategory === c ? "bg-white/20 text-white shadow-sm" : "text-white/80 hover:bg-white/10"}`}
                  >
                    {c}
                  </button>
                ))}
              </nav>
              <div className="border-t border-white/10 pt-4 mt-4 shrink-0">
                <Link href="https://www.lacartaa.com/" className="block text-xs text-white/70 mt-10" target="_blank">
                  Creado por <span className="font-bold text-white">La<span className="text-primary font-bold">Carta!</span></span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* VISTA GRID */}
        {viewMode === "grid" && (
          <div className="h-dvh overflow-y-auto bg-black pt-0">
            <div className="grid grid-cols-3 gap-0.5">
              {filteredProducts.map((product: any, index: number) => (
                <div key={product._id} onClick={() => handleGridItemClick(index)} className="relative aspect-1/2 bg-gray-900 overflow-hidden cursor-pointer">
                   {product.contentType.startsWith("image") ? (
                    <Image fill className="object-cover" src={product.contentUrl} alt="grid-img" sizes="33vw" unoptimized />
                  ) : (
                    <video className="absolute inset-0 w-full h-full object-cover" muted src={`${product.contentUrl}#t=0.001`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA FEED (Con handlers de toque) */}
        {viewMode === "feed" && (
          <div 
            ref={scrollContainerRef} 
            className="h-dvh overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
            // Eventos para detectar interacción del usuario
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onMouseDown={handleInteractionStart} // Para testing en desktop
            onMouseUp={handleInteractionEnd}     // Para testing en desktop
          >
            {filteredProducts.map((product: any, index: number) => {
              const isActive = index === currentVisibleIndex;
              const shouldRender = index >= currentVisibleIndex - 1 && index <= currentVisibleIndex + 1;

              return (
                <div key={(product as any)._id} ref={(el) => { itemsRef.current[index] = el; }} data-index={index} className="snap-start h-dvh w-full">
                  <FeedItem 
                    product={product} 
                    isActive={isActive} 
                    shouldRender={shouldRender} 
                    bgColor={bgColor} 
                    textColor={textColor}
                    // Props nuevas para lógica de scroll
                    onFinished={scrollToNextItem}
                    isPaused={isUserInteracting}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}