import ViewToggle from './components/ViewToggle';

import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });

export const metadata: Metadata = {
  title: "Freeroam Radar | O Radar de Inteligência GTA VI",
  description: "Acompanhe as últimas notícias, rumores e ferramentas exclusivas para criadores de conteúdo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-body bg-base text-ink min-h-screen flex flex-col">
        <Providers>
          <main className="flex-1">{children}</main>
          
          <footer className="text-center text-xs text-ink-faint py-8 px-4 border-t border-white/5 mt-auto">
            <p>Freeroam Radar é um site de fãs, sem vínculo com a Rockstar Games.</p>
            <p className="mt-2">📍 Dados atuais: servidores de GTA V (FiveM). Migração automática para a próxima geração — 19/11/2026.</p>
          </footer>
        </Providers>
      <ViewToggle />
      </body>
    </html>
  );
}
