// src/pages/GestionCamas.jsx
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

// Datos simulados de las camas
const initialBeds = [
    { id: 'Cama 01', status: 'Ocupada', patient: 'L. Gómez' },
    { id: 'Cama 02', status: 'Disponible', patient: null },
    { id: 'Cama 03', status: 'Limpieza', patient: null },
    { id: 'Cama 04', status: 'Ocupada', patient: 'J. Soto' },
    { id: 'Cama 05', status: 'Disponible', patient: null },
    { id: 'Cama 06', status: 'Ocupada', patient: 'P. Martínez' },
    { id: 'Cama 07', status: 'Disponible', patient: null },
    { id: 'Cama 08', status: 'Mantenimiento', patient: null },
];

export default function GestionCamas({ goBack }) {
    const [beds, setBeds] = useState(initialBeds);
    
    const occupiedCount = beds.filter(b => b.status === 'Ocupada').length;
    const availableCount = beds.filter(b => b.status === 'Disponible').length;
    const totalCount = beds.length;

    const getStatusColors = (status) => {
        switch (status) {
            case 'Ocupada': return { background: '#e35c5c', color: '#fff' };
            case 'Disponible': return { background: '#00b050', color: '#fff' };
            case 'Limpieza':
            case 'Mantenimiento': return { background: '#830cc4', color: '#fff' };
            default: return { background: '#f0f0f0', color: '#333' };
        }
    };

    // Función simulada para cambiar el estado de la cama
    const toggleBedStatus = (id) => {
        setBeds(beds.map(bed => {
            if (bed.id === id) {
                // Alternamos entre Ocupada y Disponible para el ejemplo
                const newStatus = bed.status === 'Disponible' ? 'Ocupada' : 'Disponible';
                const newPatient = newStatus === 'Ocupada' ? 'Paciente de Prueba' : null;
                return { ...bed, status: newStatus, patient: newPatient };
            }
            return bed;
        }));
    };

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
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Gestión de Camas</span>
            </div>

            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Vista Rápida de Ocupación</h1>
                    
                    {/* Resumen de Métricas */}
                    <div style={{ display: 'flex', gap: '30px', marginBottom: '30px', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                        <div style={{ color: '#830cc4', fontWeight: 'bold' }}>Total de Camas: {totalCount}</div>
                        <div style={{ color: '#e35c5c', fontWeight: 'bold' }}>Ocupadas: {occupiedCount}</div>
                        <div style={{ color: '#00b050', fontWeight: 'bold' }}>Disponibles: {availableCount}</div>
                    </div>

                    {/* Leyenda */}
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', marginBottom: '20px' }}>
                        <span style={{ color: '#00b050' }}>● Disponible</span>
                        <span style={{ color: '#e35c5c' }}>● Ocupada</span>
                        <span style={{ color: '#830cc4' }}>● Limpieza/Mantenimiento</span>
                    </div>


                    {/* Cuadrícula de Camas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {beds.map(bed => (
                            <div 
                                key={bed.id}
                                onClick={() => bed.status !== 'Limpieza' && bed.status !== 'Mantenimiento' && toggleBedStatus(bed.id)}
                                style={{ 
                                    ...getStatusColors(bed.status),
                                    padding: '20px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    cursor: bed.status === 'Limpieza' || bed.status === 'Mantenimiento' ? 'default' : 'pointer',
                                    transition: 'transform 0.1s ease',
                                }}
                            >
                                <h3 style={{ margin: '0 0 5px', fontSize: '1.5rem' }}>{bed.id}</h3>
                                <p style={{ margin: '0 0 10px', fontWeight: 'bold' }}>{bed.status}</p>
                                {bed.patient && <p style={{ margin: 0, fontSize: '0.9rem' }}>Paciente: {bed.patient}</p>}
                                {!bed.patient && bed.status === 'Disponible' && <p style={{ margin: 0, fontSize: '0.9rem' }}>Hacer Clic para Ocupar</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}