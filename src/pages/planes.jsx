import contacto from "../assets/contacto.png"


export default function PLanes(){
    return(
        <main className="planes">
        <h1>Planes diseñados para ti</h1>   
        <p>Elige la solución que mejor se adapte al tamaño y las necesidades de tu consulta. Sin contratos ni costos ocultos.</p>         
        
        <div className="plan-estandar">
            <article className="plan-card" aria-labelledby="plan-estandar-title">
                <header className="plan-inicial">
                <h3 id="plan-estandar-title">Dr. Estándar</h3>
                <p className="precio-estandar">
                    Ideal para profesionales independientes que inician su digitalización. 
                </p>
                </header>
                <p className="precio">$0 <span>/mes</span></p>
                <ul>
                    <li>✅ 1 cuenta de profesional</li>
                    <li>✅ Agenda Online Inteligente</li>
                    <li>✅ Hasta 20 pacientes</li>
                    <li>✅ Ficha Clínica estánda</li>
                    <li>✅ Recordatorios por Email</li>
                    <li>✅ Estadistícasl</li>
                    <li>👤 1 Usuario Profesional</li>
                    
                </ul>

                <button className="btn-plan btn-outline">Elegir Plan Estándar </button>
            </article>

            <article className="plan-card plan-pro" aria-labelledby="plan-pro-title">
                <header className="plan-head">
                    <h3 id="plan-pro-title">Dr. Pro</h3>
                    <p className="plan-desc">
                        Ideal para profesionales independientes que inician su digitalización.

                    </p>

                </header>
                <p className="precio">$45.0000 <span>+ iva /mes</span>  </p>
                          <ul className="plan-list">
            <li>✅ Todo lo del plan Estándar</li>
            <li>✅ Facturación Electrónica</li>
            <li>✅ Reportes y Estadísticas Avanzadas</li>
            <li>✅ Portal del Paciente</li>
            <li>✅ Acceso anticipado a nuevas funcionalidades</li>
            <li>👥 Usuarios ilimitados</li>
          </ul>
          
          <button className="btn-plan btn-solid">Elegir Plan Pro</button>
            </article>
        </div>
        
        <section className="plan-cta">
            <div className="cta-image">
                <img src={contacto} alt="contacto por email" />
            </div>

            <div className="cta-content">
                <span className="badge">SIEMPRE CONTIGO</span>
                <h2>¿Tienes dudas o necesitas un plan a medida?</h2>
                    <p>
      Nuestro equipo de expertos está listo para ayudarte a encontrar la
      solución perfecta para tu clínica. Ofrecemos demostraciones gratuitas
      y podemos diseñar un plan personalizado para centros con necesidades
      específicas.
    </p>
     <a className="cta-btn" href="#contacto">Contáctanos</a>
            </div>

        </section>

        </main>
    );
}