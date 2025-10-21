// src/pages/Welcome.jsx
// -------------------------------------------------------
// Componente principal de bienvenida de Dr. Fachero.
// Contiene la introducción, imágenes informativas y un
// banner animado (gif) al final.
// -------------------------------------------------------
import imgprincipal from "../assets/draenmaorada3.png"; // Imagen principal (doctora)
import ficha from "../assets/drficha2.png";              // Imagen de ficha médica
import ficha2 from "../assets/ficha3.png";               // Segunda ficha informativa
import gif from "../assets/fiestas_real.gif";      // Banner animado

function Welcome({ setPagina }) {
  return (
    <>
      {/* -------------------------------------------- */}
      {/* 1️⃣ Hero principal: título + texto + imagen */}
      {/* -------------------------------------------- */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            La gestión de tu consulta, simple y moderna.
          </h1>
          <p className="hero-text">
            Dr. Fachero te devuelve el control de tu tiempo. Menos papeleo, más
            dedicación a lo que de verdad importa: tus pacientes.
          </p>

          <div className="cta-group">
            <button
              type="button"
              className="btn-cta btn-cta--primary"
              onClick={() => setPagina("planes")}
            >
              Ver Planes
            </button>

            <button
              type="button"
              className="btn-cta btn-cta--ghost"
              onClick={() => setPagina("porque")}
            >
              Conocer Más
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img src={imgprincipal} alt="Profesional de salud con ficha" />
        </div>
      </section>

      {/* -------------------------------------------- */}
      {/* 2️⃣ Ficha informativa principal */}
      {/* -------------------------------------------- */}
        {/* Sección: imagen izquierda + texto derecha */}
        <section className="about-split">
          {/* Columna 1: imagen en tarjeta */}
          <figure className="about-mock">
            <img src={ficha} alt="Vista del panel Dr. Fachero" />
          </figure>

          {/* Columna 2: texto + CTA */}
          <div className="about-text">
            <h2 className="about-title">¿Qué es Dr. Fachero?</h2>
            <p className="about-lead">
              Dr. Fachero es una plataforma innovadora diseñada para simplificar la
              gestión de consultorios médicos. Nuestra misión es reducir el tiempo que
              los profesionales de la salud dedican a tareas administrativas, permitiéndoles
              enfocarse más en el cuidado de sus pacientes.
            </p>

            <button
              type="button"
              className="btn-cta btn-cta--primary about-cta"
              onClick={() => setPagina("funcionalidades")}
            >
              Conoce las Funcionalidades
            </button>
          </div>
        </section>

      {/* -------------------------------------------- */}
      {/* 3️⃣ Segunda sección con ficha complementaria */}
      {/* -------------------------------------------- */}
<section className="why-split">
  {/* Columna izquierda: imagen en “tarjeta” */}
  <figure className="why-mock">
    <img src={ficha2} alt="Panel Dr. Fachero" />
  </figure>

  {/* Columna derecha: texto limpio + bullets reales */}
  <div className="why-text">
    <p className="why-eyebrow">Tu software de confianza</p>
    <h2 className="why-title">¿Por qué elegir Dr. Fachero?</h2>
    <p className="why-lead">
      Con Dr. Fachero, los médicos pueden gestionar citas, historiales clínicos
      y facturación de manera eficiente y segura. Nuestra plataforma es fácil
      de usar y accesible desde cualquier dispositivo.
    </p>

    <ul className="why-list">
      <li>✅ Un solo software, todos tus procesos integrados.</li>
      <li>🔒 Hosting seguro en servidores certificados.</li>
      <li>💬 Soporte local y personalizado.</li>
    </ul>
  </div>
</section>


      {/* -------------------------------------------- */}
      {/* 4️⃣ Banner animado final (GIF) */}
      {/* -------------------------------------------- */}
      <div className="gif">
        <img src={gif} alt="Banner Halloween" />
      </div>
    </>
  );
}

export default Welcome;
