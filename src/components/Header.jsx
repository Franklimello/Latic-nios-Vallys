"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/receitas", label: "Receitas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/trabalhe-conosco", label: "Trabalhe Conosco" },
  { href: "/contato", label: "Contato" },
];

const WhatsAppIcon = () => (
  <svg className="h-5 w-5 fill-[#25D366] text-[#25D366] transition-transform hover:scale-110" viewBox="0 0 24 24">
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.176-1.358a9.95 9.95 0 0 0 4.832 1.253h.005c5.507 0 9.99-4.478 9.99-9.987 0-2.67-1.037-5.18-2.92-7.062C17.198 3.037 14.683 2 12.012 2zm5.726 14.153c-.314.88-1.547 1.634-2.122 1.734-.576.101-1.3.178-3.791-.849-3.187-1.314-5.215-4.542-5.375-4.757-.16-.214-1.277-1.696-1.277-3.238 0-1.542.8-2.298 1.085-2.607.286-.31.62-.387.828-.387.207 0 .413.002.593.01.18.007.424-.07.663.504.246.593.84 2.054.912 2.202.072.148.12.32.02.518-.1.2-.15.323-.3.498-.15.174-.315.388-.45.522-.15.15-.308.314-.133.614.175.3.776 1.274 1.662 2.062.143.127.27.247.38.351.98.932 1.83 1.157 2.149 1.302.32.145.508.12.698-.098.19-.218.81-.944 1.026-1.27.217-.327.435-.272.735-.163.3.11 1.905.898 2.233 1.062.327.163.545.244.625.38.08.136.08.788-.234 1.668z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5 text-[#E1306C] fill-none stroke-[2] transition-transform hover:scale-110" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
  </svg>
);

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // "drop" = caindo de cima pra posição | "idle" = no lugar | "falling" = caindo pra baixo da tela
  const [logoState, setLogoState] = useState("hidden");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dispara a animação de entrada
  useEffect(() => {
    setLogoState("drop");
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (logoState === "falling") return; // Evita cliques duplos

    setLogoState("falling");

    // Redireciona para a página inicial
    if (pathname !== "/") {
      // Pequeno atraso para ver o início da animação de queda antes de mudar de página
      setTimeout(() => {
        router.push("/");
      }, 350);
    }
  };

  const handleFallEnd = () => {
    if (logoState === "falling") {
      // Se já estiver na página inicial, apenas faz o ciclo completo da animação
      if (pathname === "/") {
        setLogoState("hidden");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setLogoState("drop");
          });
        });
      }
    }
    if (logoState === "drop") {
      setLogoState("idle");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        open
          ? "border-b border-gray-100 bg-white shadow-none"
          : scrolled
            ? "border-b border-gray-100/50 bg-white/70 shadow-md backdrop-blur-md"
            : "border-b border-gray-100 bg-white shadow-none"
      )}
    >
      {/* Barra superior de cor dupla */}
      <div className="flex h-[6px] w-full">
        <div className="w-[30%] bg-sky-400"></div>
        <div className="w-[70%] bg-[#00b1f4]"></div>
      </div>

      <div className="mx-auto flex h-[76px] md:h-[96px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo (Esquerda) — Cai, balança, e ao clicar cai e volta */}
        <div className="relative flex w-[120px] md:w-[180px] shrink-0 justify-start items-start pt-1 md:pt-2 h-full">
          <button
            onClick={handleLogoClick}
            onAnimationEnd={handleFallEnd}
            className={cn(
              "relative z-20 block w-[85px] md:w-[115px] h-[114px] md:h-[154px] select-none cursor-pointer bg-transparent border-none p-0 focus:outline-none",
              logoState === "hidden" && "opacity-0",
              logoState === "drop" && "animate-tag-drop",
              logoState === "idle" && "animate-tag-swing",
              logoState === "falling" && "animate-tag-fall",
            )}
          >
            <img
              src="/logo-tag.png"
              alt="Logo Vallys"
              className="w-full h-full object-contain pointer-events-none"
              draggable="false"
            />
          </button>
        </div>

        {/* Menu Principal (Centralizado) */}
        <nav className="hidden items-center justify-center gap-0.5 lg:gap-2 xl:gap-3 md:flex flex-1 mx-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[8px] px-2.5 py-2 text-[13px] lg:text-base xl:text-lg lg:px-4 lg:py-3 font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-[#00b1f4] whitespace-nowrap",
                pathname === item.href && "bg-blue-50 text-[#00b1f4]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Redes Sociais (Direita) */}
        <div className="hidden items-center justify-end gap-4 md:flex shrink-0">
          <a href="https://wa.me/5533999838182" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <WhatsAppIcon />
          </a>
          <a href="https://www.instagram.com/laticiniosvallys/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        </div>

        {/* Botão de Menu Hamburguer (Mobile) */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-gray-800 hover:bg-gray-100 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Abrir menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </Button>
      </div>

      {/* Menu Mobile */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-5 shadow-lg md:hidden">
          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-[8px] px-3 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50",
                  pathname === item.href && "bg-blue-50 text-[#00b1f4]",
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center gap-6 py-4 px-3 border-t border-b border-gray-100 my-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nossas redes:</span>
              <div className="flex gap-4">
                <a href="https://wa.me/5533999838182" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
                <a href="https://www.instagram.com/laticiniosvallys/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
