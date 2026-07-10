import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const InstagramIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ size = 22 }) => (
  <svg 
    width={size} 
    height={size} 
    fill="currentColor" 
    viewBox="0 0 24 24"
  >
    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.176-1.358a9.95 9.95 0 0 0 4.832 1.253h.005c5.507 0 9.99-4.478 9.99-9.987 0-2.67-1.037-5.18-2.92-7.062C17.198 3.037 14.683 2 12.012 2zm5.726 14.153c-.314.88-1.547 1.634-2.122 1.734-.576.101-1.3.178-3.791-.849-3.187-1.314-5.215-4.542-5.375-4.757-.16-.214-1.277-1.696-1.277-3.238 0-1.542.8-2.298 1.085-2.607.286-.31.62-.387.828-.387.207 0 .413.002.593.01.18.007.424-.07.663.504.246.593.84 2.054.912 2.202.072.148.12.32.02.518-.1.2-.15.323-.3.498-.15.174-.315.388-.45.522-.15.15-.308.314-.133.614.175.3.776 1.274 1.662 2.062.143.127.27.247.38.351.98.932 1.83 1.157 2.149 1.302.32.145.508.12.698-.098.19-.218.81-.944 1.026-1.27.217-.327.435-.272.735-.163.3.11 1.905.898 2.233 1.062.327.163.545.244.625.38.08.136.08.788-.234 1.668z" />
  </svg>
);

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div>
        <Badge variant="accent">Contato</Badge>
        <h1 className="mt-4 text-4xl font-semibold text-[#1a1a4e]">Fale com a Vallys</h1>
        <p className="mt-4 text-lg leading-8 text-muted font-medium">
          Para pedidos, parcerias comerciais, dúvidas sobre produtos ou sugestões de receitas, nosso canal de atendimento principal é o WhatsApp.
        </p>

        <div className="mt-8 grid gap-4">
          <div className="flex items-center gap-3 text-muted">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#2d2d8e]/10 text-[#2d2d8e]">
              <Phone size={18} />
            </span>
            <a href="https://wa.me/5533999838182" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-gray-800">
              33 99983-8182 (WhatsApp)
            </a>
          </div>

          <div className="flex items-center gap-3 text-muted">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#2d2d8e]/10 text-[#2d2d8e]">
              <Mail size={18} />
            </span>
            <a href="mailto:laticiniosvallys08@hotmail.com" className="hover:underline font-semibold text-gray-800">
              laticiniosvallys08@hotmail.com
            </a>
          </div>

          <div className="flex items-center gap-3 text-muted">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#2d2d8e]/10 text-[#2d2d8e]">
              <InstagramIcon size={18} />
            </span>
            <a href="https://www.instagram.com/laticiniosvallys/" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-gray-800">
              @laticiniosvallys
            </a>
          </div>

          <div className="flex items-center gap-3 text-muted">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#2d2d8e]/10 text-[#2d2d8e]">
              <MapPin size={18} />
            </span>
            <span className="font-semibold text-gray-800">
              Zona Rural, Lajinha - MG, CEP 36980-000
            </span>
          </div>
        </div>
      </div>

      <Card className="border border-sky-100 bg-sky-50/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#1a1a4e]">Atendimento via WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <p className="text-sm leading-relaxed text-muted font-medium">
            Clique no botão abaixo para iniciar uma conversa no WhatsApp diretamente com o nosso setor comercial. Estamos prontos para te atender e tirar todas as suas dúvidas!
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-6 rounded-xl text-base shadow-lg transition-transform hover:scale-[1.02] active:scale-95 duration-200 cursor-pointer flex items-center justify-center gap-2">
            <a href="https://wa.me/5533999838182" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={22} />
              Falar no WhatsApp
            </a>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
