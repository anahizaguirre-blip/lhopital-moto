"use client";

import { useState } from "react";

type TabOption = "all" | "hedon" | "beeline" | "lhopital";

type Product = {
  id: number;
  brand: string;
  dataset: TabOption;
  name: string;
  badge: string;
  price: string;
  image?: string;
  placeholder: string;
};

const products: Product[] = [
  {
    id: 1,
    brand: "Hedon · London UK",
    dataset: "hedon",
    name: "Heroine Racer",
    badge: "Nuevo",
    price: "Consultar precio",
    image: "/products/brand-Hedon.jpg",
    placeholder: "HEDON",
  },
  {
    id: 2,
    brand: "Hedon · London UK",
    dataset: "hedon",
    name: "Hedonist",
    badge: "Edición",
    price: "Consultar precio",
    placeholder: "HEDON",
  },
  {
    id: 3,
    brand: "Beeline · UK",
    dataset: "beeline",
    name: "Moto 2 — Navegador GPS",
    badge: "Popular",
    price: "Consultar precio",
    image: "/products/brand-Moto2.jpg",
    placeholder: "BEELINE",
  },
  {
    id: 4,
    brand: "Lhopital Tee's · MX",
    dataset: "lhopital",
    name: "Playera Emblema — Negro",
    badge: "Ed. Limitada",
    price: "Consultar precio",
    placeholder: "LHO",
  },
];

const tabs: Array<{ label: string; value: TabOption }> = [
  { label: "Todos", value: "all" },
  { label: "Hedon", value: "hedon" },
  { label: "Beeline", value: "beeline" },
  { label: "Lhopital", value: "lhopital" },
];

