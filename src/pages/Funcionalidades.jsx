// src/pages/Funcionalidades.jsx
// -------------------------------------------------------
// Página que muestra las funcionalidades principales de
// Dr. Fachero. Incluye una sección "hero" lilá y una grilla
// de tarjetas con íconos y descripciones.
// -------------------------------------------------------

function Funcionalidades() {
  return (
    <main>
      {/* -------------------------------------------- */}
      {/* 1️⃣ Hero principal (encabezado lilá) */}
      {/* -------------------------------------------- */}
      <section className="func-hero">
        <h1>Herramientas diseñadas para potenciar tu consulta</h1>
        <p>
          Hemos creado cada funcionalidad pensando en la simplicidad y la
          eficiencia, para que puedas enfocarte en lo más importante: tus
          pacientes.
        </p>
      </section>

      {/* -------------------------------------------- */}
      {/* 2️⃣ Grilla de funcionalidades */}
      {/* -------------------------------------------- */}
      <section className="func-grid">
        <article className="func-card">
          <div className="icon">🗂️</div>
          <h3>Fichas Clínicas Digitales</h3>
          <p>
            Accede al historial completo de tus pacientes de forma segura,
            ordenada y desde cualquier lugar.
          </p>
        </article>

        <article className="func-card">
          <div className="icon">📅</div>
          <h3>Agenda Online Inteligente</h3>
          <p>
            Gestiona tus citas, bloquea horarios y reduce ausencias con
            recordatorios automáticos.
          </p>
        </article>

        <article className="func-card">
          <div className="icon">🔐</div>
          <h3>Accesos por Rol</h3>
          <p>
            Asigna permisos a tu equipo (secretaría, asistente) manteniendo la
            confidencialidad de la información.
          </p>
        </article>

        <article className="func-card">
          <div className="icon">💳</div>
          <h3>Facturación y Pagos</h3>
          <p>
            Emite boletas y gestiona pagos de tus consultas de manera automática
            y sin complicaciones.
          </p>
        </article>

        <article className="func-card">
          <div className="icon">📊</div>
          <h3>Reportes y Estadísticas</h3>
          <p>
            Obtén datos clave del rendimiento de tu consulta para tomar mejores
            decisiones.
          </p>
        </article>

        <article className="func-card">
          <div className="icon">✅</div>
          <h3>Validaciones en Tiempo Real</h3>
          <p>
            Verificamos los datos al instante para minimizar errores en la ficha
            del paciente.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Funcionalidades;
