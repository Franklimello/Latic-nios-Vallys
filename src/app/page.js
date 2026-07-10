"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeCheck, Sparkles, Star, Truck, ChevronLeft, ChevronRight, ChevronDown, Target, Eye, Award, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import RecipeCard from "@/components/RecipeCard";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useRecipes } from "@/hooks/useRecipes";
import { useHighlights } from "@/hooks/useHighlights";
import ProductCarousel from "@/components/ProductCarousel";
import { getCategoryStyle, demoHighlights } from "@/interfaces/catalog";



export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoplayTimer = useRef(null);
  
  const recipeScrollRef = useRef(null);

  const scrollRecipes = useCallback((direction) => {
    if (recipeScrollRef.current) {
      const { scrollLeft, clientWidth } = recipeScrollRef.current;
      const scrollTo = direction === "left"
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      recipeScrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, []);

  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { recipes, loading: recipesLoading } = useRecipes();
  const { highlights, loading: highlightsLoading } = useHighlights();

  const slides = useMemo(() => {
    return highlights.length > 0 ? highlights : demoHighlights;
  }, [highlights]);

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const initial = {};
      products.forEach((product) => {
        const cat = product.category || "Outros";
        if (initial[cat] === undefined) {
          initial[cat] = cat.toLowerCase().includes("iogurte");
        }
      });
      setExpandedCategories(initial);
    }
  }, [products]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides, currentSlide]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPlaying) {
      autoplayTimer.current = setInterval(nextSlide, 6000);
    }
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isPlaying, nextSlide]);

  const slide = slides[currentSlide] || {
    image: "/logo.png",
    titleLeft: "",
    subtitleLeft: "",
    textRight: "",
    badge: "",
  };

  // Group products by category
  const productsByCategory = useMemo(() => {
    const groups = {};
    products.forEach((product) => {
      const cat = product.category || "Outros";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(product);
    });
    return groups;
  }, [products]);

  return (
    <div>
      {/* HERO CAROUSEL */}
      <section 
        className="relative bg-[#0f0f2d] overflow-hidden min-h-0 md:min-h-[calc(100vh-96px-6px)] flex flex-col md:flex-row md:items-center justify-center select-none"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Imagem do Slide: No mobile fica no topo (relativa), no desktop vira fundo (absoluta) */}
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
              <Image
                src={slide.image}
                alt={slide.titleLeft}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
              {/* Overlay Escuro com gradiente para contraste - somente em desktop */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Grade de fundo moderna e sutil por cima da imagem */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />

        {/* Slides Content */}
        <div className="relative z-10 w-full h-full pt-[20px] md:pt-[40px] pb-16 md:py-24 px-0 md:px-12 lg:px-16 max-w-[1440px] mx-auto flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="w-full flex flex-col md:grid md:grid-cols-[1.3fr_0.7fr] md:items-center justify-between"
            >
              {/* Coluna Esquerda: Informações e Ação */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-left w-full space-y-3 md:space-y-5 z-10 flex flex-col items-start px-6 pb-16 md:p-0 md:max-w-xl"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  <Sparkles size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                  {slide.badge}
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase leading-none drop-shadow-sm">
                    {slide.titleLeft}
                  </h2>
                  <span className="font-caveat text-yellow-300 text-5xl sm:text-6xl md:text-7xl tracking-wide rotate-[-2.5deg] inline-block drop-shadow-md origin-left pt-1">
                    {slide.subtitleLeft}
                  </span>
                </div>
                
                <div className="pt-2 md:pt-4 flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="md"
                    className="bg-white font-semibold text-[#2d2d8e] shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <Link href="/produtos" className="flex items-center gap-2">
                      Ver produtos
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="md"
                    className="border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer"
                  >
                    <Link href="/receitas">Explorar receitas</Link>
                  </Button>
                </div>
              </motion.div>

              {/* Coluna Direita: Frase e Slogan de Impacto Rústico */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hidden md:flex w-full justify-center md:justify-end z-10"
              >
                <div className="rotate-[2.5deg] border-2 border-dashed border-white/30 p-6 rounded-2xl bg-black/25 backdrop-blur-md shadow-2xl max-w-[280px] text-center md:text-right hover:rotate-0 transition-transform duration-300">
                  <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest block mb-1">
                    Destaque
                  </span>
                  <h3 className="font-extrabold tracking-tighter uppercase text-white text-3xl sm:text-4xl leading-tight drop-shadow-md">
                    {slide.textRight}
                  </h3>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Setas de navegação (Estilo minimalista Dallora com fundo translúcido no mobile) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-4 md:left-6 top-[135px] sm:top-[180px] md:top-1/2 z-30 -translate-y-1/2 bg-black/25 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-1 md:p-0 rounded-full text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={36} className="stroke-[1.5] md:w-[48px] md:h-[48px]" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-4 md:right-6 top-[135px] sm:top-[180px] md:top-1/2 z-30 -translate-y-1/2 bg-black/25 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none p-1 md:p-0 rounded-full text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all pointer-events-auto cursor-pointer"
          aria-label="Próximo slide"
        >
          <ChevronRight size={36} className="stroke-[1.5] md:w-[48px] md:h-[48px]" />
        </button>

        {/* Indicadores (Dots) */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(index);
              }}
              className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === index ? "w-8 bg-yellow-300" : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* SEÇÃO DE LINHAS DE PRODUTOS */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl font-extrabold text-[#7c1421] md:text-5xl uppercase tracking-tight">
            Mais sabor em sua Vida!
          </h2>
          <p className="mt-2 text-xl font-bold text-amber-500 tracking-wide">
            Conheça nossas linhas de produtos
          </p>
          <div className="mt-4 flex h-[5px] w-[180px] rounded-full overflow-hidden">
            <div className="w-1/2 bg-orange-500"></div>
            <div className="w-1/2 bg-[#7c1421]"></div>
          </div>
        </div>

        {/* Exibição condicional de carregamento ou erro */}
        {productsLoading && (
          <p className="text-center text-muted">Carregando linhas de produtos...</p>
        )}
        
        {productsError && (
          <p className="text-center text-red-600">Erro: {productsError.message}</p>
        )}

        {/* Listagem das Categorias */}
        {!productsLoading && !productsError && products.length === 0 ? (
          <div className="flex flex-col items-center text-center bg-white border border-dashed border-gray-200 rounded-[16px] p-10 max-w-md mx-auto">
            <Sparkles size={32} className="text-amber-500 mb-4" />
            <p className="text-muted text-sm mb-4">Nenhum produto cadastrado no catálogo.</p>
            <Button asChild className="bg-[#2d2d8e] text-white">
              <Link href="/admin">Cadastrar Produtos</Link>
            </Button>
          </div>
        ) : (
          Object.entries(productsByCategory).map(([category, items]) => {
            const isExpanded = !!expandedCategories[category];
            const style = getCategoryStyle(category);
            return (
              <div key={category} className="mb-16">
                {/* Category Title & Toggle Button */}
                <div 
                  className="flex flex-col items-center text-center mb-8 cursor-pointer group select-none"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <h3 className={`font-caveat text-4xl font-semibold tracking-wide transition-colors ${style.text}`}>
                      Linha {category}
                    </h3>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`transition-colors ${style.icon}`}
                    >
                      <ChevronDown size={28} />
                    </motion.div>
                  </div>
                  <div className={`w-[120px] h-[1px] mt-2 transition-all group-hover:w-[160px] ${style.line}`} />
                  <span className="text-[11px] text-muted font-bold uppercase tracking-wider mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    {isExpanded ? "Clique para recolher" : "Clique para expandir"}
                  </span>
                </div>

                {/* Product Carousel with Premium Height Animation */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ProductCarousel category={category}>
                        {items.map((product) => (
                          <div key={product.id} className="w-[260px] sm:w-[300px] shrink-0 snap-center flex">
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </ProductCarousel>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </section>

      {/* SEÇÃO SOBRE */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Imagem do Time */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3] group"
            >
              <Image
                src="/sobre.png"
                alt="Equipe e Fábrica Laticínios Vallys"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Texto Descritivo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">
                  Quem Somos
                </p>
                <h2 className="text-3xl font-extrabold text-[#7c1421] sm:text-4xl uppercase tracking-tight">
                  Laticínios Vallys
                </h2>
                <div className="h-[4px] w-[80px] bg-[#7c1421] rounded-full"></div>
              </div>

              <div className="space-y-4 text-base leading-relaxed text-muted font-medium">
                <p>
                  Fundado em 2007, o Laticínios Vallys vem, desde então, investindo continuamente na modernização de sua estrutura, na inovação de seus processos e na utilização de equipamentos de alta tecnologia. Nosso compromisso é oferecer produtos de excelência, levando aos consumidores qualidade, sabor e confiança em cada produto.
                </p>
                <p>
                  Temos orgulho de fazer parte da história de Lajinha (MG), contribuindo para o desenvolvimento da região e consolidando nossa marca como referência no setor de laticínios.
                </p>
              </div>

              {/* Destaques rápidos */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-[#2d2d8e]">2007</span>
                  <span className="text-xs text-muted font-bold uppercase tracking-wider font-semibold">Fundação</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-[#2d2d8e]">Lajinha</span>
                  <span className="text-xs text-muted font-bold uppercase tracking-wider font-semibold">Origem (MG)</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-extrabold text-[#2d2d8e]">100%</span>
                  <span className="text-xs text-muted font-bold uppercase tracking-wider font-semibold">Qualidade</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Missão, Visão e Valores (Layout Livre, sem bordas/sombras, centralizado) */}
          <div className="mt-16 pt-16 border-t border-gray-100 grid gap-12 md:grid-cols-3">
            {/* Card Missão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full text-amber-500 transition-transform duration-300 hover:scale-110">
                <Target size={24} />
              </div>
              <h3 className="font-caveat text-4xl font-bold text-[#7c1421] tracking-wide">
                Missão
              </h3>
              <p className="text-sm leading-relaxed text-muted font-medium max-w-sm">
                Produzir alimentos lácteos de excelência, segurança e qualidade, proporcionando sabor e confiança aos nossos consumidores em cada experiência.
              </p>
            </motion.div>

            {/* Card Visão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full text-blue-500 transition-transform duration-300 hover:scale-110">
                <Eye size={24} />
              </div>
              <h3 className="font-caveat text-4xl font-bold text-[#7c1421] tracking-wide">
                Visão
              </h3>
              <p className="text-sm leading-relaxed text-muted font-medium max-w-sm">
                Ser reconhecida nacionalmente no setor de laticínios pela qualidade dos produtos, inovação contínua e valorização de colaboradores e parceiros.
              </p>
            </motion.div>

            {/* Card Valores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center p-4 bg-[#2d2d8e]/10 rounded-full text-[#2d2d8e] transition-transform duration-300 hover:scale-110">
                <Award size={24} />
              </div>
              <h3 className="font-caveat text-4xl font-bold text-[#7c1421] tracking-wide">
                Valores
              </h3>
              <p className="text-sm leading-relaxed text-muted font-medium max-w-sm">
                Garantia de qualidade, ética nas relações, inovação, sustentabilidade e valorização dos produtores rurais e colaboradores.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DIVISOR DE TRANSIÇÃO PARA RECEITAS */}
      <div className="w-full bg-white flex justify-center py-8 border-t border-gray-100 md:hidden">
        <Image
          src="/receitas-divider.png"
          alt="Utensílios de Cozinha Vallys"
          width={550}
          height={275}
          className="w-full max-w-[450px] h-auto object-contain opacity-95 px-6"
        />
      </div>

      {/* SEÇÃO RECEITAS - ESTILO DALLORA MINIMALISTA EM CARROSSEL */}
      <section className="bg-[#1a1a4e] py-20 text-white overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">
              Cozinha Vallys
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl uppercase tracking-tight text-white">
              Receitas Saudáveis
            </h2>
            <div className="h-[2px] w-[60px] bg-sky-400 mx-auto rounded-full mt-3"></div>
          </div>

          {/* Recipes Carousel Viewport */}
          <div
            ref={recipeScrollRef}
            className="no-scrollbar flex overflow-x-auto gap-0 scroll-smooth snap-x snap-mandatory pb-6 w-full max-w-[300px] sm:max-w-[340px] md:max-w-4xl mx-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {!recipesLoading && recipes.map((recipe, i) => {
              const words = recipe.title.split(" ");
              const firstWord = words[0].toUpperCase();
              const restOfTitle = words.slice(1).join(" ").toLowerCase();

              return (
                <div
                  key={recipe.id}
                  className="w-full shrink-0 snap-center flex justify-center px-4"
                >
                  <div className="w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-6 md:space-y-0 md:h-[240px] md:px-4">
                    {/* Title Wrapper (Col 1: Left) */}
                    <div className="space-y-1 md:w-1/3 flex flex-col items-center md:items-start shrink-0">
                      <h3 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white font-sans">
                        {firstWord}
                      </h3>
                      <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-sky-300/80 block">
                        {restOfTitle}
                      </span>
                    </div>

                    {/* Transparent Recipe Image (Col 2: Center) */}
                    <div className="relative aspect-[4/3] md:aspect-auto w-full max-w-[280px] md:w-1/3 md:h-full flex items-center justify-center p-2 hover:scale-105 transition-transform duration-300 shrink-0">
                      {recipe.image ? (
                        <Image
                          src={recipe.image}
                          alt={recipe.title}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 280px, 350px"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white/40">
                          Receita
                        </div>
                      )}
                    </div>

                    {/* Action Button (Col 3: Right) */}
                    <div className="md:w-1/3 flex justify-center md:justify-end items-center shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = `/receitas?id=${recipe.id}`;
                        }}
                        className="px-8 py-3.5 bg-sky-400 hover:bg-sky-500 text-[#1a1a4e] font-bold text-xs md:text-sm uppercase tracking-wider rounded-full shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
                      >
                        prepare agora
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recipes Controls */}
          <div className="flex items-center justify-center gap-6 mt-6 select-none z-20">
            <button
              onClick={() => scrollRecipes("left")}
              className="p-2 transition-all hover:scale-110 active:scale-90 cursor-pointer text-sky-400 hover:text-sky-300"
              aria-label="Anterior"
            >
              <ChevronLeft size={36} className="stroke-[3]" />
            </button>

            <div className="text-sky-400 transition-transform hover:scale-110 duration-300">
              <ChefHat size={32} className="stroke-[1.8]" />
            </div>

            <button
              onClick={() => scrollRecipes("right")}
              className="p-2 transition-all hover:scale-110 active:scale-90 cursor-pointer text-sky-400 hover:text-sky-300"
              aria-label="Próximo"
            >
              <ChevronRight size={36} className="stroke-[3]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
