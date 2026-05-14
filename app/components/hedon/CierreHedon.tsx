'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function CierreHedon() {
  return (
    <>
      <section className="bg-hedon-brown min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center px-6">
          <h2
            className="font-rider text-hedon-cream leading-[0.8] select-none"
            style={{ fontSize: 'clamp(6rem, 22vw, 22rem)' }}
          >
            HEDON.
          </h2>
          <p className="font-cormorant italic text-hedon-brass text-xl md:text-2xl mt-4 md:mt-6">
            El arte de la protección.
          </p>
        </div>
      </section>

      <footer className="bg-hedon-brown border-t border-hedon-brass/20 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/lhopital-logo-cream.png"
                alt="Lhopital"
                width={120}
                height={40}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>

            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <Link href="/" className="font-almaq text-hedon-cream/70 hover:text-hedon-brass text-xs tracking-[0.2em] uppercase transition-colors">
                Inicio
              </Link>
              <Link href="/beeline" className="font-almaq text-hedon-cream/70 hover:text-hedon-brass text-xs tracking-[0.2em] uppercase transition-colors">
                Beeline
              </Link>
              <Link href="/hedon" className="font-almaq text-hedon-brass text-xs tracking-[0.2em] uppercase">
                Hedon
              </Link>
              <Link href="/contacto" className="font-almaq text-hedon-cream/70 hover:text-hedon-brass text-xs tracking-[0.2em] uppercase transition-colors">
                Contacto
              </Link>
            </nav>

            <div className="flex items-center gap-5">
      <a
                href="https://instagram.com/lhopitalmx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Lhopital"
                className="text-hedon-cream/70 hover:text-hedon-brass transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-hedon-brass/10 text-center">
            <p className="font-almaq text-hedon-cream/40 text-[10px] tracking-[0.25em] uppercase">
              © {new Date().getFullYear()} Lhopital · Raise the Standard
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}