// src/pages/porque.jsx
// -------------------------------------------------------
// Página que muestra ¿Por qué elegir Dr. Fachero?
// Dr. Fachero. Incluye una sección "hero" blanca y una lila mas una grilla
// de tarjetas con íconos y descripciones.
// -------------------------------------------------------


import ficha3 from "../assets/ficha3.png";

function Porque({ setPagina }) {
  return (
    <section className="porque">
      {/* Sección 1: Beneficios principales */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">¿Por qué elegir Dr. Fachero?</h2>
          <p className="section-subtitle">
            Velocidad, trazabilidad y cumplimiento para tu equipo clínico.
            Nuestra plataforma está diseñada para optimizar cada aspecto de tu gestión.
          </p>

          <div className="features-grid">
            <article className="feature-card">
              <div className="icon" role="img" aria-label="cohete">🚀</div>
              <h3>Optimiza tu Tiempo</h3>
              <p>
                Reduce hasta un 70% del tiempo dedicado a tareas administrativas y
                dedícalo a lo que más importa: tus pacientes.
              </p>
            </article>

            <article className="feature-card">
              <div className="icon" role="img" aria-label="gráfico">📈</div>
              <h3>Trazabilidad Completa</h3>
              <p>
                Mantén un registro seguro y accesible del historial clínico, tratamientos
                y pagos de cada paciente en un solo lugar.
              </p>
            </article>

            <article className="feature-card">
              <div className="icon" role="img" aria-label="escudo">🛡️</div>
              <h3>Seguridad y Cumplimiento</h3>
              <p>
                Operamos bajo altos estándares de seguridad de datos para garantizar
                la confidencialidad de tu información.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Sección 2: Split texto + imagen */}
      <section className="section section-light">
        <div className="container">
          <div className="split-section">
            <div className="split-section-text">
              <div className="section-badge">DISEÑADO POR Y PARA PROFESIONALES</div>
              <h2>Una plataforma que entiende tus necesidades</h2>
              <p>
                Dr. Fachero fue desarrollado en colaboración con médicos y administradores de
                clínicas para crear una herramienta intuitiva que realmente soluciona los problemas
                del día a día. Es accesible desde cualquier dispositivo, permitiéndote gestionar tu
                consulta desde donde estés.
              </p>

              <button
                className="btn btn--primary"
                onClick={() => setPagina("funcionalidades")}
              >
                Ver todas las funcionalidades
              </button>
            </div>

            <div className="split-section-image">
              <img src={ficha3} alt="Vista del sistema Dr. Fachero" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Porque;
