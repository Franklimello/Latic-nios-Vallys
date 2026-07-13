"use client";

import Image from "next/image";
import { useState } from "react";
import { X, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { createPortal } from "react-dom";
import { getCategoryStyle } from "@/interfaces/catalog";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const style = getCategoryStyle(product.category);

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      `Olá! Gostaria de saber mais informações sobre o produto: *${product.name}* (Linha: ${product.category}).`
    );
    window.open(`https://wa.me/5533999838182?text=${text}`, "_blank");
  };

  return (
    <>
      <article className="group relative w-full h-[395px] select-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5">
        {/* Main Card Body (Rounded top and bottom, but right side is shorter) */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-[96%] rounded-[24px] p-4 sm:p-5 pb-8 flex flex-col justify-between overflow-hidden",
          style.cardBg
        )}>
          {/* Transparent Image Container */}
          <div className="relative w-[calc(100%+32px)] -mx-4 sm:w-[calc(100%+40px)] sm:-mx-5 h-[220px] sm:h-[260px] flex items-center justify-center mb-1 group-hover:scale-[1.12] transition-transform duration-300">
            <Image
              src={product.image || "/logo.png"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-contain"
            />
          </div>

          {/* Text Details (Pushed slightly up to prevent overlap with the tab) */}
          <div className="flex flex-col items-start text-left w-full pb-0">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wide mb-1">
              {product.price || "Consulte"}
            </span>
            <h3 className="text-[17px] font-extrabold text-white leading-snug line-clamp-2 min-h-[48px]">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Tab Extension on the bottom left (Holds the button) */}
        <div className={cn(
          "absolute bottom-0 left-0 w-[70%] h-[12%] rounded-b-[24px] flex items-center justify-center p-2 pb-2.5",
          style.cardBg
        )}>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="w-full h-8 flex items-center justify-center rounded-[10px] bg-[#1a1a4e] hover:bg-[#00b1f4] text-white font-bold text-[13px] tracking-wide transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            Detalhes
          </button>
        </div>
      </article>

      {/* Details Modal using React Portal */}
      {showModal && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className={cn(
              "relative w-full max-w-lg md:max-w-4xl lg:max-w-5xl xl:max-w-6xl rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] overflow-y-auto text-white",
              style.cardBg
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors shadow-sm cursor-pointer backdrop-blur-sm"
            >
              <X size={22} />
            </button>

            {/* Modal Left Side (Image) */}
            <div className="relative w-full md:w-[58%] min-h-[380px] sm:min-h-[440px] md:min-h-[500px] lg:min-h-[600px] bg-black/10 flex items-center justify-center p-8 md:p-12 lg:p-16">
              <div className="absolute inset-0 animate-product-drop">
                <Image
                  src={product.image || "/logo.png"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 500px, 800px"
                  className="object-contain p-4 md:p-8"
                />
              </div>
            </div>

            {/* Modal Right Side (Content) */}
            <div className="w-full md:w-[42%] p-6 md:p-10 lg:p-12 xl:p-16 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4 bg-white/20 text-white">
                  {product.category === "Iogurtes" || product.category === "Iogurte" ? "Bebida Láctea" : product.category}
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-2 md:mb-4">
                  {product.name}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl font-extrabold text-yellow-300 mb-4 md:mb-6">
                  {product.price || "Sob Consulta"}
                </p>
                <div className="border-t border-white/20 pt-4 md:pt-6 mb-6 md:mb-8">
                  <button 
                    type="button"
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="flex items-center justify-between w-full text-left focus:outline-none group/desc cursor-pointer"
                  >
                    <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/60 group-hover/desc:text-white transition-colors">Descrição</h4>
                    <div className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all px-2.5 py-1 rounded-lg text-xs font-bold">
                      <span>{descExpanded ? "Recolher" : "Ver Detalhes"}</span>
                      {descExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>
                  {descExpanded && (
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed text-white/95 max-h-[150px] md:max-h-[250px] lg:max-h-[350px] overflow-y-auto pr-2 mt-4 animate-in fade-in slide-in-from-top-3 duration-300">
                      {product.description || "Sem descrição disponível."}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button (WhatsApp) */}
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full h-12 md:h-14 flex items-center justify-center gap-2 rounded-[12px] bg-[#25D366] text-white font-bold text-[15px] md:text-lg hover:bg-[#20ba5a] active:scale-95 transition-all shadow-lg shadow-black/20 cursor-pointer mt-4 md:mt-6"
              >
                <MessageCircle size={20} />
                Fazer Pedido / WhatsApp
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
