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
import GestionCamas from "./pages/GestionCamas.jsx";
import FichaClinica from "./pages/FichaClinica.jsx";
import RecetasMedicas from "./pages/RecetasMedicas.jsx";


const pageToPath ={
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
  gestion_camas: "Gestión de Camas",
  ficha_clinica: "Ficha Clínica",
  recetas_medicas: "Recetas Médicas",
};
const pathToPage = Object.fromEntries(
  Object.entries(pageToPath).map(([key, value]) => [value, key])
);
const getPageFromPath = (userPlan) => {
  const defaultPage = userPlan ? `dashboard_${userPlan}` : "inicio";
  // Obtiene el pathname de la URL, ajustando la ruta raíz (/) a 'inicio'
  const currentPath = window.location.pathname === '/' 
    ? '/' 
    : `/${window.location.pathname.split('/').filter(Boolean).pop()}`;

  const pageKey = pathToPage[currentPath] || pathToPage[`/${currentPath}`];
  
  if (pageKey && Object.keys(pageToPath).includes(pageKey)) {
    return pageKey;
  }

  // Si no hay path válido, intenta con la página guardada en localStorage
  const storedPage = localStorage.getItem("pagina_activa");
  if (storedPage && Object.keys(pageToPath).includes(storedPage)) {
      return storedPage;
  }

  return defaultPage;
};

function App() {
  const [userPlan, setUserPlan] = useState(
    () => localStorage.getItem("user_plan") || null
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("user_name") || null
  );

  const [pagina, setPaginaState] = useState(
    () => getPageFromPath(userPlan)
  );

  // Función central para actualizar el estado de la página y el hash URL
  const setPagina = (pageKey, shouldReplace = false) => {
    const path = pageToPath[pageKey] || "/";
    if (shouldReplace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }
    setPaginaState(pageKey);
    
    const isDashboardOrLogin = pageKey.startsWith("dashboard_") || pageKey === "login" || pageKey === "recuperacion";
    if (!isDashboardOrLogin) {
      localStorage.setItem("pagina_activa", pageKey);
    } else {
      localStorage.removeItem("pagina_activa");
    }
  };



  const handleLogin = (name, plan) => {
    setUserPlan(plan);
    setUserName(name);
    // CORRECCIÓN: Usamos claves consistentes (camelCase)
    localStorage.setItem("userPlan", plan);
    localStorage.setItem("userName", name);
    setPagina(plan === 'pro' ? 'dashboard_pro' : 'dashboard_estandar');
  };

  // Maneja el Logout
  const handleLogout = () => {
    setUserPlan('');
    setUserName('');
    // CORRECCIÓN: Usamos claves consistentes (camelCase)
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userName");
    localStorage.removeItem("pagina_activa");
    setPagina('login', true); 
  };
  
  // 1. Maneja la navegación del navegador (botón atrás/adelante)
  useEffect(() => {
    const handleHashChange = () => {
      setPaginaState(getPageFromPath(userPlan)); // Usamos userPlan en la llamada
      window.scrollTo({top: 0,behavior:"instant"});
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [userPlan]); // userPlan ahora es una dependencia para actualizar getPageFromHash si el plan cambia.
  
  
  // 2. Establece el título y maneja redirecciones forzadas
  useEffect(() => {
    const title =pageToPath[pagina]|| "Dr. Fachero" ;
    document.title =`${title} - Dr. Fachero`;

    const isDashboardModule = ['pacientes', 'agenda_medica', 'gestion_camas', 'ficha_clinica', 'recetas_medicas', 'dashboard_pro', 'dashboard_estandar'].includes(pagina);
    
    // Redirección si intenta acceder a un módulo privado sin autenticación
    if (isDashboardModule && !userPlan) {
        setPagina('login', true); 
    }
    
  }, [pagina, userPlan]);


  // --- LÓGICA DE RUTEO CONDICIONAL ---
  let pageContent;
  const isAuthenticated = !!userPlan; 

  if (isAuthenticated) {
    // 🚀 RUTEO PARA USUARIOS AUTENTICADOS (Dashboard y Módulos)
    const dashboardHome = userPlan === 'pro' ? 'dashboard_pro' : 'dashboard_estandar';
    
    switch (pagina) {
      case "dashboard_pro":
        // CORRECCIÓN: Pasamos setPagina
        pageContent = <DashboardPro userName={userName} handleLogout={handleLogout} setPagina={setPagina} />;
        break;
      case "dashboard_estandar":
        // CORRECCIÓN: Pasamos setPagina
        pageContent = <DashboardEstandar userName={userName} handleLogout={handleLogout} setPagina={setPagina} />;
        break;
      // MÓDULOS DE NAVEGACIÓN INTERNA
      case "pacientes":
        pageContent = <Pacientes goBack={() => setPagina(dashboardHome)} />;
        break;
      case "agenda_medica":
        pageContent = <AgendaMedica goBack={() => setPagina(dashboardHome)} />;
        break;
      case "gestion_camas":
        pageContent = <GestionCamas goBack={() => setPagina(dashboardHome)} />;
        break;
      case "ficha_clinica":
        pageContent = <FichaClinica goBack={() => setPagina(dashboardHome)} />;
        break;
      case "recetas_medicas":
        pageContent = <RecetasMedicas goBack={() => setPagina(dashboardHome)} />;
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
  const showPublicNavAndFooter = !isAuthenticated && pagina !== "login" && pagina !== "recuperacion";

  return (
    <>
      {showPublicNavAndFooter && <Navbar pagina={pagina} setPagina={setPagina} userPlan={userPlan} />}
      <main style={isAuthenticated ? {} : { marginTop: 60 }}> 
        <div className={!isAuthenticated ? "container" : ""}>
            {pageContent}
        </div>
      </main>
      {showPublicNavAndFooter && <Footer pagina={pagina} setPagina={setPagina} />}
    </>
  );
}

export default App;