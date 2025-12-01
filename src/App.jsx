// src/App.jsx
// -------------------------------------------------------
// Punto de entrada de la UI.
// Implementa el ruteo básico basado en el hash (#).
// Mantiene el estado de autenticación (userName, userPlan).
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
import Login from "./pages/Login.jsx";
import Recuperacion from "./pages/Recuperacion.jsx";
import DashboardEstandar from "./pages/DashboardEstandar.jsx"; 
import DashboardPro from "./pages/DashboardPro.jsx";
// --- Importación de Módulos del Dashboard ---
import Pacientes from "./pages/Pacientes.jsx";
import AgendaMedica from "./pages/AgendaMedica.jsx";
import RecetasMedicas from "./pages/RecetasMedicas.jsx";


const pageTitles ={
  inicio:"Inicio",
  funcionalidades:"Funcionalidades",
  porque:"¿Por qué?",
  blog:"Blog",
  planes:"Planes",
  contacto:"Contacto",
  login:"Login",
  recuperacion:"Recuperación de Contraseña",
  dashboard_estandar:"Mi Consultorio",
  dashboard_pro:"Centro de Gestion",
  pacientes: "Pacientes",
  agenda_medica: "Agenda Médica",
  recetas_medicas: "Recetas Médicas",
};

// Obtiene la página del hash URL, por defecto 'inicio'
function getPageFromHash(userPlan){
  // Si el usuario tiene plan, la página por defecto es su dashboard
  const defaultPage = userPlan ? `dashboard_${userPlan}` : "inicio"; 
  const hash = window.location.hash.substring(1).toLowerCase();
  
  if (hash && Object.keys(pageTitles).includes(hash)) {
    return hash;
  }

  const storedPage = localStorage.getItem("pagina_activa");
  if (storedPage && Object.keys(pageTitles).includes(storedPage)) {
      return storedPage;
  }

  return defaultPage;
}


