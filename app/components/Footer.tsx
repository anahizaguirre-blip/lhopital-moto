'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/motoii', label: 'Moto II' },
  { href: '/hedon', label: 'Hedon' },
  { href: '/tees', label: 'Tees' },
  { href: '/contacto', label: 'Contacto' },
]

// Variantes de fondo disponibles
const fondos = {
  dark: 'bg-[#0a0a0a]',
  hedon: 'bg-hedon-brown',
}

export default function Footer({ bg = 'dark' }: { bg?: 'dark' | 'hedon' }) {
  const pathname = usePathname()

  return (
    <footer className={`${fondos[bg]} border-t border-brass/20 py-12 md:py-16`}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo Lhopital */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/LHOPITAL/frase_horizontal_invertido.png"
              alt="Lhopital"
              width={2250}
              height={527}
              className="h-10 md:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
              priority
            />
          </Link>

          {/* Navegación — el link activo se marca en brass automáticamente */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? 'font-almaq text-brass text-xs tracking-[0.2em] uppercase'
                      : 'font-almaq text-hedon-cream/70 hover:text-brass text-xs tracking-[0.2em] uppercase transition-colors'
                  }
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Instagram */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com/lhopitalmx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Lhopital"
              className="text-hedon-cream/70 hover:text-brass transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        {/* Línea separadora + copyright */}
        <div className="mt-10 pt-6 border-t border-brass/10 text-center">
          <p className="font-almaq text-hedon-cream/40 text-[10px] tracking-[0.25em] uppercase">
            © {new Date().getFullYear()} Lhopital-moto · We are the standard
          </p>
        </div>
      </div>
    </footer>
  )
}