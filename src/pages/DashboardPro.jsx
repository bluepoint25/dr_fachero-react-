// src/pages/DashboardPro.jsx
import React from 'react';
import BarChart from '../components/BarChart.jsx';
import UserManagement from '../components/UserManagement.jsx';
import CalendarModule from '../components/CalendarModule.jsx'; 
// Eliminamos las importaciones de imágenes que ya no se usan (drficha2.png, ficha3.png)


// Estilo básico para simular un módulo/tarjeta del dashboard
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    padding: '20px',
    textAlign: 'left',
    marginBottom: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
};

// --- ESTILOS DE MENÚ SUPERIOR ---
const topMenuStyle = {
    background: '#830cc4',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '12px',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};

const topMenuItemsStyle = {
    display: 'flex',
    gap: '20px',
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const topMenuItemStyle = {
    padding: '5px 10px',
    fontWeight: 600,
    // Estilos de opacidad y transición aplicados al li
    opacity: 0.85,
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap',
};
// ----------------------------------------


const MockCitas = () => (
    <div style={cardStyle}>
        <h4 style={{ color: '#4a0376', margin: '0 0 10px' }}>Estado de Citas</h4>
        <ul style={{ listStyle: 'none', padding: '0', fontSize: '14px', color: '#555' }}>
            <li><span style={{ color: '#830cc4', fontWeight: 800 }}>★</span> Reservadas</li>
            <li><span style={{ color: '#00b050', fontWeight: 800 }}>●</span> En espera</li>
            <li><span style={{ color: '#e35c5c', fontWeight: 800 }}>●</span> Canceladas</li>
        </ul>
        <div style={{ marginTop: '20px', fontSize: '12px' }}>
        </div>
    </div>
);


export default function DashboardPro({ userName, handleLogout, setPagina }) { // Recibe setPagina
  
  // Función para manejar la navegación a las páginas de módulos
  const navigateTo = (page) => {
      setPagina(page);
  };


  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
      
      {/* --------------------------------- */}
      {/* 1. MENÚ DE NAVEGACIÓN SUPERIOR */}
      {/* --------------------------------- */}
      <div style={topMenuStyle}>
        
        {/* Logo/Botón para volver al Dashboard principal */}
        <button 
            onClick={() => navigateTo('dashboard_pro')}
            style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
        >
            Dr. Fachero
        </button>
        
        <ul style={topMenuItemsStyle}>
          {/* BOTONES FUNCIONALES */}
          <li style={{...topMenuItemStyle, opacity: 1}}>
              <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('pacientes')}>Pacientes</button>
          </li>
          <li style={topMenuItemStyle}>
              <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('agenda_medica')}>Agenda médica</button>
          </li>
          <li style={topMenuItemStyle}>
              <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('recetas_medicas')}>Recetas médicas</button>
          </li>
        </ul>

        <button 
          onClick={handleLogout}
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', 
            padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* --------------------------------- */}
      {/* 2. CONTENIDO PRINCIPAL Y CUERPO (El Dashboard en sí) */}
      {/* --------------------------------- */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px', textAlign: 'left' }}>
          <h1 style={{ color: '#830cc4', margin: '0' }}>Bienvenido, {userName}</h1>
          <h2 style={{ color: '#830cc4', fontSize: '1.5rem', fontWeight: 600 }}>Centro de Gestión Dr. Pro 👑</h2>
        </header>
        
        {/* GRUPO DE MÓDULOS SUPERIORES (3 COLUMNAS: Gráfico | Estado | Camas) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
          
          {/* COLUMNA 1: Gráfico de Barras */}
          <div style={{ gridColumn: 'span 2' }}><BarChart /></div> 


          {/* COLUMNA 3: Gestión de Camas (Mockup Visual) */}
        </div>
        
        {/* GRUPO DE MÓDULOS INTERMEDIOS (3 COLUMNAS: Calendario | Agenda | Ficha) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
            
            {/* MÓDULO 4: CALENDARIO DINÁMICO (CalendarModule) */}
            <div style={{ gridColumn: 'span 1' }}><CalendarModule /></div>

            {/* MÓDULO 5: Agenda Médica (Mockup Visual) */}

            
            {/* MÓDULO 6: Ficha Clínica (Mockup Visual) */}

        </div>

        {/* SECCIÓN INFERIOR: Gestión de Usuarios (Nuevo, Full Width) */}
        <div style={{ marginTop: '20px' }}><UserManagement /></div>

      </div>
    </div>
  );
}