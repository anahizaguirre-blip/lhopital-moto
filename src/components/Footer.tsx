import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 text-white/60 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo + tagline */}
          <div className="md:col-span-2">
            <Image
              src="/logo/frase_horizontal_invertido.png"
              alt="Lhopital"
              width={180}
              height={44}
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed text-white/40 max-w-xs">
              Finest Motorcycle Gear. Distribuidor Master de Hedon Helmets y
              Beeline Moto II en México.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/lhopitalmx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/lhopitalmx"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-4 font-semibold">
              Tienda
            </h3>
            <ul className="space-y-2 text-sm">
              {["Hedon Helmets", "Beeline Moto II", "Accesorios", "Ofertas"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/tienda"
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-4 font-semibold">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:+525621627604"
                  className="hover:text-white transition-colors"
                >
                  +52 56 2162 7604
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@lhopital.mx"
                  className="hover:text-white transition-colors"
                >
                  contacto@lhopital.mx
                </a>
              </li>
              <li className="text-white/40">CDMX, México</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} Lhopital. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/aviso-de-privacidad" className="hover:text-white transition-colors">
              Aviso de Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
