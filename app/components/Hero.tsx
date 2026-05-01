export default function Hero() {
  return (
    <section className="hero">
      <img className="hero-img" src="/nosotros-moto.jpg" alt="L'HOPITAL MOTO - Premium Motorcycle Gear" />
      <div className="hero-ov"></div>
      <nav className="nav">
        <span className="nav-brand">LHOPITAL</span>
        <div className="nav-links">
          <a href="#marcas">Marcas</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#productos">Productos</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>
      <div className="hero-c">
        <span className="h-eye"><strong>EST. 2021 · CDMX · MEXICO</strong></span>
        <div className="h-title">
          WE ARE THE<br />
          <em>standard</em>
        </div>
        <div className="h-sub">Finest Motorcycle Gear</div>
        <div className="h-btns">
          <button className="btn-w">Ver Productos</button>
          <button className="btn-g">Conocer Marcas</button>
        </div>
      </div>
    </section>
  );
}

