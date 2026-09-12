'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/motoii', label: 'Moto II' },
  { href: '/hedon', label: 'Hedon' },
  { href: '/tees', label: 'Tees' },
  { href: 'mailto:contacto@lhopital.mx', label: 'Contacto' },
]

// Variantes de fondo disponibles
const fondos = {
  dark: 'bg-[#0a0a0a]',
  hedon: 'bg-hedon-brown',
}

// Redes sociales — mismo tamaño/color/hover que el ícono de Instagram
// original. Íconos dibujados a mano (no lucide-react) para que los 4
// compartan exactamente el mismo peso de trazo y estilo geométrico.
const socialLinks = [
  {
    href: 'https://www.instagram.com/lhopitalmx/',
    label: 'Instagram Lhopital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: 'https://www.facebook.com/lhopitalmx/',
    label: 'Facebook Lhopital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path
          d="M14.4 8.4h-1.3a1.8 1.8 0 0 0-1.8 1.8v1.4H9.4v2.2h1.9V19h2.3v-5.2h1.9l.3-2.2h-2.2v-1.1c0-.4.3-.7.7-.7h1.5V8.4Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@lhopitalmx',
    label: 'TikTok Lhopital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
      </svg>
    ),
  },
  {
    href: 'https://www.youtube.com/@lhopitalmx',
    label: 'YouTube Lhopital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

// Barra legal inferior — estilo Apple: copyright a la izquierda, links a
// la derecha separados por espacio, sin cajas ni pipes.
const legalLinks = [
  { href: '/legal/aviso-de-privacidad', label: 'Aviso de Privacidad' },
  { href: '/legal/terminos-y-condiciones', label: 'Términos y Condiciones' },
  { href: '/legal/politicas-de-entrega', label: 'Políticas de Entrega' },
  { href: '/legal/politica-de-devoluciones', label: 'Política de Devoluciones' },
]

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
              const className = isActive
                ? 'font-almaq text-brass text-xs tracking-[0.2em] uppercase'
                : 'font-almaq text-hedon-cream/70 hover:text-brass text-xs tracking-[0.2em] uppercase transition-colors'

              if (link.href.startsWith('mailto:')) {
                return (
                  <a key={link.href} href={link.href} className={className}>
                    {link.label}
                  </a>
                )
              }

              return (
                <Link key={link.href} href={link.href} className={className}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Redes sociales */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-hedon-cream/70 hover:text-brass transition-colors"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Barra legal — copyright a la izquierda, links a la derecha (stack en mobile) */}
        <div className="mt-10 pt-6 border-t border-brass/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-almaq text-hedon-cream/40 text-[10px] tracking-[0.25em] uppercase">
            © {new Date().getFullYear()} Lhopital-moto · We are the standard
          </p>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-almaq text-hedon-cream/40 hover:text-brass text-[10px] tracking-[0.15em] uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
