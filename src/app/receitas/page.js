"use client";

import { useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { recipeCategories } from "@/interfaces/catalog";
import { useRecipes } from "@/hooks/useRecipes";

export default function RecipesPage() {
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const { recipes, loading, error } = useRecipes();

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const categoryMatches = category === "Todas" || recipe.category === category;
      const searchMatches = recipe.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return categoryMatches && searchMatches;
    });
  }, [category, recipes, search]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <Badge variant="accent">Receitas</Badge>
        <h1 className="mt-4 text-4xl font-semibold">Cozinha Vallys</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Ideias simples para transformar produtos lacteos em pratos de rotina,
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

      {loading && <p className="text-muted">Carregando receitas...</p>}
      {error && <p className="text-red-600">{error.message}</p>}

      <div className="grid gap-5">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
