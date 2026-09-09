'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/#marcas',  label: 'Marcas' },
  { href: '/#eventos', label: 'Eventos' },
  { href: '/tienda',   label: 'Tienda' },
]

// Solo ícono + contador por ahora — sin drawer/checkout todavía, esa es
// una entrega aparte. useCart() ya queda listo para que se conecte sin
// refactor cuando exista.
function CartIcon() {
  const { itemCount } = useCart()

  return (
    <div
      className="relative flex items-center text-moto-bone/70"
      aria-label={`Carrito: ${itemCount} ${itemCount === 1 ? 'artículo' : 'artículos'}`}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 12a1 1 0 01-1 1H8a1 1 0 01-1-1L6 8Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 016 0v2" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-brass text-[#0A0A0A] text-[9px] font-bold leading-none">
          {itemCount}
        </span>
      )}
    </div>
  )
}

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

        <div className="flex items-center gap-6 md:gap-10">
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
          <CartIcon />
        </div>

      </div>
    </header>
  )
}
