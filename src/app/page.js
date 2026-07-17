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
import { useAboutImages } from "@/hooks/useAboutImages";
import ProductCarousel from "@/components/ProductCarousel";

import { getCategoryStyle, demoHighlights, productCategories } from "@/interfaces/catalog";
import { useSettings } from "@/contexts/SettingsContext";
import Hero from "@/components/Hero";


export default function Home() {
  const { settings } = useSettings();

  
  const recipeScrollRef = useRef(null);
  const [activeRecipeIndex, setActiveRecipeIndex] = useState(0);

  const handleRecipeScroll = useCallback((e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveRecipeIndex(index);
    }
  }, []);

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
  const { images: aboutImages } = useAboutImages();

  const [currentAboutIdx, setCurrentAboutIdx] = useState(0);
  useEffect(() => {
    if (aboutImages && aboutImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentAboutIdx((prev) => (prev + 1) % aboutImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [aboutImages]);

  const activeAboutImage = aboutImages && aboutImages.length > 0 ? aboutImages[currentAboutIdx].image : "/sobre.png";

  const slides = useMemo(() => {
    return highlights.length > 0 ? highlights : demoHighlights;
  }, [highlights]);

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const initial = {};
      products.forEach((product) => {
        let cat = product.category || "Outros";
        if (cat === "Iogurtes") {
          cat = "Bebidas Lácteas";
        }
        if (initial[cat] === undefined) {
          initial[cat] = false;
        }
      });
      setExpandedCategories(initial);
    }
  }, [products]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Group products by category
  const productsByCategory = useMemo(() => {
    const groups = {};
    products.forEach((product) => {
      let cat = product.category || "Outros";
      if (cat === "Iogurtes") {
        cat = "Bebidas Lácteas";
      }
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(product);
    });
    return groups;
  }, [products]);

  // Extract YouTube ID helper
  const youtubeVideoId = useMemo(() => {
    if (!settings?.homeYoutubeVideo) return null;
    const url = settings.homeYoutubeVideo;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, [settings?.homeYoutubeVideo]);

  return (
    <div>
      {/* HERO CAROUSEL COMPONENT */}
      <Hero slides={slides} heroStyle={settings?.heroStyle} />

      {/* VÍDEO DO YOUTUBE */}
      {youtubeVideoId && (
        <section className="bg-[#f8fafc] py-16 border-b border-gray-100">
          <div className="mx-auto max-w-5xl px-6 lg:px-8 flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-[#7c1421] md:text-4xl uppercase tracking-tight mb-8 text-center">
              Conheça Nossa História
            </h2>
            <div className="w-full relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

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
            <Button asChild className="bg-[#00b1f4] text-white">
              <Link href="/admin">Cadastrar Produtos</Link>
            </Button>
          </div>
        ) : (
          Object.entries(productsByCategory)
            .filter(([category]) => productCategories.includes(category))
            .map(([category, items]) => {
              const isExpanded = !!expandedCategories[category];
              const style = getCategoryStyle(category);
            return (
              <div key={category} className="mb-16">
                {/* Category Title & Toggle Button */}
                <div 
                  className="flex flex-col items-center text-center mb-8 cursor-pointer group select-none"
                  onClick={() => toggleCategory(category)}
                >
                  <div className="w-24 h-24 relative mb-4 hover:scale-110 transition-transform duration-300">
                    <Image
                      src={category.includes("Queijo") ? "/icons/queijos.png" : category.includes("Bebida") || category.includes("Iogurte") ? "/icons/bebidas.png" : category.includes("Manteiga") ? "/icons/manteigas.png" : "/logo.png"}
                      alt={`Ícone ${category}`}
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>
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

      {/* SEÇÃO SOBRE (Resumo Dinâmico) */}
      {(settings?.aboutStyle === "style1" || !settings?.aboutStyle) && (
      <section className="bg-white border-t border-gray-100 flex flex-col">
        {/* Carrossel Full-Width */}
        <div className="w-full relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
          <AnimatePresence initial={false}>
            <motion.div 
              key={activeAboutImage} 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }} 
              transition={{ duration: 0.8, ease: "easeInOut" }} 
              className="absolute inset-0"
            >
              <Image
                src={activeAboutImage}
                alt="Fábrica Laticínios Vallys"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Texto Descritivo Centrado */}
        <div className="mx-auto max-w-4xl px-6 py-20 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-amber-500">
              Quem Somos
            </p>
            <h2 className="text-4xl font-extrabold text-[#7c1421] sm:text-5xl uppercase tracking-tight">
              Laticínios Vallys
            </h2>
            <div className="h-[4px] w-[80px] bg-[#7c1421] rounded-full mx-auto"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 text-lg leading-relaxed text-muted font-medium mx-auto"
          >
            <p>
              {settings?.aboutHistoryText1 || "Fundado em 2007, o Laticínios Vallys vem, desde então, investindo continuamente na modernização de sua estrutura, na inovação de seus processos e na utilização de equipamentos de alta tecnologia. Nosso compromisso é oferecer produtos de excelência, levando aos consumidores qualidade, sabor e confiança em cada produto."}
            </p>
            <p>
              {settings?.aboutHistoryText2 || "Temos orgulho de fazer parte da história de Lajinha (MG), contribuindo para o desenvolvimento da região e consolidando nossa marca como referência no setor de laticínios."}
            </p>
          </motion.div>

          {/* Destaques rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-[#00b1f4]">2007</span>
              <span className="text-xs md:text-sm text-muted font-bold uppercase tracking-wider">Fundação</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-[#00b1f4]">Lajinha</span>
              <span className="text-xs md:text-sm text-muted font-bold uppercase tracking-wider">Origem (MG)</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-[#00b1f4]">100%</span>
              <span className="text-xs md:text-sm text-muted font-bold uppercase tracking-wider">Qualidade</span>
            </div>
          </motion.div>
        </div>

          {/* Missão, Visão e Valores */}
          <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
            <div className="pt-16 border-t border-gray-100 grid gap-12 md:grid-cols-3">
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
                Ser referência no setor de laticínios pela qualidade dos produtos, inovação contínua e valorização de colaboradores e parceiros.
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
              <div className="inline-flex items-center justify-center p-4 bg-[#00b1f4]/10 rounded-full text-[#00b1f4] transition-transform duration-300 hover:scale-110">
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
      )}

      {settings?.aboutStyle === "style2" && (
        <section className="bg-[#f8fafc] py-20 relative overflow-hidden border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold tracking-widest uppercase">Tradição & Qualidade</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Laticínios Vallys</h2>
                <p className="text-xl text-[#00b1f4] font-medium leading-relaxed">
                  Fundado em 2007, investimos continuamente na modernização de nossa estrutura e processos.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Temos orgulho de fazer parte da história de Lajinha (MG), consolidando nossa marca como referência no setor de laticínios, levando sabor e confiança em cada produto.
                </p>
                <Button asChild size="lg" className="mt-6 bg-[#00b1f4] hover:bg-[#009bd6] text-white rounded-full shadow-lg px-8">
                  <Link href="/sobre">Conheça nossa história completa</Link>
                </Button>
              </div>
              <div className="order-1 lg:order-2 relative h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
                <AnimatePresence mode="wait">
                  <motion.div key={activeAboutImage} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
                    <Image src={activeAboutImage} alt="Laticínios Vallys" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      )}

      {settings?.aboutStyle === "style3" && (
        <section className="bg-gray-900 py-32 text-white relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={activeAboutImage} initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
              <Image src={activeAboutImage} alt="Fundo Sobre" fill className="object-cover" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center space-y-10">
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-amber-500 drop-shadow-xl">Nossa Essência</h2>
            <p className="text-2xl md:text-3xl text-gray-300 font-light mx-auto leading-relaxed">
              Uma jornada de dedicação iniciada em Lajinha (MG), com o propósito de levar o verdadeiro sabor do campo até a sua mesa.
            </p>
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-none px-12 py-6 text-lg uppercase tracking-widest mt-8 border-2 border-amber-500 transition-all hover:bg-transparent hover:text-amber-500">
              <Link href="/sobre">Descubra Nossa História</Link>
            </Button>
          </div>
        </section>
      )}

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
            <div className="flex justify-center mt-3 text-sky-400 select-none pointer-events-none">
              <style>{`
                @keyframes spoon-stir {
                  0% { transform: translate(0, 0) rotate(0deg); }
                  25% { transform: translate(1.5px, -1.5px) rotate(6deg); }
                  50% { transform: translate(3px, 0.5px) rotate(12deg); }
                  75% { transform: translate(1px, 2px) rotate(6deg); }
                  100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes steam-rise {
                  0% { opacity: 0; transform: translateY(2px) scaleX(0.9); }
                  50% { opacity: 0.7; transform: translateY(-3px) scaleX(1.1); }
                  100% { opacity: 0; transform: translateY(-8px) scaleX(0.8); }
                }
                .stirring-spoon {
                  animation: spoon-stir 1.8s ease-in-out infinite;
                  transform-origin: 26px 12px;
                }
                .steam-line-1 {
                  animation: steam-rise 2s ease-in-out infinite;
                }
                .steam-line-2 {
                  animation: steam-rise 2s ease-in-out infinite 1s;
                }
              `}</style>
              <svg width="56" height="56" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                {/* Steam lines */}
                <path d="M17 15c0.5-2.5-0.5-4 0-6" strokeWidth="1.5" className="steam-line-1 text-sky-300" />
                <path d="M23 14c0.5-2.5-0.5-4 0-6" strokeWidth="1.5" className="steam-line-2 text-sky-300" />

                {/* Bowl Rim */}
                <ellipse cx="20" cy="21" rx="11" ry="3" />

                {/* Bowl Body */}
                <path d="M9 21c0 8 5.5 11 11 11s11-3 11-11" />

                {/* Spoon stirring */}
                <g className="stirring-spoon">
                  {/* Spoon Cup */}
                  <ellipse cx="17" cy="21.5" rx="3" ry="2" transform="rotate(-35 17 21.5)" fill="currentColor" fillOpacity="0.15" />
                  {/* Spoon Handle */}
                  <path d="M19 19.5l7.5-7.5" />
                </g>
              </svg>
            </div>
          </div>

          {/* Recipes Carousel Viewport */}
          <div
            ref={recipeScrollRef}
            onScroll={handleRecipeScroll}
            className="no-scrollbar flex overflow-x-auto gap-0 scroll-smooth snap-x snap-mandatory pb-6 w-full max-w-[300px] sm:max-w-[340px] md:max-w-4xl mx-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {!recipesLoading && recipes.map((recipe, i) => {
              const words = recipe.title.split(" ");
              const firstWord = words[0].toUpperCase();
              const restOfTitle = words.slice(1).join(" ").toLowerCase();
              const isActive = activeRecipeIndex === i;

              // Letter-by-letter stagger variants
              const containerVariants = {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.04, delayChildren: 0.05 },
                },
              };

              const childVariants = {
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 150,
                  },
                },
                hidden: {
                  opacity: 0,
                  y: 15,
                  transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 150,
                  },
                },
              };

              return (
                <div
                  key={recipe.id}
                  className="w-full shrink-0 snap-center flex justify-center px-4"
                >
                  <div className="w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-6 md:space-y-0 md:h-[240px] md:px-4">
                    {/* Title Wrapper (Col 1: Left) */}
                    <div className="space-y-1 md:w-1/3 flex flex-col items-center md:items-start shrink-0">
                      <motion.h3 
                        variants={containerVariants}
                        initial="hidden"
                        animate={isActive ? "visible" : "hidden"}
                        className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white font-sans flex flex-wrap justify-center md:justify-start gap-x-[1px]"
                      >
                        {firstWord.split("").map((letter, index) => (
                          <motion.span 
                            key={index} 
                            variants={childVariants} 
                            className="inline-block origin-bottom"
                          >
                            {letter}
                          </motion.span>
                        ))}
                      </motion.h3>
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={isActive ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 5 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="text-xs md:text-sm font-bold uppercase tracking-widest text-sky-300/80 block mt-1"
                      >
                        {restOfTitle}
                      </motion.span>
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
