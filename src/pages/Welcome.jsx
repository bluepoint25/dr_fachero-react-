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

function Welcome() {
  return (
    <main>
      {/* -------------------------------------------- */}
      {/* 1️⃣ Hero principal: título + texto + imagen */}
      {/* -------------------------------------------- */}
      <section className="contenedor-titulo">
        <div>
          <h1 className="titulo_principal">
            La gestión de tu consulta, simple y moderna.
          </h1>
          <p>
            Dr. Fachero te devuelve el control de tu tiempo. Menos papeleo, más
            dedicación a lo que de verdad importa: tus pacientes.
          </p>
        </div>

        {/* Imagen lateral del hero */}
        <img
          src={imgprincipal}
          alt="Imagen de bienvenida"
          className="imagen-principal"
        />
      </section>

      {/* -------------------------------------------- */}
      {/* 2️⃣ Ficha informativa principal */}
      {/* -------------------------------------------- */}
      <div className="ficha">
        <img src={ficha} alt="Ficha médica" />
      </div>

      <section className="texto-ficha">
        <h2>¿Qué es Dr. Fachero?</h2>
        <p>
          Dr. Fachero es una plataforma innovadora diseñada para simplificar la
          gestión de consultorios médicos. Nuestra misión es reducir el tiempo
          que los profesionales de la salud dedican a tareas administrativas,
          permitiéndoles enfocarse más en el cuidado de sus pacientes.
        </p>
      </section>

      {/* -------------------------------------------- */}
      {/* 3️⃣ Segunda sección con ficha complementaria */}
      {/* -------------------------------------------- */}
      <div className="ficha2">
        <img src={ficha2} alt="Ficha informativa adicional" />
      </div>

      <section className="texto-ficha2">
        <h3>TU SOFTWARE DE CONFIANZA</h3>
        <h2>¿Por qué elegir Dr. Fachero?</h2>
        <p>
          Con Dr. Fachero, los médicos pueden gestionar citas, historiales
          clínicos y facturación de manera eficiente y segura. Nuestra
          plataforma es fácil de usar y accesible desde cualquier dispositivo.
          <br />
          ✅ Un solo software, todos tus procesos integrados.
          <br />
          🔒 Hosting seguro en servidores certificados.
          <br />
          💬 Soporte local y personalizado.
        </p>
      </section>

      {/* -------------------------------------------- */}
      {/* 4️⃣ Banner animado final (GIF) */}
      {/* -------------------------------------------- */}
      <div className="gif">
        <img src={gif} alt="Banner Halloween" />
      </div>
    </main>
  );
}

export default Welcome;
