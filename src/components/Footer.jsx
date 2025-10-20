import React from "react";
import "../App.css";
import logo from "../assets/logo_drfachero.png";

export default function Footer({ pagina, setPagina }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Columna 1: Logo + texto */}
          <div className="footer-column">
            <button
              type="button"
              className="logo linklike"
              onClick={() => setPagina("inicio")}
              aria-label="Ir a Inicio"
            >
              <img src={logo} alt="Logo Dr. Fachero en negativo" />
            </button>
            <p>Modernizando la gestión de la salud, un paciente a la vez.</p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="footer-column">
            <h4>Navegación</h4>
            <ul>
              <li>
                <button
                  type="button"
                  className={`linklike ${pagina === "funcionalidades" ? "active" : ""}`}
                  onClick={() => setPagina("funcionalidades")}
                  aria-current={pagina === "funcionalidades" ? "page" : undefined}
                >
                  Funcionalidades
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`linklike ${pagina === "planes" ? "active" : ""}`}
                  onClick={() => setPagina("planes")}
                  aria-current={pagina === "planes" ? "page" : undefined}
                >
                  Planes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`linklike ${pagina === "porque" ? "active" : ""}`}
                  onClick={() => setPagina("porque")}
                  aria-current={pagina === "porque" ? "page" : undefined}
                >
                  ¿Por qué nosotros?
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`linklike ${pagina === "blog" ? "active" : ""}`}
                  onClick={() => setPagina("blog")}
                  aria-current={pagina === "blog" ? "page" : undefined}
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div className="footer-column">
            <h4>Soporte</h4>
            <ul>
              <li>
                <button
                  type="button"
                  className={`linklike ${pagina === "contacto" ? "active" : ""}`}
                  onClick={() => setPagina("contacto")}
                  aria-current={pagina === "contacto" ? "page" : undefined}
                >
                  Contacto
                </button>
              </li>
              <li><span className="muted">Términos y Condiciones</span></li>
              <li><span className="muted">Política de Privacidad</span></li>
            </ul>
          </div>

          {/* Columna 4: Redes */}
          <div className="footer-column">
            <h4>Síguenos</h4>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Dr. Fachero. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
