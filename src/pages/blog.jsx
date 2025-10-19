// src/pages/blog.jsx
// -------------------------------------------------------
// Página que muestra el blog de Dr. Fachero?
// 
// 
// -------------------------------------------------------

import personasBlog from "../assets/personasblog.png";
import fichablog from "../assets/fichablog.png";

function Blog() {
  return (
    <section className="blog">
      {/* Cabecera del Blog */}
      <section className="blog-header">
        <div className="container">
            <h1>Blog de Dr. Fachero</h1>
            <p>
                Bienvenido al blog de Dr. Fachero, donde compartimos las últimas novedades y 
                consejos para optimizar la gestión de tu clínica.
            </p>
        </div>
    </section>

            {/* Feed de artículos */}
            <div className="blog-fedd container">
                {/* Artículo 1: Gestión Clínica */}
                <article className="full-blog-post">
                    <span className="badge badge--lilac" aria-label="Categoría: Gestión Clínica">
                        <span className="sr-only">Categoría: </span>
                        Gestión Clínica
                    </span>
                    <h2>Cómo la digitalización mejora la experiencia del paciente</h2>
                <img
                    src={personasBlog}
                    alt="Doctor mostrando tablet a un paciente"
                    className="featured-image"
                />
                <div classname="post-content">
                    <p>
                        En la era digital, las expectativas de los pacientes han cambiado. Ya no
                    solo buscan un diagnóstico certero, sino también una experiencia ágil,
                    personalizada y sin fricciones. Integrar tecnología en tu consulta no es
                    solo una modernización, es una necesidad para mantener la competitividad
                    y mejorar la calidad del servicio.
                    </p>
                    <p> 
                        La implementación de un software de gestión como Dr. Fachero permite, por
                    ejemplo, agendar citas online, reduciendo las llamadas telefónicas y
                    liberando al personal administrativo. Además, los recordatorios
                    automáticos por email o SMS disminuyen significativamente la tasa de
                    ausentismo, optimizando la agenda del profesional.
                    </p>
                    <p>
                        La ficha clínica digital, por otro lado, centraliza toda la información
                    del paciente en un solo lugar seguro y accesible, permitiendo al médico
                    tener un contexto completo en segundos y tomar decisiones más informadas
                    durante la consulta.
                    </p>
                </div>
                </article>

                {/* Artículo 2: Novedades */}
                <article className="full-blog-post">
                    <span classname="category">Novedades</span>
                    <h2>Dr. Fachero lanza nueva funcionalidad de de Reportes Avanzados</h2>
                <img
                    src={fichablog}
                    alt="Gráficos y estadísticas en una pantalla"
                    className="featured-image"
                />
                <div classname="post-content">
                    <p>
                        ¡Estamos emocionados de anunciar nuestra última actualización! A partir
                    de hoy, todos los usuarios del plan Dr. Pro tendrán acceso al nuevo
                    módulo de Reportes Avanzados. Esta herramienta está diseñada para
                    ofrecer una visión clara y detallada del rendimiento de tu clínica.
                    </p>
                    <p>Con los nuevos reportes, podrás: </p>
                    <ul>
                        <li>Analizar el flujo de pacientes por período.</li>
                        <li>Identificar los servicios más solicitados.</li>
                        <li>Gestionar la facturación y cobranza de manera más eficiente.</li>
                        <li>Evaluar el rendimiento de cada profesional de tu equipo.</li>
                    </ul>
                    <p>
                        Esta funcionalidad ha sido desarrollada con la colaboración de
                    profesionales de la salud y expertos en gestión clínica, asegurando que
                    las métricas proporcionadas sean relevantes y accionables. ¡Actualiza tu
                    plan hoy mismo y lleva la gestión de tu clínica al siguiente nivel con
                    Dr. Fachero!
                    </p>
                </div>
            </article>
        </div>
    </section>
  );
}
export default Blog;