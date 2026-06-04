'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/#marcas',  label: 'Marcas' },
  { href: '/#eventos', label: 'Eventos' },
  { href: '/tienda',   label: 'Tienda' },
]

export default function NavbarSub() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/20 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 md:py-5 flex items-center justify-between">

        <Link href="/" aria-label="Lhopital — inicio" className="flex items-center">
          <Image
            src="/logo/LHOPITAL/frase_circular_invertido.png"
            alt="Lhopital"
            width={300}
            height={300}
            priority
            className="h-10 md:h-12 w-auto opacity-75 hover:opacity-100 transition-opacity duration-300"
          />
        </Link>

        <nav className="flex items-center gap-6 md:gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-almaq text-moto-bone/70 hover:text-brass text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  )
}
