"use client";

import Link from "next/link";
import { BookOpen, Boxes, LogOut } from "lucide-react";
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
              Gerencie produtos e receitas publicados no site.
            </p>
          </div>
          <Button variant="outline" onClick={logoutAdmin}>
            <LogOut size={18} />
            Sair
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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
        </div>
      </section>
    </AdminGuard>
  );
}
