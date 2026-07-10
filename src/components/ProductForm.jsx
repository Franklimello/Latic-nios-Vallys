"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productCategories } from "@/interfaces/catalog";
import { productSchema } from "@/lib/validations";
import { uploadToCloudinary } from "@/services/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emptyProduct = {
  name: "",
  category: productCategories[0],
  description: "",
  price: "",
  image: "",
  featured: false,
};

export default function ProductForm({
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
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || emptyProduct,
  });

  useEffect(() => {
    reset(initialValues || emptyProduct);
  }, [initialValues, reset]);

  async function submit(values) {
    const imageFile = values.imageFile?.[0];
    const payload = { ...values };
    delete payload.imageFile;

    if (imageFile) {
      const upload = await uploadToCloudinary(imageFile, "laticinio-vallys/produtos");
      payload.image = upload.secure_url;
    }

    await onSubmit(payload);
    reset(emptyProduct);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} placeholder="Queijo Minas Frescal" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            className="h-11 rounded-[8px] border border-border bg-white px-3 text-sm"
            {...register("category")}
          >
            {productCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Preco</Label>
          <Input id="price" {...register("price")} placeholder="R$ 24,90/kg" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descricao</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="image">URL da imagem</Label>
          <Input id="image" {...register("image")} placeholder="https://..." />
          {errors.image && (
            <p className="text-sm text-red-600">{errors.image.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="imageFile">Upload Cloudinary</Label>
          <Input id="imageFile" type="file" accept="image/*" {...register("imageFile")} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" {...register("featured")} />
        Destacar na pagina inicial
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar produto"}
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
