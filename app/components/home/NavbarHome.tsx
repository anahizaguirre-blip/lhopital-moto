'use client'

import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '#marcas', label: 'Marcas' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#eventos', label: 'Eventos' },
  { href: '/contacto', label: 'Tienda' },
]

export default function NavbarHome() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-6 md:py-8 flex items-center justify-between">

        {/* Logo Lhopital — circular invertido, sobre el video */}
        <Link href="/" aria-label="Lhopital — inicio" className="flex items-center">
          <Image
            src="/logo/LHOPITAL/frase_circular_invertido.png"
            alt="Lhopital"
            width={300}
            height={300}
            priority
            className="h-20 md:h-24 w-auto opacity-95 hover:opacity-100 transition-opacity"
          />
        </Link>

        {/* Links — anclas a secciones del home + Tienda */}
        <nav className="flex items-center gap-5 md:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-almaq text-moto-bone/80 hover:text-brass text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
