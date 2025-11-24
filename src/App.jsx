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
import Login from "./pages/Login.jsx";



const pageTitles ={
  inicio:"Inicio",
  funcionalidades:"Funcionalidades",
  porque:"¿Porque?",
  blog:"Blog",
  planes:"PLanes",
  contacto:"Contacto",
  login:"Login",
  dashboard_estandar:"Mi Consultorio",
  dashboard_pro:"Centro de Gestion",
};

function App() {
  const[userPlan,setUserPlan]=useState(
    () => localStorage.getItem("user_plan") || null
  );
  const [userName, setUserName] = useState(
    ()=> localStorage.getItem("user_name")||null
  );
  const defaultPage = userPlan ? `dashboard_${userPlan}` :"inicio";

  const [pagina, setPagina] =useState(
    ()=> localStorage.getItem("pagina_activa")|| defaultPage

  );
  const handleLogin =(plan, name)=>{
    setUserPlan(plan);
    setUserName(name);
    localStorage.setItem("user_plan");
    localStorage.setItem("user_name");
    setPagina(`dashboard_${plan}`);
  };

  const handleLogout =()=>{
    setUserPlan(null);
    setUserName(null);
    localStorage.removeItem("user_plan");
    localStorage.removeItem("user_name");
    localStorage.removeItem("pagina_activa");
    setPagina("inicio");
  };

  useEffect(()=>{
    const isDashboard = pagina.startsWith("dashboard_");
    

    if (!userPlan && isDashboard){
      setPagina("login");
      return;
    }
    if(!isDashboard && pagina !=="login"){
      localStorage.setItem("pagina_activa","pagina");
    }
    const title =pageTitles[pagina]|| "Dr. Fachero" ;
    document.title =`${title}- Dr.Fachero`;

    window.scrollTo({top: 0,behavior:"instant"});

  },[pagina,userPlan]);

  //dashboard estarndar
// Dashboard para Plan Estándar
  const DashboardEstandar = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#00b050', marginBottom: '10px' }}>Hola, {userName}</h1>
      <h2 style={{ color: '#00b050', fontSize: '1.8rem' }}>Dashboard Dr. Estándar 🟢</h2>
      <p style={{ marginTop: '20px', lineHeight: '1.6' }}>
        **Tu plan incluye:** Agenda Online Inteligente, Ficha Clínica Estándar,
        gestión de hasta 20 pacientes y 1 usuario profesional.
      </p>
      <p style={{ color: '#999', fontSize: '0.9rem' }}>
        Mejora al Plan Pro para desbloquear reportes avanzados, facturación y usuarios ilimitados.
      </p>
      <button 
        className="btn-cta btn-cta--ghost"
        onClick={handleLogout}
        style={{ marginTop: '25px', borderColor: '#00b050', color: '#00b050' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
// Dashboard para Plan Pro (más funcionalidades)
  const DashboardPro = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Hola, {userName}</h1>
      <h2 style={{ color: '#830cc4', fontSize: '1.8rem' }}>Dashboard Dr. Pro 👑</h2>
      <p style={{ marginTop: '20px', fontWeight: 600, lineHeight: '1.6' }}>
        ¡Tienes acceso completo! Facturación Electrónica, Reportes Avanzados, Portal del Paciente y Usuarios Ilimitados.
      </p>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>
        La mejor herramienta de gestión para tu centro médico.
      </p>
      <button 
        className="btn-cta btn-cta--primary"
        onClick={handleLogout}
        style={{ marginTop: '25px', background: '#830cc4' }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
  let pageContent ;
  const isPrivate = pagina.startsWith("dashboard_");
  if (!userPlan &&  pagina==="login"){
    pageContent = <Login onLogin={handleLogin}/>;

  }else if (isPrivate){
    pageContent= userPlan === "pro" ? <DashboardPro/> 
    : userPlan === "estandar" ? <DashboardEstandar/>
    : <Welcome setPagina={setPagina}/>;
  }else {
    pageContent = pagina ==="funcionalidades" ? <Funcionalidades/>
    : pagina === "porque" ? <Porque setPagina={setPagina}/>
    : pagina === "blog" ? <Blog/>
    : pagina === "planes" ? <PLanes setPagina={setPagina}/>
    : pagina === "contacto "? <Contacto />
    : <Welcome setPagina={setPagina}/>;


  }
  const showPublicNavAndFooter = !isPrivate && pagina !=="login";
return (
    <>
      {/* 6. NavBar: solo visible en páginas públicas */}
      {showPublicNavAndFooter && (
        <Navbar 
          pagina={pagina} 
          setPagina={setPagina} 
          userPlan={userPlan} 
        />
      )}

      {/* Contenido principal: ajustamos el margen superior si el Navbar está oculto */}
      <main style={showPublicNavAndFooter ? {} : { marginTop: 0 }}>
        {pageContent}
      </main>
      
      {/* 7. Footer: solo visible en páginas públicas */}
      {showPublicNavAndFooter && (
        <Footer 
          pagina={pagina} 
          setPagina={setPagina} 
        />
      )}
    </>
  );
}

export default App;
