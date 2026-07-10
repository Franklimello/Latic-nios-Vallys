import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  metadataBase: new URL("https://laticiniosvallys.com.br"),
  title: {
    default: "Laticínio Vallys | Sabor e Tradição de Minas",
    template: "%s | Laticínio Vallys"
  },
  description: "Fundado em 2007 em Lajinha (MG), o Laticínio Vallys oferece produtos de excelência como queijo mussarela, requeijão cremoso e manteiga de qualidade premium com sabor autêntico de fazenda.",
  keywords: [
    "Laticínio Vallys", "Laticínios Vallys", "Queijo Vallys", "Requeijão Vallys",
    "Mussarela Vallys", "Manteiga Vallys", "Lajinha MG", "Laticínio Lajinha",
    "Queijo de Minas", "Produtos Lácteos", "Sabor de Fazenda", "Tradição de Minas"
  ],
  authors: [{ name: "Laticínio Vallys" }],
  creator: "Laticínio Vallys",
  publisher: "Laticínio Vallys",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://laticiniosvallys.com.br",
    title: "Laticínio Vallys | Sabor e Tradição de Minas",
    description: "Fundado em 2007 em Lajinha (MG), o Laticínio Vallys oferece produtos de excelência como queijo mussarela, requeijão cremoso e manteiga de qualidade premium com sabor autêntico de fazenda.",
    siteName: "Laticínio Vallys",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laticínio Vallys | Sabor e Tradição de Minas",
    description: "Produtos lácteos de excelência, sabor e confiança em cada produto com a tradição de Minas Gerais.",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
