// src/pages/Pacientes.jsx
import React from 'react';

// Reutilizamos el estilo del menú y tarjeta del DashboardPro
const topMenuStyle = { /* ... estilos del menú ... */ };
const cardStyle = { /* ... estilos de la tarjeta ... */ };

export default function Pacientes({ goBack }) {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
        <div style={topMenuStyle}>
            <button onClick={goBack} style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}>
                ← Volver al Dashboard
            </button>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Pacientes</span>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={cardStyle}>
                <h1 style={{ color: '#830cc4' }}>Gestión de Pacientes</h1>
                <p>Aquí se gestionará la lista completa de pacientes.</p>
            </div>
        </div>
    </div>
  );
}