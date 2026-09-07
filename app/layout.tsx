import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freeroam Radar",
  description: "Radar de inteligência GTA VI para criadores de conteúdo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-body bg-base text-ink min-h-screen">{children}</body>
    </html>
  );
}
