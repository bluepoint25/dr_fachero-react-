// src/App.jsx
// -------------------------------------------------------
// Punto de entrada de la UI.
// - Mantiene el estado de qué “página” se muestra.
// - Renderiza el Navbar y, según el estado, Welcome o Funcionalidades.
// - Recuerda la última página visitada y hace scroll arriba al cambiar.
// -------------------------------------------------------

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome.jsx";
import Funcionalidades from "./pages/Funcionalidades.jsx";
import Porque from "./pages/porque.jsx";
import Blog from "./pages/blog.jsx";
import PLanes from "./pages/planes.jsx";
import Contacto from "./pages/Contacto.jsx";


function App() {
  // Lee la última página visitada (si existe) o inicia en "inicio"
  const [pagina, setPagina] = useState(
    () => localStorage.getItem("pagina_activa") || "inicio"
  );

  // Cada vez que cambia la página:
  // - Guarda la selección
  // - Ajusta el título del documento
  // - Sube el scroll al top (evita quedar a mitad de página)
  useEffect(() => {
    localStorage.setItem("pagina_activa", pagina);
    document.title =
      pagina === "funcionalidades"
        ? "Funcionalidades — Dr. Fachero"
        : "Inicio — Dr. Fachero";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pagina]);

  return (
    <>
      {/* Barra fija superior: controla navegación vía props */}
      <Navbar pagina={pagina} setPagina={setPagina} />

      {/* Contenido principal (el CSS ya deja margen-top por la barra) */}
      <main>
        {pagina === "inicio" && <Welcome setPagina={setPagina} />}
        {pagina === "funcionalidades" && <Funcionalidades />}
        {pagina === "porque" && <Porque setPagina={setPagina} />}
        {pagina === "blog" && <Blog />}
        {pagina === "planes" && <PLanes  setPagina={setPagina} />}
        {pagina === "contacto" && <Contacto />}
      </main>
      <Footer pagina={pagina} setPagina={setPagina} />
    </>
  );

}

export default App;
