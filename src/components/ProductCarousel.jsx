"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryStyle } from "@/interfaces/catalog";

export default function ProductCarousel({ children, category }) {
  const style = getCategoryStyle(category);
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [centerIndices, setCenterIndices] = useState([]);
  const ticking = useRef(false);

  const updateArrows = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  const updateCenterCards = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerCenter = rect.left + rect.width / 2;

    const childrenArray = Array.from(container.children);
    if (childrenArray.length === 0) return;

    const distances = childrenArray.map((child, index) => {
      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + childRect.width / 2;
      const distance = Math.abs(childCenter - containerCenter);
      return { index, distance };
    });

    // Sort by distance ascending
    distances.sort((a, b) => a.distance - b.distance);

    // Get the two closest card indices
    const closest = distances.slice(0, 2).map((d) => d.index);
    setCenterIndices(closest);
  }, []);

  const handleScroll = useCallback(() => {
    updateArrows();
    
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        updateCenterCards();
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [updateArrows, updateCenterCards]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      updateCenterCards();
      updateArrows();
      
      const timer1 = setTimeout(() => {
        updateCenterCards();
        updateArrows();
      }, 100);
      
      const timer2 = setTimeout(() => {
        updateCenterCards();
        updateArrows();
      }, 500);

      window.addEventListener("resize", handleScroll);
      
      return () => {
        el.removeEventListener("scroll", handleScroll);
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [children, handleScroll, updateArrows, updateCenterCards]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of the container width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group w-full flex flex-col items-center">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Carousel Viewport */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth snap-x snap-mandatory pt-4 pb-6 px-10 sm:px-6 items-stretch w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child, index) => {
          const isCenter = centerIndices.includes(index);
          return (
            <div
              key={index}
              className={`transition-all duration-500 ease-out ${
                isCenter 
                  ? "opacity-100 z-10" 
                  : "opacity-70"
              } flex shrink-0`}
            >
              {child}
            </div>
          );
        })}
      </div>

      {/* Bottom Controls (setas + bicicleta) */}
      <div className="flex items-center justify-center gap-6 -mt-7 mb-2 select-none z-20">
        <button
          onClick={() => scroll("left")}
          className={`p-2 transition-all hover:scale-110 active:scale-90 cursor-pointer ${style.text}`}
          aria-label="Anterior"
        >
          <ChevronLeft size={36} className="stroke-[3]" />
        </button>

        <div className="text-[#1a1a4e] transition-transform hover:scale-110 duration-300 relative flex items-center justify-center">
          <style>{`
            @keyframes bike-wheel-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes bike-body-bob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-0.8px); }
            }
            .animate-wheel-rear {
              animation: bike-wheel-spin 1s linear infinite;
              transform-origin: 18.5px 17.5px;
            }
            .animate-wheel-front {
              animation: bike-wheel-spin 1s linear infinite;
              transform-origin: 5.5px 17.5px;
            }
            .animate-bike-frame {
              animation: bike-body-bob 0.5s ease-in-out infinite;
              transform-origin: bottom center;
            }
          `}</style>
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {/* Roda Traseira com Raios Animados */}
            <g className="animate-wheel-rear">
              <circle cx="18.5" cy="17.5" r="3.5" />
              <line x1="18.5" y1="14" x2="18.5" y2="21" strokeWidth="1" />
              <line x1="15" y1="17.5" x2="22" y2="17.5" strokeWidth="1" />
            </g>

            {/* Roda Dianteira com Raios Animados */}
            <g className="animate-wheel-front">
              <circle cx="5.5" cy="17.5" r="3.5" />
              <line x1="5.5" y1="14" x2="5.5" y2="21" strokeWidth="1" />
              <line x1="2" y1="17.5" x2="9" y2="17.5" strokeWidth="1" />
            </g>

            {/* Quadro e Ciclista com Leve Tremor */}
            <g className="animate-bike-frame">
              <circle cx="15" cy="5" r="1" />
              <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
            </g>
          </svg>
        </div>

        <button
          onClick={() => scroll("right")}
          className={`p-2 transition-all hover:scale-110 active:scale-90 cursor-pointer ${style.text}`}
          aria-label="Próximo"
        >
          <ChevronRight size={36} className="stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
