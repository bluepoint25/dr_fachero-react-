import { useEffect, useState } from "react";
import logodr from "../assets/logo_drfachero.png";

function Navbar({ pagina, setPagina, userPlan }) {
  const [open, setOpen] = useState(false);

  const go = (p) => {
    setPagina(p);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Bloquea el scroll en móvil cuando el menú está abierto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const authPage = userPlan ? `dashboard_${userPlan}` : "login"; 
  const authText = userPlan ? "Mi Dashboard" : "Iniciar Sesión";

  return (
    <header className="barra">
      {/* Logo + nombre */}
      <button className="logo-barra" onClick={() => go("inicio")}>
        <img src={logodr} alt="Logo de Dr. Fachero" />
        <h2 className="texto-logo">Dr. Fachero</h2>
      </button>

      {/* Botón hamburguesa (móvil) */}
      <button
        className={`hamburger ${open ? "is-open" : ""}`}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((v) => !v)}
      >
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
        >
          Inicio
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "funcionalidades" ? "active" : ""}`}
          onClick={() => go("funcionalidades")}
        >
          Funcionalidades
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "planes" ? "active" : ""}`}
          onClick={() => go("planes")}
        >
          Planes
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "blog" ? "active" : ""}`}
          onClick={() => go("blog")}
        >
          Blog
        </button>

       <button
          type="button"
          className={`nav-btn ${pagina === "porque" ? "active" : ""}`}
          onClick={() => go("porque")}
        >
          ¿Por qué?
        </button>

        <button
          type="button"
          className={`nav-btn ${pagina === "contacto" ? "active" : ""}`}
          onClick={() => go("contacto")}
        >
          Contacto
        </button>

        {/* --- BOTÓN CREAR CUENTA (Solo visible si NO hay sesión) --- */}
        {!userPlan && (
            <button
              type="button"
              className={`nav-btn ${pagina === "registro" ? "active" : ""}`}
              onClick={() => go("registro")}
              // Le damos un color morado para destacarlo sutilmente del resto
              style={{ color: '#830cc4', fontWeight: '700' }}
            >
              Crear Cuenta
            </button>
        )}

        {/* Botón Principal (Login o Dashboard) */}
        <button
          type="button"
          className={`nav-btn btn-cta-primary ${pagina === authPage ? "active" : ""}`}
          onClick={()=> go(authPage)}
          style={{ 
              color: '#fff', 
              background: 'var(--color-primary-strong)',
              padding: '8px 14px',
              borderRadius: '12px',
              fontWeight: '600',
              boxShadow: '0 4px 10px rgba(131, 12, 196, 0.2)'
          }}
        >
          {authText}
        </button>
      </nav>

      {/* Overlay para cerrar al hacer click fuera */}
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
    </header>
  );
}

export default Navbar;