"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { useSettings } from "@/contexts/SettingsContext";
import { saveSettings } from "@/services/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { demoHighlights } from "@/interfaces/catalog";

export default function ConfiguracoesPage() {
  const { settings, setSettings, loading } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  // Sync form data with context when loaded
  useState(() => {
    if (!loading) {
      setFormData(settings);
    }
  }, [loading, settings]);

  const handleChange = (key, value) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    setSettings(newData); // Live update global context for preview
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSettings(formData);
      setSettings(formData); // Update global context immediately
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="p-8 text-center text-muted">Carregando configurações...</div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <section className="mx-auto max-w-4xl px-6 py-14 lg:px-8 overflow-x-hidden">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <ArrowLeft size={24} />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Configurações do Site</h1>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Estilo do Hero (Página Inicial)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["style1", "style2", "style3"].map((style, index) => (
                  <label
                    key={style}
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      formData.heroStyle === style
                        ? "border-[#00b1f4] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="heroStyle"
                      value={style}
                      checked={formData.heroStyle === style}
                      onChange={(e) => handleChange("heroStyle", e.target.value)}
                      className="hidden"
                    />
                    <div className="font-semibold text-lg">Opção {index + 1}</div>
                    <div className="text-sm text-muted mt-2">
                      {index === 0 && "Padrão atual com gradiente moderno"}
                      {index === 1 && "Foco na imagem com textos laterais em blocos"}
                      {index === 2 && "Centralizado com estilo clássico"}
                    </div>
                  </label>
                ))}
              </div>

              {/* Preview do Hero */}
              <div className="mt-8 border-4 border-dashed border-gray-200 rounded-2xl overflow-hidden relative">
                <div className="absolute top-2 left-2 z-50 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">PRÉ-VISUALIZAÇÃO AO VIVO</div>
                <div className="scale-[0.7] md:scale-100 origin-top w-[142%] md:w-full -ml-[21%] md:ml-0 h-[400px] md:h-auto pointer-events-none">
                  <Hero slides={demoHighlights} heroStyle={formData.heroStyle} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Vídeo Institucional (Página Inicial)</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link do Vídeo no YouTube</label>
                <input
                  type="text"
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#00b1f4] focus:outline-none transition-colors"
                  value={formData.homeYoutubeVideo || ""}
                  onChange={(e) => handleChange("homeYoutubeVideo", e.target.value)}
                />
                <p className="text-sm text-muted mt-2">
                  Cole o link do vídeo do YouTube para exibi-lo na página inicial, abaixo do banner principal. Deixe em branco para ocultar.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Estilo dos Produtos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["style1", "style2", "style3"].map((style, index) => (
                  <label
                    key={style}
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      formData.productsStyle === style
                        ? "border-[#00b1f4] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="productsStyle"
                      value={style}
                      checked={formData.productsStyle === style}
                      onChange={(e) => handleChange("productsStyle", e.target.value)}
                      className="hidden"
                    />
                    <div className="font-semibold text-lg">Layout {index + 1}</div>
                    <div className="text-sm text-muted mt-2">
                      {index === 0 && "Cards padrão com fundo branco"}
                      {index === 1 && "Cards arredondados com cores pastel"}
                      {index === 2 && "Lista minimalista sem bordas"}
                    </div>
                  </label>
                ))}
              </div>

              {/* Preview dos Produtos */}
              <div className="mt-8 p-6 bg-gray-50 border-4 border-dashed border-gray-200 rounded-2xl relative overflow-hidden flex justify-center">
                 <div className="absolute top-2 left-2 z-50 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">PRÉ-VISUALIZAÇÃO AO VIVO</div>
                 <div className="w-full max-w-[320px] pointer-events-none mt-8">
                   <ProductCard product={{ name: "Queijo Minas Frescal", category: "Queijos", price: "R$ 25,00", image: "/logo.png" }} />
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Estilo da Página Sobre</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["style1", "style2", "style3"].map((style, index) => (
                  <label
                    key={style}
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      formData.aboutStyle === style
                        ? "border-[#00b1f4] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="aboutStyle"
                      value={style}
                      checked={formData.aboutStyle === style}
                      onChange={(e) => handleChange("aboutStyle", e.target.value)}
                      className="hidden"
                    />
                    <div className="font-semibold text-lg">Visão {index + 1}</div>
                    <div className="text-sm text-muted mt-2">
                      {index === 0 && "Layout limpo focado no texto"}
                      {index === 1 && "Layout com timeline e ícones"}
                      {index === 2 && "Layout em grid criativo com imagens alternadas"}
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Textos Institucionais (Sobre)</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">História - Parágrafo 1</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#00b1f4] focus:outline-none transition-colors"
                    rows="3"
                    value={formData.aboutHistoryText1 !== undefined ? formData.aboutHistoryText1 : "Fundado em 2007, o Laticínios Vallys vem, desde então, investindo continuamente na modernização de sua estrutura, na inovação de seus processos e na utilização de equipamentos de alta tecnologia. Nosso compromisso é oferecer produtos de excelência, levando aos consumidores qualidade, sabor e confiança em cada produto."}
                    onChange={(e) => handleChange("aboutHistoryText1", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">História - Parágrafo 2</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#00b1f4] focus:outline-none transition-colors"
                    rows="2"
                    value={formData.aboutHistoryText2 !== undefined ? formData.aboutHistoryText2 : "Temos orgulho de fazer parte da história de Lajinha (MG), contribuindo para o desenvolvimento da região e consolidando nossa marca como referência no setor de laticínios."}
                    onChange={(e) => handleChange("aboutHistoryText2", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Texto da Missão</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#00b1f4] focus:outline-none transition-colors"
                    rows="3"
                    value={formData.aboutMission !== undefined ? formData.aboutMission : "Produzir alimentos lácteos com excelência, segurança e qualidade, proporcionando aos nossos consumidores uma experiência única de sabor e confiança. Atuamos de forma ética e responsável, fortalecendo parcerias duradouras com nossos produtores e valorizando nossos colaboradores por meio do desenvolvimento profissional, pessoal e humano, contribuindo para o crescimento de todos que fazem parte da nossa história."}
                    onChange={(e) => handleChange("aboutMission", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Texto da Visão</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#00b1f4] focus:outline-none transition-colors"
                    rows="3"
                    value={formData.aboutVision !== undefined ? formData.aboutVision : "Ser referência como uma das principais indústrias de laticínios de Minas Gerais e região, destacando-se pela qualidade dos nossos produtos, inovação, eficiência na gestão e compromisso com a satisfação dos clientes. Buscamos também valorizar nossos colaboradores e manter relações sólidas, justas e confiáveis com os produtores rurais da nossa região."}
                    onChange={(e) => handleChange("aboutVision", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tipografia (Fonte Principal)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["inter", "roboto", "playfair"].map((font) => (
                  <label
                    key={font}
                    className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${
                      formData.fontFamily === font
                        ? "border-[#00b1f4] bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="fontFamily"
                      value={font}
                      checked={formData.fontFamily === font}
                      onChange={(e) => handleChange("fontFamily", e.target.value)}
                      className="hidden"
                    />
                    <div className="font-semibold text-lg capitalize">{font}</div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
            <Button variant="outline" size="lg" onClick={() => window.location.reload()} disabled={saving} className="w-full sm:w-auto">
              Cancelar / Descartar
            </Button>
            <Button size="lg" onClick={handleSave} disabled={saving} className="w-full sm:w-auto bg-[#00b1f4] hover:bg-[#009bd6] text-white">
              {saving ? "Salvando..." : (
                <>
                  <Save className="mr-2" size={20} />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}
