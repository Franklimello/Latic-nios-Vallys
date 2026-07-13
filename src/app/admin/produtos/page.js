"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import ProductForm from "@/components/ProductForm";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import { productCategories } from "@/interfaces/catalog";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  swapOrder,
  reindexOrders,
  ensurePersisted,
  initializeAndSwap,
} from "@/services/firebase";

export default function AdminProductsPage() {
  const { products, loading, error, reload } = useProducts();
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const formRef = useRef(null);

  const handleEdit = (product) => {
    setEditing(product);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = formRef.current?.querySelector("input, select, textarea");
      firstInput?.focus();
    }, 100);
  };
  
  // Set default active tab
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);

  // Group and normalize products by category
  const categoryProducts = useMemo(() => {
    return products.filter((product) => {
      let cat = product.category || "Outros";
      if (cat === "Iogurtes") {
        cat = "Bebidas Lácteas";
      }
      return cat === activeCategory;
    });
  }, [products, activeCategory]);

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

  async function removeProduct(id, category) {
    if (!window.confirm("Excluir este produto?")) {
      return;
    }

    try {
      await deleteProduct(id);
      
      // Reindex remaining items of this category
      const remainingOfCat = products.filter(
        (p) => p.id !== id && (p.category === "Iogurtes" ? "Bebidas Lácteas" : (p.category || "Outros")) === category
      );
      const firestoreIds = remainingOfCat
        .filter((p) => p.createdAt || typeof p.order === "number")
        .map((p) => p.id);

      if (firestoreIds.length > 0) {
        await reindexOrders("products", firestoreIds);
      }

      toast.success("Produto excluido.");
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao excluir produto.");
    }
  }

  async function moveItem(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categoryProducts.length) return;

    const itemA = categoryProducts[index];
    const itemB = categoryProducts[targetIndex];

    setReordering(true);
    try {
      const orderA = typeof itemA.order === "number" ? itemA.order : index;
      const orderB = typeof itemB.order === "number" ? itemB.order : targetIndex;

      // Auto-persist demo items to Firestore before swapping
      const isFirestoreA = itemA.createdAt || typeof itemA.order === "number";
      const isFirestoreB = itemB.createdAt || typeof itemB.order === "number";

      if (!isFirestoreA) {
        await ensurePersisted("products", itemA, orderA);
      }
      if (!isFirestoreB) {
        await ensurePersisted("products", itemB, orderB);
      }

      const categoryIds = categoryProducts.map((p) => p.id);
      await initializeAndSwap("products", categoryIds, itemA.id, index, itemB.id, targetIndex);

      toast.success("Ordem atualizada.");
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao reordenar.");
    } finally {
      setReordering(false);
    }
  }

  return (
    <AdminGuard>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[420px_1fr] lg:px-8">
        <Card className="h-fit" ref={formRef}>
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
          <div className="mb-6">
            <h1 className="text-3xl font-semibold">Produtos</h1>
            <p className="mt-2 text-sm text-muted">
              Itens publicados no catalogo publico.
              Selecione uma categoria abaixo e use as setas para definir a ordem.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
            {productCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "border-[#00b1f4] bg-[#00b1f4] text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && <p className="text-muted">Carregando produtos...</p>}
          {error && <p className="text-red-600">{error.message}</p>}

          {!loading && !error && categoryProducts.length === 0 && (
            <p className="text-muted text-sm py-4">Nenhum produto cadastrado nesta categoria.</p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {categoryProducts.map((product, index) => (
              <div key={product.id} className="grid gap-3">
                {/* Order badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#00b1f4] text-white text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || reordering}
                      className="p-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Mover para cima"
                    >
                      <ChevronUp size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === categoryProducts.length - 1 || reordering}
                      className="p-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Mover para baixo"
                    >
                      <ChevronDown size={16} className="text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{product.name}</span>
                </div>

                <ProductCard product={product} />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil size={16} />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProduct(product.id, product.category)}
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
