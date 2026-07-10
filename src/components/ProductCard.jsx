"use client";

import Image from "next/image";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { getCategoryStyle } from "@/interfaces/catalog";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);
  const style = getCategoryStyle(product.category);

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      `Olá! Gostaria de saber mais informações sobre o produto: *${product.name}* (Linha: ${product.category}).`
    );
    window.open(`https://wa.me/5500000000000?text=${text}`, "_blank");
  };

  return (
    <>
      <article className="group relative w-full h-[395px] select-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5">
        {/* Main Card Body (Rounded top and bottom, but right side is shorter) */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-[96%] rounded-[24px] p-4 sm:p-5 pb-10 flex flex-col justify-between overflow-hidden",
          style.cardBg
        )}>
          {/* Transparent Image Container */}
          <div className="relative aspect-square w-[calc(100%+32px)] -mx-4 sm:w-[calc(100%+40px)] sm:-mx-5 flex items-center justify-center mb-2 group-hover:scale-[1.12] transition-transform duration-300">
            <Image
              src={product.image || "/logo.png"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-contain"
            />
          </div>

          {/* Text Details (Pushed slightly up to prevent overlap with the tab) */}
          <div className="flex flex-col items-start text-left w-full pb-8">
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
            className="w-full h-8 flex items-center justify-center rounded-[10px] bg-[#1a1a4e] hover:bg-[#2d2d8e] text-white font-bold text-[13px] tracking-wide transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
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
            className="relative w-full max-w-2xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/85 hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors shadow-sm cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Left Side (Image) */}
            <div className="relative w-full md:w-1/2 min-h-[300px] md:h-auto bg-gray-50 flex items-center justify-center p-8">
              <Image
                src={product.image || "/logo.png"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain p-4"
              />
            </div>

            {/* Modal Right Side (Content) */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${getCategoryStyle(product.category).badge}`}>
                  {product.category}
                </span>
                <h2 className="text-2xl font-extrabold text-[#1a1a4e] leading-tight mb-2">
                  {product.name}
                </h2>
                <p className="text-lg font-bold text-orange-500 mb-4">
                  {product.price || "Sob Consulta"}
                </p>
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Descrição</h4>
                  <p className="text-sm leading-relaxed text-gray-600 max-h-[180px] overflow-y-auto pr-2 animate-in fade-in">
                    {product.description || "Sem descrição disponível."}
                  </p>
                </div>
              </div>

              {/* Action Button (WhatsApp) */}
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-[12px] bg-[#25D366] text-white font-bold text-[15px] hover:bg-[#20ba5a] active:scale-95 transition-all shadow-md shadow-emerald-500/10 cursor-pointer mt-4"
              >
                <MessageCircle size={18} />
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
