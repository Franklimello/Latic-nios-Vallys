"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { loginSchema } from "@/lib/validations";
import { isFirebaseConfigured, loginAdmin } from "@/services/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function submit(values) {
    try {
      await loginAdmin(values.email, values.password);
      toast.success("Login realizado com sucesso.");
      router.push("/admin");
    } catch (error) {
      toast.error(error.message || "Nao foi possivel entrar.");
    }
  }

  return (
    <section className="mx-auto flex max-w-7xl justify-center px-6 py-14 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogIn size={22} />
            Login administrativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isFirebaseConfigured && (
            <p className="mb-5 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Configure o Firebase em <code>.env.local</code> antes de usar o login.
            </p>
          )}

          <form onSubmit={handleSubmit(submit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting || !isFirebaseConfigured}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
