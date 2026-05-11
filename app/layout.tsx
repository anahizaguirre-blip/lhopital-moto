import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Lhopital Rider — fuente custom de marca (identidad)
const rider = localFont({
  src: "../public/LhopitalRider-Regular.ttf",
  variable: "--font-rider",
  display: "swap",
  weight: "400",
});

// Almaq Refined — workhorse legible (body, descripciones)
const almaq = localFont({
  src: "../public/Almaq-Refined.otf",
  variable: "--font-almaq",
  display: "swap",
  weight: "400",
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
      className={`${rider.variable} ${almaq.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}