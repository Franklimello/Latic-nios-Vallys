import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

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

const FacebookIcon = () => (
  <svg className="h-5 w-5 text-[#1877F2] fill-current transition-transform hover:scale-110" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a4e]/20 bg-[#0f0f2d] text-gray-300">
      {/* Grid Principal do Rodapé */}
      <div className="mx-auto max-w-7xl grid gap-12 px-6 py-16 md:grid-cols-[1.5fr_0.8fr_0.8fr_0.9fr] lg:px-8">
        
        {/* Coluna 1: Logo, Descrição e Redes Sociais */}
        <div className="space-y-6">
            {/* Logo Vallys em versão etiqueta */}
            <Link href="/" className="relative block w-[80px] h-[107px] animate-tag-swing select-none">
              <img
                src="/logo-tag.png"
                alt="Logo Vallys"
                className="w-full h-full object-contain"
              />
            </Link>
          <p className="max-w-xs text-sm leading-relaxed text-gray-400 font-medium">
            Produtos lácteos de excelência produzidos com rigor técnico, tecnologia de ponta e aquele inconfundível sabor da fazenda direto de Minas Gerais para sua mesa.
          </p>
                 <div className="flex gap-3">
            <a
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
              href="https://www.instagram.com/laticiniosvallys/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
              href="https://wa.me/5533999838182"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Navegação</h3>
          <div className="grid gap-2 text-sm font-medium text-gray-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">Início</Link>
            <Link href="/produtos" className="hover:text-amber-400 transition-colors">Produtos</Link>
            <Link href="/receitas" className="hover:text-amber-400 transition-colors">Receitas</Link>
            <Link href="/sobre" className="hover:text-amber-400 transition-colors">Sobre Nós</Link>
            <Link href="/contato" className="hover:text-amber-400 transition-colors">Contato</Link>
          </div>
        </div>

        {/* Coluna 3: Linhas */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Linhas de Produtos</h3>
          <div className="grid gap-2 text-sm font-medium text-gray-400">
            <Link href="/produtos?cat=Leites" className="hover:text-amber-400 transition-colors">Linha Leites</Link>
            <Link href="/produtos?cat=Queijos" className="hover:text-amber-400 transition-colors">Linha Queijos</Link>
            <Link href="/produtos?cat=Iogurtes" className="hover:text-amber-400 transition-colors">Linha Iogurtes</Link>
            <Link href="/produtos?cat=Manteigas" className="hover:text-amber-400 transition-colors">Linha Manteigas</Link>
            <span className="text-gray-500 italic">E muito mais...</span>
          </div>
        </div>

        {/* Coluna 4: Contato & Endereço */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Contato</h3>
          <div className="grid gap-4 text-sm font-medium text-gray-400">
            <span className="flex items-start gap-3">
              <Phone size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <a href="https://wa.me/5533999838182" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                (33) 99983-8182
              </a>
            </span>
            <span className="flex items-start gap-3">
              <Mail size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <a href="mailto:laticiniosvallys08@hotmail.com" className="hover:text-white transition-colors">
                laticiniosvallys08@hotmail.com
              </a>
            </span>
            <span className="flex items-start gap-3">
              <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <span>Zona Rural, Lajinha - MG, CEP 36980-000</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright e Disguised Admin Link */}
      <div className="border-t border-white/5 bg-black/20 py-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between px-6 lg:px-8 text-xs text-gray-500 font-medium">
          <div className="flex items-center">
            {/* O "©" é o botão secreto de admin com área de toque ampliada */}
            <Link href="/admin" className="text-gray-500 hover:text-gray-500 cursor-default select-none text-base px-2 py-1 -ml-2 font-medium" aria-label="Copyright">
              ©
            </Link>
            <span>{new Date().getFullYear()} Laticínio Vallys. Todos os direitos reservados.</span>
          </div>
          <div className="mt-2 md:mt-0">
            <span>Desenvolvido com carinho.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
