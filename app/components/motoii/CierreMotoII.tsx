'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CierreMotoII() {
  return (
    <>
      {/* === 08 CIERRE MOTO II — letra gigante mic-drop en Lhopital Rider === */}
      <section className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center px-6 w-full">
          <h2
            className="font-rider text-[#f5f3f0] leading-[0.85] select-none uppercase"
            style={{ fontSize: 'clamp(6rem, 24vw, 24rem)', letterSpacing: '-0.01em' }}
          >
            MOTO II
          </h2>
          <p
            className="font-cormorant italic text-[var(--gold)] text-xl md:text-2xl mt-4 md:mt-6 tracking-wide"
          >
            Navegación pura.
          </p>
        </div>
      </section>

      {/* === FOOTER INSTITUCIONAL LHOPITAL — Rider en nav y copyright (el sello de casa) === */}
      <footer className="bg-[#0a0a0a] border-t border-[var(--gold-faint)] py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo Lhopital */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/frase_horizontal_invertido.png"
                alt="Lhopital"
                width={2250}
                height={527}
                className="h-10 md:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
                priority
              />
            </Link>

            {/* Navegación entre páginas — MOTO II en dorado porque estás aquí */}
            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <Link
                href="/"
                className="font-rider text-[rgba(245,243,240,0.7)] hover:text-[var(--gold)] text-xs tracking-[0.2em] uppercase transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/motoii"
                className="font-rider text-[var(--gold)] text-xs tracking-[0.2em] uppercase"
              >
                Moto II
              </Link>
              <Link
                href="/hedon"
                className="font-rider text-[rgba(245,243,240,0.7)] hover:text-[var(--gold)] text-xs tracking-[0.2em] uppercase transition-colors"
              >
                Hedon
              </Link>
              <Link
                href="/contacto"
                className="font-rider text-[rgba(245,243,240,0.7)] hover:text-[var(--gold)] text-xs tracking-[0.2em] uppercase transition-colors"
              >
                Contacto
              </Link>
            </nav>

            {/* Instagram */}
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/lhopitalmx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Lhopital"
                className="text-[rgba(245,243,240,0.7)] hover:text-[var(--gold)] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Línea separadora + copyright */}
          <div className="mt-10 pt-6 border-t border-[var(--gold-faint)] text-center">
            <p className="font-rider text-[rgba(245,243,240,0.4)] text-[10px] tracking-[0.25em] uppercase">
              © {new Date().getFullYear()} Lhopital-moto · We are the standard
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
