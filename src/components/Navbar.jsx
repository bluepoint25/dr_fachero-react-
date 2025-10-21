import { useEffect, useState } from "react";
import logodr from "../assets/logo_drfachero.png";

function Navbar({ pagina, setPagina }) {
  const [open, setOpen] = useState(false);

  const go = (p) => {
    setPagina(p);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // opcional: quita el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className="barra">
      {/* Logo + nombre (puede actuar como botón a inicio) */}
      <button className="logo-barra" onClick={() => go("inicio")}>
        <img src={logodr} alt="Logo de Dr. Fachero" />
        <h2 className="texto-logo">Dr. Fachero</h2>
      </button>

      {/* Botón hamburguesa (visible en móvil vía CSS) */}
      <button
        className={`hamburger ${open ? "is-open" : ""}`}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-controls="menu-principal"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {/* 3 barras */}
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Links */}
      <nav
        id="menu-principal"
        className={`nav-links ${open ? "open" : ""}`}
        aria-hidden={!open && window.innerWidth <= 960}
      >
        <button
          type="button"
          className={`nav-btn ${pagina === "inicio" ? "active" : ""}`}
          onClick={() => go("inicio")}
          aria-current={pagina === "inicio" ? "page" : undefined}
        >
          Inicio
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "funcionalidades" ? "active" : ""}`}
          onClick={() => go("funcionalidades")}
          aria-current={pagina === "funcionalidades" ? "page" : undefined}
        >
          Funcionalidades
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "porque" ? "active" : ""}`}
          onClick={() => go("porque")}
          aria-current={pagina === "porque" ? "page" : undefined}
        >
          ¿Por qué?
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "blog" ? "active" : ""}`}
          onClick={() => go("blog")}
          aria-current={pagina === "blog" ? "page" : undefined}
        >
          Blog
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "planes" ? "active" : ""}`}
          onClick={() => go("planes")}
          aria-current={pagina === "planes" ? "page" : undefined}
        >
          Planes
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "contacto" ? "active" : ""}`}
          onClick={() => go("contacto")}
          aria-current={pagina === "contacto" ? "page" : undefined}
        >
          Contacto
        </button>
      </nav>

      {/* Overlay: DEBE ir después del <nav> (hermano) para que funcione .nav-links.open ~ .nav-overlay */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
    </header>
  );
}

export default Navbar;
