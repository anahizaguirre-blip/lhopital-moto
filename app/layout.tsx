import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";





// Lhopital Rider — fuente custom de marca (display, identidad)
const rider = localFont({
  src: "../public/LhopitalRider-Regular.ttf",
  variable: "--font-rider",
  display: "swap",
  weight: "400",
});

// Almaq Refined — workhorse legible (body, textos largos)
const almaq = localFont({
  src: "../public/Almaq-Refined.otf",
  variable: "--font-almaq",
  display: "swap",
  weight: "400",
});

// Cormorant Garamond — serif italic editorial (acentos, palabras clave)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lhopital Moto",
  description: "Raise the standard in motorcycle gear and accessories from CDMX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${rider.variable} ${almaq.variable} ${cormorant.variable} antialiased`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}