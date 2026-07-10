"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/firebase";

export default function AdminProductsPage() {
  const { products, loading, error, reload } = useProducts();
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function saveProduct(values) {
    setSubmitting(true);

    try {
      if (editing?.id) {
        await updateProduct(editing.id, values);
        toast.success("Produto atualizado.");
      } else {
        await createProduct(values);
        toast.success("Produto cadastrado.");
      }

      setEditing(null);
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao salvar produto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeProduct(id) {
    if (!window.confirm("Excluir este produto?")) {
      return;
    }

    try {
      await deleteProduct(id);
      toast.success("Produto excluido.");
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao excluir produto.");
    }
  }

  return (
    <AdminGuard>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[420px_1fr] lg:px-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{editing ? "Editar produto" : "Novo produto"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm
              initialValues={editing}
              onSubmit={saveProduct}
              onCancel={editing ? () => setEditing(null) : undefined}
              isSubmitting={submitting}
            />
          </CardContent>
        </Card>

        <div>
          <div className="mb-5">
            <h1 className="text-3xl font-semibold">Produtos</h1>
            <p className="mt-2 text-sm text-muted">
              Itens publicados no catalogo publico.
            </p>
          </div>

          {loading && <p className="text-muted">Carregando produtos...</p>}
          {error && <p className="text-red-600">{error.message}</p>}

          <div className="grid gap-5 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="grid gap-3">
                <ProductCard product={product} />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(product)}
                  >
                    <Pencil size={16} />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProduct(product.id)}
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
