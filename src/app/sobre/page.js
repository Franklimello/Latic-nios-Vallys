"use client";

import Image from "next/image";
import { 
  ShieldCheck, 
  Sparkles, 
  Scale, 
  Handshake, 
  Heart, 
  HeartHandshake, 
  Leaf, 
  Award, 
  Target, 
  Eye 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const valuesList = [
  {
    icon: ShieldCheck,
    title: "Qualidade e Segurança",
    text: "Garantimos produtos lácteos que atendem aos mais altos padrões de qualidade, segurança alimentar e excelência.",
  },
  {
    icon: Sparkles,
    title: "Inovação e Melhoria Contínua",
    text: "Investimos constantemente em tecnologia, processos e desenvolvimento para evoluir nossos produtos e serviços.",
  },
  {
    icon: Scale,
    title: "Ética e Transparência",
    text: "Conduzimos nossas relações com honestidade, respeito e responsabilidade em todas as etapas do nosso trabalho.",
  },
  {
    icon: Handshake,
    title: "Parceria com Produtores",
    text: "Valorizamos nossos produtores rurais, construindo relações sólidas, justas e de confiança, baseadas no crescimento mútuo.",
  },
  {
    icon: Heart,
    title: "Foco no Cliente e no Consumidor",
    text: "Buscamos proporcionar a melhor experiência, oferecendo produtos que conquistam pela qualidade, sabor e confiança.",
  },
  {
    icon: HeartHandshake,
    title: "Valorização das Pessoas",
    text: "Incentivamos o desenvolvimento profissional e pessoal dos nossos colaboradores, promovendo um ambiente de respeito, aprendizado e oportunidades.",
  },
  {
    icon: Leaf,
    title: "Compromisso com a Sustentabilidade",
    text: "Trabalhamos de forma responsável, contribuindo para o desenvolvimento da empresa, da comunidade e do meio ambiente.",
  },
  {
    icon: Award,
    title: "Excelência nos Resultados",
    text: "Buscamos eficiência, organização e melhoria contínua para gerar valor aos nossos clientes, parceiros e colaboradores.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Seção Principal */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        {/* Imagem do Time */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3] group"
        >
          <Image
            src="/sobre.png"
            alt="Equipe e Fábrica Laticínios Vallys"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Texto Descritivo */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Badge>Nossa História</Badge>
            <h1 className="text-4xl font-extrabold text-[#7c1421] uppercase tracking-tight">
              Laticínios Vallys
            </h1>
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

      {/* Missão e Visão */}
      <div className="mt-24 grid gap-8 md:grid-cols-2">
        {/* Card Missão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <Target size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Missão</h2>
          </div>
          <p className="text-muted leading-relaxed font-medium">
            Produzir alimentos lácteos com excelência, segurança e qualidade, proporcionando aos nossos consumidores uma experiência única de sabor e confiança. Atuamos de forma ética e responsável, fortalecendo parcerias duradouras com nossos produtores e valorizando nossos colaboradores por meio do desenvolvimento profissional, pessoal e humano, contribuindo para o crescimento de todos que fazem parte da nossa história.
          </p>
        </motion.div>

        {/* Card Visão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Eye size={24} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Visão</h2>
          </div>
          <p className="text-muted leading-relaxed font-medium">
            Ser reconhecida como uma das principais indústrias de laticínios de Minas Gerais e do Brasil, destacando-se pela qualidade dos nossos produtos, inovação, eficiência na gestão e compromisso com a satisfação dos clientes. Buscamos também ser referência como uma empresa que valoriza seus colaboradores e mantém relações sólidas, justas e confiáveis com os produtores rurais da nossa região.
          </p>
        </motion.div>
      </div>

      {/* Nossos Valores */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <div className="flex flex-col items-center text-center mb-16">
          <Badge>Nossos Valores</Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-foreground uppercase tracking-tight">Valores</h2>
          <p className="mt-2 text-muted font-bold tracking-wide">Princípios que orientam o nosso trabalho</p>
          <div className="mt-3 flex h-[4px] w-[100px] rounded-full overflow-hidden">
            <div className="w-1/2 bg-orange-500"></div>
            <div className="w-1/2 bg-[#7c1421]"></div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {valuesList.map((val, i) => {
            const Icon = val.icon;

            return (
              <motion.article 
                key={val.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.1 }}
                className="rounded-2xl border border-gray-50 bg-white p-6 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center justify-center p-3 bg-[#2d2d8e]/5 rounded-xl text-[#2d2d8e] mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-snug">{val.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted font-medium">{val.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
