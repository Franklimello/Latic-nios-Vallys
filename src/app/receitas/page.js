"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Clock, ChefHat, DollarSign, ArrowLeft } from "lucide-react";
import RecipeCard from "@/components/RecipeCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { recipeCategories } from "@/interfaces/catalog";
import { useRecipes } from "@/hooks/useRecipes";

function RecipesContent() {
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const { recipes, loading, error } = useRecipes();
  const searchParams = useSearchParams();
  const activeRecipeId = searchParams.get("id");

  const selectedRecipe = useMemo(() => {
    if (!activeRecipeId) return null;
    return recipes.find((r) => r.id === activeRecipeId);
  }, [recipes, activeRecipeId]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const categoryMatches = category === "Todas" || recipe.category === category;
      const searchMatches = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatches && searchMatches;
    });
  }, [category, recipes, search]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-muted">Carregando receitas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (selectedRecipe) {
    const ingredientsList = selectedRecipe.ingredients
      ? selectedRecipe.ingredients.split(",").map((i) => i.trim()).filter(Boolean)
      : [];
    const stepsList = selectedRecipe.instructions
      ? selectedRecipe.instructions.split(". ").map((s) => s.trim()).filter(Boolean)
      : [];

    const getIngredientEmoji = (name) => {
      const n = name.toLowerCase();
      if (n.includes("sal")) return "🧂";
      if (n.includes("água") || n.includes("agua")) return "💧";
      if (n.includes("leite")) return "🥛";
      if (n.includes("manteiga")) return "🧈";
      if (n.includes("queijo") || n.includes("mussarela")) return "🧀";
      if (n.includes("carne")) return "🥩";
      if (n.includes("farinha") || n.includes("milharina")) return "🌽";
      if (n.includes("mandioca")) return "🍠";
      if (n.includes("cebola")) return "🧅";
      if (n.includes("alho")) return "🧄";
      return "🔸";
    };

    const highlightKeyWords = (text) => {
      const keywords = [
        "sal", "água", "agua", "leite", "manteiga", "requeijão", "requeijao", 
        "mussarela", "queijo", "mandioca", "carne seca", "cebola", "alho",
        "cuscuzeira", "forno", "panela", "refratário", "refratario", "fogo", "vapor"
      ];
      
      let result = text;
      keywords.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, "gi");
        result = result.replace(regex, `<span class="text-orange-500 font-semibold">$1</span>`);
      });
      
      return <span dangerouslySetInnerHTML={{ __html: result }} />;
    };

    return (
      <section className="mx-auto max-w-3xl px-6 py-14 lg:px-8">
        {/* Back Link */}
        <Link
          href="/receitas"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline mb-8"
        >
          <ArrowLeft size={16} />
          Voltar para receitas
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <Badge variant="accent">{selectedRecipe.category}</Badge>
            <h1 className="text-4xl font-extrabold text-[#1a1a4e] leading-tight">
              {selectedRecipe.title}
            </h1>
            <p className="text-muted leading-relaxed font-medium">
              {selectedRecipe.description}
            </p>
          </div>
          {selectedRecipe.image && (
            <div className="relative w-full max-w-[280px] aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center p-2 shadow-inner shrink-0 border border-gray-100">
              <Image
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                fill
                className="object-contain"
                sizes="280px"
              />
            </div>
          )}
        </div>

        {/* Metadata Grey Bar */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-around gap-4 text-sm font-semibold text-gray-700 mb-10 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            <span>{selectedRecipe.prepTime || "15min"}</span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat size={20} className="text-orange-500" />
            <span>{selectedRecipe.difficulty || "Fácil"}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-orange-500" />
            <span>Custo médio</span>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            Ingredientes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
            {ingredientsList.map((ingredient, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1">
                <span className="text-2xl w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full shrink-0">
                  {getIngredientEmoji(ingredient)}
                </span>
                <span className="text-sm font-semibold text-gray-700">{ingredient}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Method */}
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Modo de preparo</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Clock size={16} className="text-orange-500" />
              <span>Modo de preparo: {selectedRecipe.prepTime || "15min"}</span>
            </div>
          </div>
          <div className="space-y-6">
            {stepsList.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white text-orange-500 font-extrabold text-sm flex items-center justify-center shadow-md shrink-0 border border-gray-100">
                  {idx + 1}
                </div>
                <div className="text-sm leading-relaxed text-gray-600 pt-1 font-semibold">
                  {highlightKeyWords(step)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <Badge variant="accent">Receitas</Badge>
        <h1 className="mt-4 text-4xl font-semibold">Cozinha Vallys</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Ideias simples para transformar produtos lácteos em pratos de rotina,
          lanches e sobremesas.
        </p>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-wrap gap-2">
          {["Todas", ...recipeCategories].map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                category === item
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-white text-muted hover:text-foreground"
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar receita"
        />
      </div>

      <div className="grid gap-5">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-muted">Carregando...</p>
      </div>
    }>
      <RecipesContent />
    </Suspense>
  );
}
