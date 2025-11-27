// src/pages/DashboardEstandar.jsx
import React from 'react';

// Estilos de menú importados del DashboardPro para consistencia
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

// Estilo para la tarjeta principal del dashboard
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    padding: '30px',
    textAlign: 'left',
    marginTop: '20px'
};

export default function DashboardEstandar({ userName, handleLogout }) {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
        
        {/* MENÚ SUPERIOR BÁSICO */}
        <div style={topMenuStyle}>
            <h2 style={{ fontSize: '1.5rem', margin: '0', fontWeight: 800 }}>Dr. Fachero</h2>
            
            <ul style={topMenuItemsStyle}>
                <li style={{...topMenuItemStyle, opacity: 1}}>Pacientes</li>
                <li style={topMenuItemStyle}>Agenda médica</li>
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
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: 2 }}>
                    <li>📅 Agenda Online Inteligente</li>
                    <li>📋 Ficha Clínica Estándar</li>
                    <li>👥 Gestión de hasta 20 pacientes</li>
                    <li>👤 1 usuario profesional</li>
                </ul>
                <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#555', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    **Aviso:** Mejora al Plan Pro para desbloquear funcionalidades avanzadas como Reportes, Facturación y usuarios ilimitados.
                </p>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        // Simulación de navegación a la página de planes
                        onClick={() => window.location.hash = "#planes"} 
                        className="btn-cta btn-cta--primary"
                        style={{ background: '#00b050', color: '#fff' }}
                    >
                        Ver Opciones de Mejora (Plan Pro)
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}