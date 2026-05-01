# Lhopital Moto — lhopital-moto.mx

Sitio web de **Lhopital Moto** — Finest Motorcycle Gear.

Construido con [Next.js](https://nextjs.org), usando la misma base que `lhopital-fr.mx`.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          ← Layout principal (Header, Footer, metadata)
│   ├── page.tsx            ← Página de inicio
│   ├── nosotros/page.tsx   ← Página Nosotros
│   ├── sitemap.ts          ← Sitemap automático
│   └── ...otras páginas
├── components/
│   ├── Header.tsx          ← Navegación principal (negro + logo blanco)
│   ├── Footer.tsx          ← Footer con links y contacto
│   ├── Hero.tsx            ← Hero de la página principal
│   ├── ProductShowcase.tsx ← Sección de productos destacados
│   ├── BrandStory.tsx      ← Sección "Nuestra Historia"
│   ├── HeroContainer.tsx   ← (reutilizado de lhopital-fr)
│   ├── CTAButton.tsx       ← (reutilizado de lhopital-fr)
│   ├── Modal.tsx           ← (reutilizado de lhopital-fr)
│   ├── ContactForm.tsx     ← (reutilizado de lhopital-fr)
│   ├── Reveal.tsx          ← (reutilizado de lhopital-fr)
│   └── Partners.tsx        ← (reutilizado de lhopital-fr)
```

## Imágenes necesarias

Copia tus imágenes en la carpeta `public/`:

```
public/
├── logo/
│   ├── frase_horizontal_invertido.png   ← Header y Footer
│   ├── frase_circular_invertido.png     ← Hero
│   └── frase_vertical.png              ← Sección Nosotros
├── banners/
│   ├── hero-moto.webp                  ← Banner del Hero principal
│   ├── nosotros-moto.webp              ← Banner página Nosotros
│   └── valores-moto.webp              ← Fondo sección Valores
├── products/
│   ├── hedon-casco.webp                ← Foto producto Hedon
│   └── beeline-moto2.webp             ← Foto producto Beeline
└── og-image.png                        ← Imagen para redes sociales
```

## Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

```bash
# Conecta tu repositorio de GitHub a Vercel
# Vercel detecta Next.js automáticamente
```

1. Sube el proyecto a GitHub
2. Entra a [vercel.com](https://vercel.com) y conecta tu repo
3. Configura el dominio `lhopital-moto.mx` en Vercel

## Diferencias con lhopital-fr.mx

| lhopital-fr.mx | lhopital-moto.mx |
|---|---|
| Colores rojo `#b01f29` y negro | Blanco y negro (monocromático) |
| Equipos de rescate / bomberos | Accesorios para motociclistas |
| Fondo blanco en secciones | Fondo negro predominante |
| Logo FR | Logo Moto (Finest Motorcycle Gear) |

## Contacto

- Tel: +52 56 2162 7604
- Email: contacto@lhopital.mx
- Instagram: @lhopitalmx
