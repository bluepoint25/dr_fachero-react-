// src/pages/FichaClinica.jsx
import React, { useState } from 'react';

// Estilos Reutilizados del DashboardPro/Modulos
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

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    padding: '30px',
    textAlign: 'left',
};

// Datos simulados de un paciente
const mockPatient = {
    name: 'Javier Soto',
    age: 45,
    lastVisit: '15 Nov 2025',
    diagnosis: 'Hipertensión Crónica',
    allergies: ['Penicilina'],
    notes: [
        { date: '15 Nov 2025', text: 'Paciente refiere cefalea ocasional y mareos leves. Presión arterial: 140/90. Se ajusta dosis de Enalapril.' },
        { date: '10 Oct 2025', text: 'Control de rutina. PA estable: 130/85. Se mantiene tratamiento actual.' },
    ]
};

export default function FichaClinica({ goBack }) {
    const [activeTab, setActiveTab] = useState('historial');
    
    // Contenido de las pestañas
    const renderContent = () => {
        switch (activeTab) {
            case 'datos':
                return (
                    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h4 style={{ color: '#4a0376' }}>Datos Demográficos</h4>
                        <p><strong>Edad:</strong> {mockPatient.age}</p>
                        <p><strong>Última Visita:</strong> {mockPatient.lastVisit}</p>
                        <p><strong>Alergias:</strong> {mockPatient.allergies.join(', ')}</p>
                        <p><strong>Contacto:</strong> +56 9 8765 4321 | javier.soto@mail.cl</p>
                    </div>
                );
            case 'historial':
                return (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {mockPatient.notes.map((note, index) => (
                            <div key={index} style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                                <p style={{ fontWeight: 'bold', color: '#830cc4', margin: '0 0 5px' }}>Nota de {note.date}</p>
                                <p style={{ margin: 0, color: '#2b2b2b' }}>{note.text}</p>
                            </div>
                        ))}
                    </div>
                );
            case 'documentos':
                return (
                    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                        <p>Documentos Adjuntos (Simulación):</p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#00b050' }}>
                            <li><a href="#" style={{ color: 'inherit' }}>Exámenes de Sangre (Oct 2025)</a></li>
                            <li><a href="#" style={{ color: 'inherit' }}>Radiografía de Columna (Mar 2024)</a></li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };
    
    // Estilo para las pestañas
    const tabButtonStyle = (tabName) => ({
        padding: '10px 15px',
        marginRight: '10px',
        border: 'none',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: activeTab === tabName ? '#830cc4' : '#f0f0f0',
        color: activeTab === tabName ? '#fff' : '#4a0376',
    });

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
            
            {/* MENÚ SUPERIOR DE NAVEGACIÓN */}
            <div style={topMenuStyle}>
                <button 
                    onClick={goBack}
                    style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
                >
                    ← Volver al Dashboard
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Ficha Clínica</span>
            </div>

            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Ficha Clínica de {mockPatient.name}</h1>
                    <p style={{ color: '#e35c5c', fontWeight: 'bold' }}>Diagnóstico Principal: {mockPatient.diagnosis}</p>
                    
                    {/* Controles y Acciones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button 
                            style={{ 
                                background: '#00b050', color: '#fff', padding: '10px 15px', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            + Nueva Nota de Evolución
                        </button>
                    </div>

                    {/* PESTAÑAS DE NAVEGACIÓN INTERNA */}
                    <div>
                        <button style={tabButtonStyle('historial')} onClick={() => setActiveTab('historial')}>
                            Historial Clínico
                        </button>
                        <button style={tabButtonStyle('datos')} onClick={() => setActiveTab('datos')}>
                            Datos Personales
                        </button>
                        <button style={tabButtonStyle('documentos')} onClick={() => setActiveTab('documentos')}>
                            Documentos
                        </button>
                    </div>

                    {/* Contenido de la Pestaña */}
                    <div style={{ border: '1px solid #ccc', borderTop: 'none', padding: '20px', borderRadius: '0 0 12px 12px', minHeight: '300px' }}>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}