"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { highlightSchema } from "@/lib/validations";
import { uploadToCloudinary } from "@/services/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emptyHighlight = {
  titleLeft: "",
  subtitleLeft: "",
  textRight: "",
  badge: "",
  image: "",
};

export default function HighlightForm({
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
    resolver: zodResolver(highlightSchema),
    defaultValues: initialValues || emptyHighlight,
  });

  useEffect(() => {
    reset(initialValues || emptyHighlight);
  }, [initialValues, reset]);

  async function submit(values) {
    const imageFile = values.imageFile?.[0];
    const payload = { ...values };
    delete payload.imageFile;

    if (imageFile) {
      const upload = await uploadToCloudinary(imageFile, "laticinio-vallys/destaques");
      payload.image = upload.secure_url;
    }

    await onSubmit(payload);
    reset(emptyHighlight);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="titleLeft">Título Esquerdo (Grande)</Label>
        <Input id="titleLeft" {...register("titleLeft")} placeholder="Mussarela Vallys" />
        {errors.titleLeft && <p className="text-sm text-red-600">{errors.titleLeft.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subtitleLeft">Subtítulo Esquerdo (Cursivo)</Label>
        <Input id="subtitleLeft" {...register("subtitleLeft")} placeholder="Derretimento Perfeito" />
        {errors.subtitleLeft && <p className="text-sm text-red-600">{errors.subtitleLeft.message}</p>}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="textRight">Destaque Direito (Slogan)</Label>
          <Input id="textRight" {...register("textRight")} placeholder="QUALIDADE QUE DERRETE" />
          {errors.textRight && <p className="text-sm text-red-600">{errors.textRight.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="badge">Tag Superior (Badge)</Label>
          <Input id="badge" {...register("badge")} placeholder="100% Puro & Natural" />
          {errors.badge && <p className="text-sm text-red-600">{errors.badge.message}</p>}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="image">URL da Imagem</Label>
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

      <div className="flex flex-col gap-2 sm:flex-row mt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Destaque"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar Edição
          </Button>
        )}
      </div>
    </form>
  );
}
