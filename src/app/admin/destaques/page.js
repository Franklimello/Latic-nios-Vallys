"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import HighlightForm from "@/components/HighlightForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHighlights } from "@/hooks/useHighlights";
import {
  createHighlight,
  deleteHighlight,
  updateHighlight,
  swapOrder,
  reindexOrders,
  ensurePersisted,
  initializeAndSwap,
} from "@/services/firebase";

export default function AdminHighlightsPage() {
  const { highlights, loading, error, reload } = useHighlights();
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const formRef = useRef(null);

  const handleEdit = (item) => {
    setEditing(item);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = formRef.current?.querySelector("input, select, textarea");
      firstInput?.focus();
    }, 100);
  };

  async function saveHighlight(values) {
    setSubmitting(true);

    try {
      if (editing?.id) {
        await updateHighlight(editing.id, values);
        toast.success("Destaque atualizado.");
      } else {
        await createHighlight(values);
        toast.success("Destaque cadastrado.");
      }

      setEditing(null);
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao salvar destaque.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeHighlight(id) {
    if (!window.confirm("Excluir este destaque do banner?")) {
      return;
    }

    try {
      await deleteHighlight(id);
      // Reindex remaining items
      const remaining = highlights.filter((h) => h.id !== id);
      const firestoreIds = remaining.filter((h) => h.createdAt || typeof h.order === "number").map((h) => h.id);
      if (firestoreIds.length > 0) {
        await reindexOrders("highlights", firestoreIds);
      }
      toast.success("Destaque excluído.");
      await reload();
    } catch (requestError) {
      toast.error(requestError.message || "Erro ao excluir destaque.");
    }
  }

  async function moveItem(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= highlights.length) return;

    const itemA = highlights[index];
    const itemB = highlights[targetIndex];

    setReordering(true);
    try {
      const orderA = typeof itemA.order === "number" ? itemA.order : index;
      const orderB = typeof itemB.order === "number" ? itemB.order : targetIndex;

      // Auto-persist demo items to Firestore before swapping
      const isFirestoreA = itemA.createdAt || typeof itemA.order === "number";
      const isFirestoreB = itemB.createdAt || typeof itemB.order === "number";

      if (!isFirestoreA) {
        await ensurePersisted("highlights", itemA, orderA);
      }
      if (!isFirestoreB) {
        await ensurePersisted("highlights", itemB, orderB);
      }

      const highlightIds = highlights.map((h) => h.id);
      await initializeAndSwap("highlights", highlightIds, itemA.id, index, itemB.id, targetIndex);

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
            <CardTitle>{editing ? "Editar Destaque" : "Novo Destaque"}</CardTitle>
          </CardHeader>
          <CardContent>
            <HighlightForm
              initialValues={editing}
              onSubmit={saveHighlight}
              onCancel={editing ? () => setEditing(null) : undefined}
              isSubmitting={submitting}
            />
          </CardContent>
        </Card>

        <div>
          <div className="mb-5">
            <h1 className="text-3xl font-semibold">Destaques do Banner</h1>
            <p className="mt-2 text-sm text-muted">
              Gerencie as fotos, títulos e frases rotativas do topo da home page.
              Use as setas para definir a ordem de exibição.
            </p>
          </div>

          {loading && <p className="text-muted">Carregando destaques...</p>}
          {error && <p className="text-red-600">{error.message}</p>}

          <div className="grid gap-5">
            {highlights.map((item, index) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Order Controls */}
                  <div className="flex sm:flex-col items-center justify-center gap-1 px-3 py-2 sm:py-0 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0">
                    <span className="text-xs font-bold text-gray-400 sm:mb-1">#{index + 1}</span>
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || reordering}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Mover para cima"
                    >
                      <ChevronUp size={18} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === highlights.length - 1 || reordering}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      aria-label="Mover para baixo"
                    >
                      <ChevronDown size={18} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Image Preview */}
                  <div className="relative w-full sm:w-[200px] h-[120px] bg-gray-50 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.titleLeft}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Sem imagem</span>
                    )}
                  </div>

                  {/* Highlight Info */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 text-[11px] font-bold uppercase bg-amber-100 text-amber-800 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 leading-tight">
                        {item.titleLeft}
                      </h3>
                      <p className="font-caveat text-xl text-amber-500 font-semibold mt-0.5">
                        {item.subtitleLeft}
                      </p>
                    </div>

                    <div className="flex gap-2 self-start">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil size={16} />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeHighlight(item.id)}
                      >
                        <Trash2 size={16} />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AdminGuard>
  );
}
