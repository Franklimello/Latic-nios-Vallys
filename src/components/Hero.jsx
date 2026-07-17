"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Efeito de digitação real (typewriter) com cursor piscando
const Typewriter = ({ text, speed = 55, delay = 0, onDone, showCursor = true }) => {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed("");
    setTyping(false);
    setDone(false);
    setCursorVisible(true);

    const startTimer = setTimeout(() => {
      setTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setTyping(false);
          setDone(true);
          if (onDone) onDone();
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, speed, delay]);

  useEffect(() => {
    if (!showCursor) { setCursorVisible(false); return; }
    if (done) {
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        setCursorVisible((v) => !v);
        blinks++;
        if (blinks >= 6) {
          clearInterval(blinkInterval);
          setCursorVisible(false);
        }
      }, 400);
      return () => clearInterval(blinkInterval);
    }
    const blinkInterval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, [done, showCursor]);

  return (
    <>
      {displayed}
      {showCursor && (typing || !done || cursorVisible) && (
        <span
          className="inline-block font-light"
          style={{ opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s" }}
        >
          |
        </span>
      )}
    </>
  );
};

export default function Hero({ slides, heroStyle }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimer = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPlaying) {
      autoplayTimer.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isPlaying, nextSlide]);

  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [slides, currentSlide]);

  const slide = slides[currentSlide] || {
    image: "/logo.png",
    titleLeft: "",
    subtitleLeft: "",
    textRight: "",
    badge: "",
  };

  // STYLE 1: Current default hero
  if (heroStyle === "style1" || !heroStyle) {
    return (
      <section 
        className="relative bg-[#00b1f4] overflow-hidden min-h-0 md:min-h-[calc(100vh-96px-6px)] lg:min-h-[calc(100vh-172px)] flex flex-col md:flex-row md:items-center justify-center select-none"
      >
        <div className="w-full relative h-[380px] xs:h-[420px] sm:h-[480px] md:absolute md:inset-0 md:w-full md:h-full z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full h-full"
            >
              <Image src={slide.image} alt={slide.titleLeft} fill sizes="100vw" className="object-cover" priority />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />
        <div className="relative z-10 w-full h-full pt-[20px] md:absolute md:inset-0 pb-16 md:pb-24 px-0 md:px-12 lg:px-16 max-w-[1440px] mx-auto flex items-center md:items-end">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} className="w-full flex flex-col md:items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-left w-full space-y-3 md:space-y-5 z-10 flex flex-col items-start px-6 pb-16 md:p-0 md:max-w-xl"
              >
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    {slide.badge}
                  </div>
                )}
                <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-none drop-shadow-sm">
                    <Typewriter key={`title-${currentSlide}`} text={slide.titleLeft} speed={50} delay={200} showCursor={false} />
                  </h2>
                  <span className="font-caveat text-yellow-300 text-4xl sm:text-5xl md:text-6xl tracking-wide rotate-[-2.5deg] inline-block drop-shadow-md origin-left pt-1">
                    <Typewriter key={`sub-${currentSlide}`} text={slide.subtitleLeft} speed={45} delay={900} showCursor={false} />
                  </span>
                </div>
                <div className="pt-2 md:pt-4 flex flex-wrap gap-3">
                  <Button asChild size="md" className="bg-white font-semibold text-[#00b1f4] shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <Link href="/produtos" className="flex items-center gap-2">Ver produtos<ArrowRight size={16} /></Link>
                  </Button>
                  <Button asChild size="md" className="border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer">
                    <Link href="/receitas">Explorar receitas</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 md:left-6 top-[135px] sm:top-[180px] md:top-1/2 z-30 -translate-y-1/2 bg-black/25 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-1 md:p-0 rounded-full text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer" aria-label="Slide anterior">
          <ChevronLeft size={36} className="stroke-[1.5] md:w-[48px] md:h-[48px]" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 md:right-6 top-[135px] sm:top-[180px] md:top-1/2 z-30 -translate-y-1/2 bg-black/25 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-1 md:p-0 rounded-full text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer" aria-label="Próximo slide">
          <ChevronRight size={36} className="stroke-[1.5] md:w-[48px] md:h-[48px]" />
        </button>
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button key={index} onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }} className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === index ? "w-8 bg-yellow-300" : "w-2.5 bg-white/40 hover:bg-white/60"}`} aria-label={`Ir para slide ${index + 1}`} />
          ))}
        </div>
      </section>
    );
  }

  // STYLE 2: Modern Overlap Premium Design
  if (heroStyle === "style2") {
    return (
      <section 
        className="relative bg-[#f8fafc] overflow-hidden min-h-[500px] md:min-h-[calc(100vh-96px)] flex items-center select-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f0f7ff] to-[#e0f2fe] z-0" />
        
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center relative z-10 py-12 md:py-0">
          
          <div className="w-full md:w-1/2 md:pr-12 order-2 md:order-1 relative z-20 mt-12 md:mt-0">
            <AnimatePresence mode="wait">
              <motion.div key={currentSlide} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="space-y-6">
                {slide.badge && (
                  <span className="inline-block bg-white text-[#00b1f4] shadow-sm tracking-widest text-xs font-bold uppercase px-4 py-2 rounded-full border border-[#00b1f4]/20">
                    {slide.badge}
                  </span>
                )}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                  {slide.titleLeft}
                </h2>
                <p className="text-xl md:text-2xl text-slate-600 font-medium">
                  {slide.subtitleLeft}
                </p>
                <div className="pt-6">
                  <Button asChild size="lg" className="bg-[#00b1f4] hover:bg-[#009bd6] text-white rounded-full shadow-lg shadow-[#00b1f4]/30 px-8 h-14 text-lg">
                    <Link href="/produtos" className="flex items-center gap-2">Ver nosso catálogo <ArrowRight size={20} /></Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex gap-2">
                <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-105 transition-all text-slate-700">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:scale-105 transition-all text-slate-700">
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2.5 rounded-full transition-all ${currentSlide === index ? "w-10 bg-[#00b1f4]" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[350px] sm:h-[450px] md:h-[600px] order-1 md:order-2 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#00b1f4]/30 to-amber-300/30 rounded-[2.5rem] transform rotate-3 scale-105 blur-xl z-0" />
             <AnimatePresence mode="wait">
               <motion.div key={currentSlide} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white z-10 bg-white">
                 <Image src={slide.image} alt={slide.titleLeft} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
               </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </section>
    );
  }

  // STYLE 3: Centered classical look with overlay
  return (
    <section 
      className="relative overflow-hidden min-h-[500px] md:min-h-[calc(100vh-120px)] flex items-center justify-center select-none"
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="relative w-full h-full">
            <Image src={slide.image} alt={slide.titleLeft} fill sizes="100vw" className="object-cover" priority />
            <div className="absolute inset-0 bg-black/50" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            {slide.badge && (
              <span className="mb-4 inline-block border border-white/40 text-white uppercase tracking-widest text-xs px-6 py-2 rounded-full">
                {slide.badge}
              </span>
            )}
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-xl mb-4 font-serif">
              {slide.titleLeft}
            </h2>
            <p className="text-2xl md:text-3xl text-amber-300 font-caveat mb-8 drop-shadow-md">
              {slide.subtitleLeft}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8">
                <Link href="/produtos">Nossos Produtos</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-30">
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentSlide === index ? "bg-amber-500 scale-125" : "bg-white/50 hover:bg-white/80"}`} aria-label={`Ir para slide ${index + 1}`} />
        ))}
      </div>
    </section>
  );
}
