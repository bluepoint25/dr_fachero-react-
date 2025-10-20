// src/components/Navbar.jsx
// -------------------------------------------------------
// Barra superior fija que muestra el logo de Dr. Fachero
// y permite cambiar de página mediante props (sin router).
// -------------------------------------------------------

import logodr from "../assets/logo_drfachero.png";

function Navbar({ pagina, setPagina }) {
  return (
    <header className="barra">
      {/* Logo + nombre */}
      <div className="logo-barra">
        <img src={logodr} alt="Logo de Dr. Fachero" />
        <h2 className="texto-logo">Dr. Fachero</h2>
      </div>

      {/* Navegación */}
      <nav className="nav-links" aria-label="Navegación principal">
        <button
          type="button"
          className={`nav-btn ${pagina === "inicio" ? "active" : ""}`}
          onClick={() => setPagina("inicio")}
          aria-current={pagina === "inicio" ? "page" : undefined}
        >
          Inicio
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "funcionalidades" ? "active" : ""}`}
          onClick={() => setPagina("funcionalidades")}
          aria-current={pagina === "funcionalidades" ? "page" : undefined}
        >
          Funcionalidades
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "porque" ? "active" : ""}`}
          onClick={() => setPagina("porque")}
          aria-current={pagina === "porque" ? "page" : undefined}
        >
          ¿Por qué?
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "blog" ? "active" : ""}`}
          onClick={() => setPagina("blog")}
          aria-current={pagina === "blog" ? "page" : undefined}
        >
          Blog
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "planes" ? "active" : ""}`}
          onClick={() => setPagina("planes")}
          aria-current={pagina === "planes" ? "page" : undefined}
        >
          Planes
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "contacto" ? "active" : ""}`}
          onClick={() => setPagina("contacto")}
          aria-current={pagina === "contacto" ? "page" : undefined}
        >
          Contacto
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
