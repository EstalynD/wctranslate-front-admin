import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "WC Training Admin - Panel de Administración",
    template: "%s | WC Training Admin",
  },
  description: "Panel de administración de WC Training. Gestiona usuarios, cursos, contenido y estadísticas de la plataforma.",
  keywords: ["administración", "gestión", "cursos", "usuarios", "dashboard", "WC Training"],
  authors: [{ name: "WC Training" }],
  creator: "WC Training",
  metadataBase: new URL(process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3557"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "WC Training Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#130918" },
    { media: "(prefers-color-scheme: dark)", color: "#130918" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
