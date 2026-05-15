import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// ─── IDENTIDAD LHOPITAL (display de marca, todas las subpáginas) ───
const rider = localFont({
  src: "../public/LhopitalRider-Regular.ttf",
  variable: "--font-rider",
  display: "swap",
  weight: "400",
});

// ─── HEDON (cálido, editorial) ───
const almaq = localFont({
  src: "../public/Almaq-Refined.otf",
  variable: "--font-almaq",
  display: "swap",
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// ─── MOTO II (técnico, minimalista) ───
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lhopital Moto",
  description: "We are the standard. Equipo premium para motociclistas desde CDMX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${rider.variable} ${almaq.variable} ${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