function App() {
  // CORRECCIÓN CLAVE: Inicialización de estado con OR (|| '') para evitar nulos.
  const [userPlan, setUserPlan] = useState(
    () => localStorage.getItem("userPlan") || '' 
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || ''
  );

  const [pagina, setPaginaState] = useState(
    () => getPageFromHash(userPlan)
  );

  // Función central para actualizar el estado de la página y el hash URL
  const setPagina = (pageKey, shouldReplace = false) => {
    const hash = `#${pageKey}`;
    if (shouldReplace) {
      window.history.replaceState(null, "", hash);
    } else {
      window.history.pushState(null, "", hash);
    }
    setPaginaState(pageKey);
    
    const isDashboardOrLogin = pageKey.startsWith("dashboard_") || pageKey === "login" || pageKey === "recuperacion";
    if (!isDashboardOrLogin) {
      localStorage.setItem("pagina_activa", pageKey);
    } else {
      localStorage.removeItem("pagina_activa");
    }
  };


  // Maneja el Login (recibe el plan: 'pro' o 'estandar')
  const handleLogin = (name, plan) => {
    setUserPlan(plan);
    setUserName(name);
    // Guarda SIEMPRE con las mismas claves
    localStorage.setItem("userPlan", plan);
    localStorage.setItem("userName", name);
    setPagina(plan === 'pro' ? 'dashboard_pro' : 'dashboard_estandar');
  };

  // Maneja el Logout
  const handleLogout = () => {
    setUserPlan('');
    setUserName('');
    // Limpia las claves
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userName");
    localStorage.removeItem("pagina_activa");
    setPagina('login', true); 
  };
  
  // 1. Maneja la navegación del navegador (botón atrás/adelante)
  useEffect(() => {
    const handleHashChange = () => {
      setPaginaState(getPageFromHash(userPlan)); 
      window.scrollTo({top: 0,behavior:"instant"});
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [userPlan]);
  
  
  // 2. Establece el título y maneja redirecciones forzadas
  useEffect(() => {
    const title =pageTitles[pagina]|| "Dr. Fachero" ;
    document.title =`${title} - Dr. Fachero`;

    const isDashboardModule = ['pacientes', 'agenda_medica', 'recetas_medicas', 'dashboard_pro', 'dashboard_estandar'].includes(pagina);
    
    // Redirección si intenta acceder a un módulo privado sin autenticación
    if (isDashboardModule && !userPlan) {
        setPagina('login', true); 
    }
    
  }, [pagina, userPlan]);


  // --- LÓGICA DE RUTEO CONDICIONAL ---
  let pageContent;
  const isAuthenticated = !!userPlan; 
  
  // Función goBack específica para los módulos internos
  const getGoBackFunction = (home) => () => setPagina(home);

  if (isAuthenticated) {
    // 🚀 RUTEO PARA USUARIOS AUTENTICADOS (Dashboard y Módulos)
    const dashboardHome = userPlan === 'pro' ? 'dashboard_pro' : 'dashboard_estandar';
    const goBack = getGoBackFunction(dashboardHome);
    
    switch (pagina) {
      case "dashboard_pro":
        pageContent = <DashboardPro userName={userName} handleLogout={handleLogout} setPagina={setPagina} />;
        break;
      case "dashboard_estandar":
        pageContent = <DashboardEstandar userName={userName} handleLogout={handleLogout} setPagina={setPagina} />;
        break;
      // MÓDULOS DE NAVEGACIÓN INTERNA: AHORA PASAN setPagina Y handleLogout
      case "pacientes":
        pageContent = <Pacientes goBack={goBack} setPagina={setPagina} handleLogout={handleLogout} />;
        break;
      case "agenda_medica":
        // Pasa goBack y setPagina al módulo
        pageContent = <AgendaMedica goBack={goBack} setPagina={setPagina} handleLogout={handleLogout} />;
        break;
      case "recetas_medicas":
        // Pasa goBack y setPagina al módulo
        pageContent = <RecetasMedicas goBack={goBack} setPagina={setPagina} handleLogout={handleLogout} />;
        break;
      default:
        // Por defecto, muestra el dashboard según el plan
        pageContent = userPlan === "pro" 
          ? <DashboardPro userName={userName} handleLogout={handleLogout} setPagina={setPagina} /> 
          : <DashboardEstandar userName={userName} handleLogout={handleLogout} setPagina={setPagina} />;
        break;
    }
  } else {
    // 🌎 RUTEO PÚBLICO (Incluyendo Login y Recuperación)
    switch (pagina) {
      case "login":
        pageContent = <Login onLogin={handleLogin} setPagina={setPagina} />;
        break;
      case "funcionalidades":
        pageContent = <Funcionalidades setPagina={setPagina} />;
        break;
      case "porque":
        pageContent = <Porque setPagina={setPagina} />;
        break;
      case "blog":
        pageContent = <Blog />;
        break;
      case "planes":
        pageContent = <PLanes setPagina={setPagina} />;
        break;
      case "contacto":
        pageContent = <Contacto />;
        break;
      case "recuperacion":
        pageContent = <Recuperacion setPagina={setPagina} />;
        break;
      default:
        pageContent = <Welcome setPagina={setPagina} />;
        break;
    }
  }

  // Oculta Navbar y Footer en rutas de autenticación y privadas
const showNavbar = !isAuthenticated && pagina !== "login" && pagina !== "recuperacion";
  const showFooter = !isAuthenticated && pagina !== "recuperacion"; 

  // Ajusta el margen superior e ignora el contenedor si es una página full-bleed
  const isFullBleedPage = isAuthenticated || pagina === 'login' || pagina === 'recuperacion';

  return (
    <>
      {showNavbar && <Navbar pagina={pagina} setPagina={setPagina} userPlan={userPlan} />}
      <main style={isFullBleedPage ? { marginTop: 0, maxWidth: '100%', padding: 0 } : { marginTop: 60 }}> 
        {/* Eliminamos el div.container condicional para que el Login full-bleed funcione */}
        {pageContent}
      </main>
      {showFooter && <Footer pagina={pagina} setPagina={setPagina} />}
    </>
  );
}
export default App;