import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Burraco Score Tracker",
  description: "L'app definitiva per segnare i punti del Burraco in tempo reale.",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-red-500/30`}>
        <main className="mx-auto max-w-md min-h-screen border-x bg-card shadow-2xl relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