export default function Home() {
  const [selected, setSelected] = useState<TabOption>("all");

  return (
    <div className="w">
      <div className="hero" style={{ position: "relative", overflow: "hidden" }}>
        <video
          src="/LhopitalVideo.mp4"
          type="video/mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0
          }}
        />
        <div className="hero-ov" style={{ zIndex: 1 }} />
        <div className="nav">
          <img 
            src="/logo/frase_circular_invertido.png" 
            alt="Lhopital" 
            style={{ height: '120px', width: 'auto' }}
          />
          <div className="nav-links">
            <a href="#marcas">Marcas</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#top-picks">Productos</a>
            <a href="#contacto">Contacto</a>
          </div>
        </div>
        <div className="hero-c" style={{ zIndex: 10 }}>
          <span className="h-eye" style={{ fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.75)' }}>Est. 2021 · CDMX, México</span>
          <div className="h-title">
            WE ARE THE
            <em>standard</em>
          </div>
          <div className="h-sub" style={{ fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(245,243,240,0.7)' }}>Finest Motorcycle Gear</div>
          <div className="h-btns">
            <button className="btn-w">Ver Productos</button>
            <button className="btn-g">Conocer Marcas</button>
          </div>
        </div>
      </div>

      <div className="bar">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <img 
            src="/partners/beeline.png" 
            alt="Beeline" 
            style={{ height: '28px', width: 'auto', opacity: 0.7, filter: 'brightness(0) invert(1)' }}
          />
        </div>
        <div className="bdiv" style={{ height: '40px' }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <img 
            src="/partners/hedon-white.png" 
            alt="Hedon" 
            style={{ height: '28px', width: 'auto', opacity: 0.7 }}
          />
        </div>
        <div className="bdiv" style={{ height: '40px' }} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
          <img 
            src="/logo/frase_horizontal_invertido.png" 
            alt="Lhopital" 
            style={{ height: '28px', width: 'auto', opacity: 0.7 }}
          />
        </div>
      </div>

      <section className="sec" id="marcas">
        <div className="sec-lbl">Nuestras marcas</div>
        <div className="sec-ttl">
          TRES MARCAS, UN <em>standard</em>
        </div>
        <div className="marcas">
          <div className="mc">
            <img
              src="/products/brand-Moto2.jpg"
              alt="Moto II"
              onError={(event) => {
                const target = event.currentTarget;
                target.style.display = "none";
                const next = target.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "block";
              }}
            />
            <div className="mc-grad" />
            <div className="mc-cnt">
              <div className="mc-num">01</div>
              <div className="mc-name">MOTO II</div>
              <div className="mc-tag">Navegación satelital · Beeline UK</div>
              <div className="mc-lnk">Ver accesorios →</div>
            </div>
          </div>
          <div className="mc">
            <img
              src="/products/brand-Hedon.jpg"
              alt="Hedon"
              style={{ objectPosition: "center top" }}
              onError={(event) => {
                const target = event.currentTarget;
                target.style.display = "none";
                const next = target.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "block";
              }}
            />
            <div className="mc-grad" />
            <div className="mc-cnt">
              <div className="mc-num">02</div>
              <div className="mc-name">HEDON</div>
              <div className="mc-tag">Cascos artesanales · London UK</div>
              <div className="mc-lnk">Ver cascos →</div>
            </div>
          </div>
          <div className="mc">
            <div className="mc-ph">
              <img
                src="/products/brand-Lhopital.jpg"
                alt="Lhopital"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.style.display = "none";
                  const next = target.nextElementSibling as HTMLElement | null;
                  if (next) next.style.display = "block";
                }}
              />
            </div>
            <div className="mc-grad" />
            <div className="mc-cnt">
              <div className="mc-num">03</div>
              <div className="mc-name">LHOPITAL</div>
              <div className="mc-tag">Playeras & merch · Hecho en MX</div>
              <div className="mc-lnk">Ver colección →</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="eventos">
        <div className="sec-lbl">Comunidad</div>
        <div className="sec-ttl">NUESTROS <em>eventos</em></div>
        <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(245,243,240,0.4)', textTransform: 'uppercase', marginBottom: '20px' }}>
          No tenemos showroom por ahora. Checa nuestros eventos.
        </p>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '8px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Próximos
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2px' }}>
            <div style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
              <img 
                src="/eventos/PORTADA_DGR2026.png" 
                alt="DGR 2026 CDMX"
                style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', filter: 'grayscale(15%)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                <div style={{ fontSize: '7px', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  17 Mayo 2026 · 11:00 – 18:00 hrs
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.04em', marginBottom: '2px' }}>
                  DGR 2026 CDMX
                </div>
                <div style={{ fontSize: '9px', color: 'rgba(245,243,240,0.5)', marginBottom: '10px', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                  San Ángel, Ciudad de México
                </div>
                <a 
                  href="https://dgr.triumphgrandtour.mx/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-block',
                    border: '1px solid var(--gold-dim)', 
                    color: 'var(--gold)', 
                    padding: '5px 12px', 
                    fontSize: '8px', 
                    letterSpacing: '0.15em', 
                    textTransform: 'uppercase',
                    textDecoration: 'none'
                  }}
                >
                  Sold Out — Más info aquí →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="nosotros">
        <div className="sec-lbl">Quiénes somos</div>
        <div className="sec-ttl">NOSO<em>tros</em></div>
        <div className="nos-grid">
          <div className="nos-img">
            <img
              src="/nosotros-moto.jpg"
              alt="Nosotros"
              onError={(event) => {
                const target = event.currentTarget;
                target.style.display = "none";
              }}
            />
          </div>
          <div className="nos-txt">
            <div className="nos-q">
              "Así como Guillaume de l'Hôpital tenía una regla para resolver sus problemas, nosotros tenemos una: <span>¡Salir a rodar!</span>"
            </div>
            <p className="nos-body">
              Somos una empresa mexicana fundada por <strong>amantes de las motocicletas</strong> con 17 años de experiencia en la industria de la seguridad. Nuestra misión: traer a México las <strong>mejores marcas del mundo</strong> para llevar cada salida al siguiente nivel.
            </p>
            <div>
              <span className="pill">Calidad</span>
              <span className="pill">Desempeño</span>
              <span className="pill">Comodidad</span>
              <span className="pill">Estética</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="top-picks">
        <div className="sec-lbl">Más vendidos</div>
        <div className="sec-ttl">TOP <em>picks</em></div>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`tab ${selected === tab.value ? "on" : ""}`}
              onClick={() => setSelected(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pg" id="pg">
          {products
            .filter((product) => selected === "all" || product.dataset === selected)
            .map((product) => (
              <div className="pc" data-b={product.dataset} key={product.id}>
                <div className="pi">
                  {product.image ? (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(event) => {
                          const target = event.currentTarget;
                          target.style.display = "none";
                          const next = target.nextElementSibling as HTMLElement | null;
                          if (next) next.style.display = "block";
                        }}
                      />
                      <span className="pi-ph" style={{ display: "none" }}>
                        {product.placeholder}
                      </span>
                    </>
                  ) : (
                    <span className="pi-ph">{product.placeholder}</span>
                  )}
                  <span className="pbadge">{product.badge}</span>
                </div>
                <div className="pinfo">
                  <div className="pbrand">{product.brand}</div>
                  <div className="pname">{product.name}</div>
                  <div className="pfoot">
                    <span className="pprice">{product.price}</span>
                    <div className="pwa">
                      <svg viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <div className="mani">
        <div className="mani-lbl">Raise the Standard</div>
        <p className="mani-q">"Elegancia e innovación para quienes entienden que rodar es un arte."</p>
        <div className="mani-line" />
        <p className="mani-auth">Lhopital Moto · Est. 2021 · CDMX, México</p>
      </div>

      <div className="sec" id="contacto" style={{ padding: 0 }}>
        <div className="ct-grid">
          <div className="ct-l">
            <div className="sec-lbl">Pedidos & Contacto</div>
            <div className="sec-ttl" style={{ marginBottom: "10px" }}>
              HAZ TU <em>pedido</em>
            </div>
            <p className="ct-body">
              Escríbenos por WhatsApp o correo para consultar disponibilidad, precios y tallas. Somos el distribuidor máster de Beeline en México.
            </p>
            <button className="wa-btn" type="button">
              <svg style={{ width: 14, height: 14, fill: "#fff" }} viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escribir por WhatsApp
            </button>
          </div>
          <div className="ct-r">
            <div className="ci">
              <span className="ci-l">WhatsApp</span>
              <span className="ci-v">+52 (56) 2162 7604</span>
            </div>
            <div className="ci">
              <span className="ci-l">Email</span>
              <span className="ci-v">contacto@lhopital.mx</span>
            </div>
            <div className="ci">
              <span className="ci-l">Instagram</span>
              <span className="ci-v">@lhopitalmx</span>
            </div>
            <div className="ci">
              <span className="ci-l">Pagos</span>
              <span className="ci-v">Mercado Pago · Transferencia</span>
            </div>
            <div className="ci">
              <span className="ci-l">Ubicación</span>
              <span className="ci-v">CDMX, México</span>
            </div>
          </div>
        </div>
      </div>

      <div className="foot">
        <span className="foot-brand">LHOPITAL MOTO</span>
        <span className="foot-copy">© 2025 · Raise the Standard · CDMX, MX</span>
        <div className="foot-links">
          <a href="#marcas">Marcas</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#top-picks">Productos</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
    </div>
  );
}
