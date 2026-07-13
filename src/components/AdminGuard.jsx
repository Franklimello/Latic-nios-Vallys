"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isFirebaseConfigured, watchAdminUser } from "@/services/firebase";

export default function AdminGuard({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAdminUser((currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return unsubscribe;
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Firebase pendente</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm leading-6 text-muted">
            <p>
              Configure as variaveis do Firebase em <code>.env.local</code> para
              liberar login e CRUD.
            </p>
            <Button asChild>
              <Link href="/admin/login">Ir para login</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (checking) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <p className="text-muted">Verificando acesso...</p>
      </section>
    );
  }

  const adminUids = [
    process.env.NEXT_PUBLIC_ADMIN_UID,
    "JPY8rJxcWNZ16mmce4OSTDqm1no2",
    "xQyXhiHNchWBJr0FzPqG5mSuyE83"
  ].filter(Boolean);
  const isAdmin = user && adminUids.includes(user.uid);

  if (!user || !isAdmin) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole size={20} />
              Acesso administrativo
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm leading-6 text-muted">
              {user 
                ? `Esta conta de e-mail não possui privilégios de administrador. (Seu UID: ${user.uid})` 
                : "Faça login com uma conta autorizada para gerenciar produtos e receitas."}
            </p>
            <Button asChild>
              <Link href="/admin/login">
                {user ? "Entrar com outra conta" : "Entrar"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return children;
}
