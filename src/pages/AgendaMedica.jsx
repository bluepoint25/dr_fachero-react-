// src/pages/AgendaMedica.jsx
import React, { useState } from 'react';

// Estilos Reutilizados del DashboardPro/RecetasMedicas
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

// Datos simulados de citas (usando la fecha actual para contexto)
const today = new Date();
const formattedDate = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

const initialAppointments = [
    { id: 1, time: '09:00', patient: 'Ana Gómez', reason: 'Control de rutina', status: 'Confirmada' },
    { id: 2, time: '10:00', patient: 'Luis Martínez', reason: 'Dolor de espalda', status: 'En espera' },
    { id: 3, time: '11:30', patient: 'Elena Torres', reason: 'Revisión anual', status: 'Confirmada' },
    { id: 4, time: '14:00', patient: 'Roberto Díaz', reason: 'Resultados de laboratorio', status: 'Finalizada' },
];

export default function AgendaMedica({ goBack }) {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAppointments = appointments.filter(app =>
        app.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmada': return { color: '#00b050', fontWeight: 'bold' };
            case 'En espera': return { color: '#830cc4', fontWeight: 'bold' };
            case 'Finalizada': return { color: '#555', fontStyle: 'italic' };
            default: return {};
        }
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
            
            {/* MENÚ SUPERIOR DE NAVEGACIÓN DENTRO DEL MÓDULO */}
            <div style={topMenuStyle}>
                <button 
                    onClick={goBack}
                    style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
                >
                    ← Volver al Dashboard
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Agenda Médica</span>
            </div>

            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Agenda de Citas Diarias</h1>
                    <p style={{ color: '#555', marginBottom: '30px' }}>
                        Citas programadas para el **{formattedDate}**.
                    </p>

                    {/* Controles y Filtros */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        
                        {/* Búsqueda */}
                        <input
                            type="text"
                            placeholder="Buscar por paciente o motivo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        
                        {/* Botones de Acción */}
                        <div>
                            <button 
                                style={{ 
                                    background: '#830cc4', color: '#fff', padding: '10px 15px', border: 'none', 
                                    borderRadius: '8px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' 
                                }}
                            >
                                + Nueva Cita
                            </button>
                            <button 
                                style={{ 
                                    background: '#f0f0f0', color: '#4a0376', padding: '10px 15px', border: '1px solid #ccc', 
                                    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                                }}
                            >
                                Imprimir Agenda
                            </button>
                        </div>
                    </div>

                    {/* Tabla de Citas */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #830cc4', backgroundColor: '#f9f5ff' }}>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '10%' }}>Hora</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '30%' }}>Paciente</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '40%' }}>Motivo</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '10%' }}>Estado</th>
                                <th style={{ padding: '15px 10px', textAlign: 'center', width: '10%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length > 0 ? filteredAppointments.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{app.time}</td>
                                    <td style={{ padding: '15px 10px' }}>{app.patient}</td>
                                    <td style={{ padding: '15px 10px', color: '#555' }}>{app.reason}</td>
                                    <td style={{ padding: '15px 10px' }}><span style={getStatusStyle(app.status)}>{app.status}</span></td>
                                    <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                        <button 
                                            style={{ 
                                                background: '#4a0376', color: '#fff', padding: '8px', border: 'none', 
                                                borderRadius: '4px', cursor: 'pointer', fontSize: '12px' 
                                            }}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                        No se encontraron citas para la búsqueda actual.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}