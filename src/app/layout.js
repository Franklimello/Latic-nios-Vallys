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
      <body className="min-h-full bg-background text-foreground relative">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />

        {/* Botão Flutuante do WhatsApp */}
        <a
          href="https://wa.me/5533999838182"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label="Falar no WhatsApp"
        >
          <span className="absolute right-16 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
            Falar no WhatsApp
          </span>
          <svg className="h-7 w-7 fill-white" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.982L2 22l5.176-1.358a9.95 9.95 0 0 0 4.832 1.253h.005c5.507 0 9.99-4.478 9.99-9.987 0-2.67-1.037-5.18-2.92-7.062C17.198 3.037 14.683 2 12.012 2zm5.726 14.153c-.314.88-1.547 1.634-2.122 1.734-.576.101-1.3.178-3.791-.849-3.187-1.314-5.215-4.542-5.375-4.757-.16-.214-1.277-1.696-1.277-3.238 0-1.542.8-2.298 1.085-2.607.286-.31.62-.387.828-.387.207 0 .413.002.593.01.18.007.424-.07.663.504.246.593.84 2.054.912 2.202.072.148.12.32.02.518-.1.2-.15.323-.3.498-.15.174-.315.388-.45.522-.15.15-.308.314-.133.614.175.3.776 1.274 1.662 2.062.143.127.27.247.38.351.98.932 1.83 1.157 2.149 1.302.32.145.508.12.698-.098.19-.218.81-.944 1.026-1.27.217-.327.435-.272.735-.163.3.11 1.905.898 2.233 1.062.327.163.545.244.625.38.08.136.08.788-.234 1.668z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
