import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div>
        <Badge>Contato</Badge>
        <h1 className="mt-4 text-4xl font-semibold">Fale com a Vallys</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Use este espaco para pedidos, parcerias comerciais, duvidas sobre
          produtos ou sugestoes de receitas.
        </p>

        <div className="mt-8 grid gap-4">
          {[
            [Phone, "(00) 00000-0000"],
            [Mail, "contato@vallys.com.br"],
            [MapPin, "Zona rural, Brasil"],
          ].map(([Icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-muted">
              <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-primary/10 text-primary">
                <Icon size={18} />
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enviar mensagem</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </section>
  );
}
