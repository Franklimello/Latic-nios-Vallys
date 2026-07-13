"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import RecipeForm from "@/components/RecipeForm";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecipes } from "@/hooks/useRecipes";
import {
  createRecipe,
  deleteRecipe,
  updateRecipe,
} from "@/services/firebase";

export default function AdminRecipesPage() {
  const { recipes, loading, error, reload } = useRecipes();
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleEdit = (recipe) => {
    setEditing(recipe);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = formRef.current?.querySelector("input, select, textarea");
      firstInput?.focus();
    }, 100);
  };

  async function saveRecipe(values) {
    setSubmitting(true);

    try {
      if (editing?.id) {
        await updateRecipe(editing.id, values);
        toast.success("Receita atualizada.");
      } else {
        await createRecipe(values);
        toast.success("Receita cadastrada.");
      }

      setEditing(null);
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao salvar receita.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeRecipe(id) {
    if (!window.confirm("Excluir esta receita?")) {
      return;
    }

    try {
      await deleteRecipe(id);
      toast.success("Receita excluida.");
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao excluir receita.");
    }
  }

  return (
    <AdminGuard>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[460px_1fr] lg:px-8">
        <Card className="h-fit" ref={formRef}>
          <CardHeader>
            <CardTitle>{editing ? "Editar receita" : "Nova receita"}</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeForm
              initialValues={editing}
              onSubmit={saveRecipe}
              onCancel={editing ? () => setEditing(null) : undefined}
              isSubmitting={submitting}
            />
          </CardContent>
        </Card>

        <div>
          <div className="mb-5">
            <h1 className="text-3xl font-semibold">Receitas</h1>
            <p className="mt-2 text-sm text-muted">
              Receitas publicadas na area publica do site.
            </p>
          </div>

          {loading && <p className="text-muted">Carregando receitas...</p>}
          {error && <p className="text-red-600">{error.message}</p>}

          <div className="grid gap-5">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="grid gap-3">
                <RecipeCard recipe={recipe} />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(recipe)}
                  >
                    <Pencil size={16} />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRecipe(recipe.id)}
                  >
                    <Trash2 size={16} />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}
