"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeCategories } from "@/interfaces/catalog";
import { recipeSchema } from "@/lib/validations";
import { uploadToCloudinary } from "@/services/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emptyRecipe = {
  title: "",
  category: recipeCategories[0],
  description: "",
  prepTime: "",
  difficulty: "Facil",
  ingredients: "",
  instructions: "",
  image: "",
  featured: false,
};

export default function RecipeForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: initialValues || emptyRecipe,
  });

  useEffect(() => {
    reset(initialValues || emptyRecipe);
  }, [initialValues, reset]);

  async function submit(values) {
    const imageFile = values.imageFile?.[0];
    const payload = { ...values };
    delete payload.imageFile;

    if (imageFile) {
      const upload = await uploadToCloudinary(imageFile, "laticinio-vallys/receitas");
      payload.image = upload.secure_url;
    }

    await onSubmit(payload);
    reset(emptyRecipe);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Titulo</Label>
        <Input id="title" {...register("title")} placeholder="Pao de queijo" />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            className="h-11 rounded-[8px] border border-border bg-white px-3 text-sm"
            {...register("category")}
          >
            {recipeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="prepTime">Tempo</Label>
          <Input id="prepTime" {...register("prepTime")} placeholder="45 min" />
          {errors.prepTime && (
            <p className="text-sm text-red-600">{errors.prepTime.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Dificuldade</Label>
          <select
            id="difficulty"
            className="h-11 rounded-[8px] border border-border bg-white px-3 text-sm"
            {...register("difficulty")}
          >
            <option value="Facil">Facil</option>
            <option value="Media">Media</option>
            <option value="Avancada">Avancada</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Resumo</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="ingredients">Ingredientes</Label>
        <Textarea id="ingredients" {...register("ingredients")} />
        {errors.ingredients && (
          <p className="text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="instructions">Modo de preparo</Label>
        <Textarea id="instructions" {...register("instructions")} />
        {errors.instructions && (
          <p className="text-sm text-red-600">{errors.instructions.message}</p>
        )}
      </div>

      <input type="hidden" {...register("image")} />

      <div className="grid gap-2">
        <Label htmlFor="imageFile">Imagem da Receita (Upload)</Label>
        <Input id="imageFile" type="file" accept="image/*" {...register("imageFile")} />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" {...register("featured")} />
        Destacar na pagina inicial
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar receita"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar edicao
          </Button>
        )}
      </div>
    </form>
  );
}
