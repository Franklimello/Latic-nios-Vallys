"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({ children }) {
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
    <div className="relative group w-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Arrow Left */}
      {showLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-16px] top-[50%] -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[#2d2d8e] transition-all hover:bg-[#2d2d8e] hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="stroke-[2.5]" />
        </button>
      )}

      {/* Carousel Viewport */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex overflow-x-auto gap-6 scroll-smooth snap-x snap-mandatory py-6 px-4 items-center"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {React.Children.map(children, (child, index) => {
          const isCenter = centerIndices.includes(index);
          return (
            <div
              key={index}
              className={`transition-all duration-500 ease-out transform ${
                isCenter 
                  ? "scale-[1.03] opacity-100 z-10" 
                  : "scale-[0.93] opacity-70"
              } flex shrink-0`}
            >
              {child}
            </div>
          );
        })}
      </div>

      {/* Arrow Right */}
      {showRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-[-16px] top-[50%] -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] text-[#2d2d8e] transition-all hover:bg-[#2d2d8e] hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
