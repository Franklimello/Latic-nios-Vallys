"use client";

import Link from "next/link";
import { BookOpen, Boxes, LogOut, Sparkles } from "lucide-react";
import AdminGuard from "@/components/AdminGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutAdmin } from "@/services/firebase";

export default function AdminPage() {
  return (
    <AdminGuard>
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-semibold">Painel administrativo</h1>
            <p className="mt-3 text-muted">
              Gerencie produtos, receitas e destaques publicados no site.
            </p>
          </div>
          <Button variant="outline" onClick={logoutAdmin}>
            <LogOut size={18} />
            Sair
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes size={22} />
                Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-6 text-muted">
                Cadastre, edite e remova itens do catalogo publico.
              </p>
              <Button asChild>
                <Link href="/admin/produtos">Gerenciar produtos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={22} />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-6 text-muted">
                Publique receitas com ingredientes, preparo e imagem.
              </p>
              <Button asChild>
                <Link href="/admin/receitas">Gerenciar receitas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={22} className="text-amber-500 fill-amber-500" />
                Destaques (Banner)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm leading-6 text-muted">
                Gerencie os slides rotativos em destaque no topo da home page.
              </p>
              <Button asChild>
                <Link href="/admin/destaques">Gerenciar destaques</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </AdminGuard>
  );
}
