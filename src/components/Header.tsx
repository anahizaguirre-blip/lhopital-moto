"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

const marcasLinks = [
  { href: "/marcas/hedon", label: "HEDON" },
  { href: "/marcas/beeline-moto-ii", label: "MOTO II" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [marcasOpen, setMarcasOpen] = useState(false);
  const [mobilesMarcasOpen, setMobilesMarcasOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMarcasEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMarcasOpen(true);
  };

  const handleMarcasLeave = () => {
    timeoutRef.current = setTimeout(() => setMarcasOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo/frase_horizontal_invertido.png"
            alt="Lhopital - Finest Motorcycle Gear"
            width={200}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">

          {/* Inicio */}
          <Link
            href="/"
            className="text-white/70 hover:text-white text-sm tracking-widest uppercase transition-colors duration-200"
          >
            Inicio
          </Link>

          {/* Marcas con dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMarcasEnter}
            onMouseLeave={handleMarcasLeave}
          >
            <button className="flex items-center gap-1 text-white/70 hover:text-white text-sm tracking-widest uppercase transition-colors duration-200">
              Marcas
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${marcasOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {marcasOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black border border-white/20 min-w-[160px] shadow-xl">
                {marcasLinks.map((marca) => (
                  <Link
                    key={marca.href}
                    href={marca.href}
                    className="block px-6 py-3 text-sm tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-150 border-b border-white/10 last:border-b-0"
                  >
                    {marca.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Eventos, Blog, Contacto */}
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white text-sm tracking-widest uppercase transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Tienda + Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/tienda"
            className="hidden md:flex items-center gap-2 border border-white/30 hover:border-white px-4 py-2 text-xs tracking-widest uppercase transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Tienda
          </Link>
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <nav className="flex flex-col px-6 py-4 gap-1">

            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="text-white/70 hover:text-white text-sm tracking-widest uppercase py-3 border-b border-white/5 transition-colors"
            >
              Inicio
            </Link>

            {/* Marcas acordeón en mobile */}
            <div className="border-b border-white/5">
              <button
                onClick={() => setMobilesMarcasOpen(!mobilesMarcasOpen)}
                className="w-full flex items-center justify-between text-white/70 hover:text-white text-sm tracking-widest uppercase py-3 transition-colors"
              >
                Marcas
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${mobilesMarcasOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobilesMarcasOpen && (
                <div className="pl-4 pb-2 flex flex-col gap-1">
                  {marcasLinks.map((marca) => (
                    <Link
                      key={marca.href}
                      href={marca.href}
                      onClick={() => { setMenuOpen(false); setMobilesMarcasOpen(false); }}
                      className="text-white/50 hover:text-white text-sm tracking-widest uppercase py-2 transition-colors"
                    >
                      {marca.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/70 hover:text-white text-sm tracking-widest uppercase py-3 border-b border-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
