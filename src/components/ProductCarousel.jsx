"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Bike } from "lucide-react";
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
        className="no-scrollbar flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth snap-x snap-mandatory pt-20 pb-6 px-10 sm:px-6 items-center w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child, index) => {
          const isCenter = centerIndices.includes(index);
          return (
            <div
              key={index}
              className={`transition-all duration-500 ease-out transform ${
                isCenter 
                  ? "scale-[1.03] -translate-y-12 opacity-100 z-10" 
                  : "scale-[0.93] translate-y-3 opacity-70"
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

        <div className="text-[#1a1a4e] transition-transform hover:scale-110 duration-300">
          <Bike size={36} className="stroke-[1.8]" />
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
