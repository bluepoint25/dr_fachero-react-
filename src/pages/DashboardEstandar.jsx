// src/pages/DashboardEstandar.jsx
import React from 'react';

// Estilos de menú (reutilizados para consistencia)
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
    cursor: 'pointer',
    opacity: 0.85,
    transition: 'opacity 0.2s',
    whiteSpace: 'nowrap',
};

// Estilo para la tarjeta principal del dashboard (con diseño visual mejorado)
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    border: '2px solid #00b050', // Borde verde para destacar el plan Estándar
    padding: '30px',
    textAlign: 'left',
    marginTop: '20px'
};

// Estilo para las características del plan (Cuadrícula)
const featureGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '15px',
    listStyle: 'none',
    padding: 0,
    marginBottom: '20px',
};

const featureItemStyle = {
    padding: '10px',
    background: '#e0ffe0', // Fondo verde claro
    borderRadius: '8px',
    fontWeight: 500,
    color: '#3a0a6a',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
};

export default function DashboardEstandar({ userName, handleLogout, setPagina }) {
  
  const navigateTo = (page) => {
    setPagina(page);
  };
    
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
        
        {/* MENÚ SUPERIOR BÁSICO */}
        <div style={topMenuStyle}>
            <h2 style={{ fontSize: '1.5rem', margin: '0', fontWeight: 800 }}>Dr. Fachero</h2>
            
            {/* Solo Pacientes y Agenda Médica */}
            <ul style={topMenuItemsStyle}>
                <li style={{...topMenuItemStyle, opacity: 1}}>
                    <button 
                        onClick={() => navigateTo('pacientes')} 
                        style={{ all: 'unset', color: 'inherit', cursor: 'pointer' }}
                    >
                        Pacientes
                    </button>
                </li>
                <li style={topMenuItemStyle}>
                    <button 
                        onClick={() => navigateTo('agenda_medica')} 
                        style={{ all: 'unset', color: 'inherit', cursor: 'pointer' }}
                    >
                        Agenda médica
                    </button>
                </li>
                                    <li style={topMenuItemStyle}>
                        <button style={{all:'unset', cursor:'pointer'}} onClick={() => navigateTo('recetas_medicas')}>
                            Recetas
                        </button>
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

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            <h1 style={{ color: '#00b050', marginBottom: '10px' }}>Hola, {userName}</h1>
            <h2 style={{ color: '#00b050', fontSize: '1.8rem' }}>Dashboard Dr. Estándar 🟢</h2>
            
            <div style={cardStyle}>
                <h3 style={{ color: '#4a0376', margin: '0 0 15px', fontSize: '1.4rem' }}>Resumen del Plan</h3>
                
                <p style={{ fontWeight: 600, marginTop: '10px' }}>Tu plan incluye:</p>
                
                {/* CUADRÍCULA DE CARACTERÍSTICAS MEJORADA */}
                <div style={featureGridStyle}>
                    <div style={featureItemStyle}>📅 Agenda Online Inteligente</div>
                    <div style={featureItemStyle}>📋 Ficha Clínica Estándar</div>
                    <div style={featureItemStyle}>👥 Gestión de hasta 20 pacientes</div>
                    <div style={featureItemStyle}>👤 1 usuario profesional</div>
                </div>

                <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#555', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    **Aviso:** Mejora al Plan Pro para desbloquear funcionalidades avanzadas como Reportes, Facturación y usuarios ilimitados.
                </p>
                

            </div>
        </div>
    </div>
  );
}