import BackendStatus from "./backend-status";

const services = [
  {
    number: "01",
    title: "Estrategia",
    description:
      "Una dirección clara para convertir tus objetivos en decisiones que sí mueven el proyecto.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 36 19 25l7 7 14-17" />
        <path d="M29 15h11v11" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Diseño",
    description:
      "Experiencias sencillas y cuidadas, pensadas para conectar con las personas.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="9" width="30" height="30" rx="8" />
        <path d="M17 30 30 17M20 17h10v10" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Tecnología",
    description:
      "Herramientas confiables que hacen que tu idea funcione hoy y pueda crecer mañana.",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="m18 16-8 8 8 8M30 16l8 8-8 8M27 12l-6 24" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="NOVA, inicio">
          nova<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#servicios">Qué hacemos</a>
          <a href="#proceso">Cómo trabajamos</a>
          <a className="nav-cta" href="#siguiente-paso">
            Da el siguiente paso <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main>
        <section className="hero section-shell" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Ideas con intención. Resultados reales.
            </p>
            <h1>
              Lo que imaginas,
              <br />
              <span>hecho realidad.</span>
            </h1>
            <p className="hero-description">
              Damos forma a ideas con estrategia, diseño y tecnología. Un buen
              proyecto empieza con una dirección clara y crece con cada decisión.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#servicios">
                Descubre lo que hacemos <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#proceso">
                Conoce nuestro proceso <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="note-line" />
              <span>Pequeños pasos. Grandes posibilidades.</span>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-sun" />
            <div className="art-card">
              <span className="art-card-label">UNA IDEA</span>
              <span className="art-card-title">
                empieza
                <br />
                aquí<span>.</span>
              </span>
              <span className="art-card-mark">N</span>
            </div>
            <span className="art-spark spark-one">✳</span>
            <span className="art-spark spark-two">✳</span>
            <span className="art-caption">DISEÑADO PARA AVANZAR</span>
          </div>
          <a className="scroll-cue" href="#servicios">
            <span className="scroll-line" />
            DESLIZA PARA DESCUBRIR
          </a>
        </section>

        <section className="services section-shell" id="servicios">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LO QUE HACEMOS</p>
              <h2>
                Una idea. El equipo
                <br />
                <span>para hacerla crecer.</span>
              </h2>
            </div>
            <p className="section-intro">
              Todo lo que necesitas para pasar de “¿y si…?” a “ya está
              sucediendo”.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span className="service-icon">{service.icon}</span>
                  <span className="service-number">{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a href="#proceso" aria-label={`Conoce nuestro proceso de ${service.title}`}>
                  Conoce nuestro proceso <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <BackendStatus />

        <section className="process" id="proceso">
          <div className="process-inner section-shell">
            <p className="eyebrow">UN PROCESO SIN VUELTAS</p>
            <h2>
              Claridad para empezar.
              <br />
              <span>Confianza para avanzar.</span>
            </h2>
            <div className="process-steps">
              <div>
                <span>01 / ESCUCHAMOS</span>
                <p>Entendemos tu idea y lo que quieres lograr.</p>
              </div>
              <div>
                <span>02 / CREAMOS</span>
                <p>Le damos forma con un plan claro y compartido.</p>
              </div>
              <div>
                <span>03 / LANZAMOS</span>
                <p>Hacemos que suceda y seguimos creciendo contigo.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="closing section-shell" id="siguiente-paso">
          <div className="closing-mark" aria-hidden="true">
            ✳
          </div>
          <p className="eyebrow">EL SIGUIENTE PASO ES TUYO</p>
          <h2>
            ¿Y si lo hacemos
            <br />
            <span>posible?</span>
          </h2>
          <a className="button button-dark" href="#servicios">
            Explora los servicios <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#inicio">
          nova<span>.</span>
        </a>
        <p>Ideas con intención. Hechas para avanzar.</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </>
  );
}
