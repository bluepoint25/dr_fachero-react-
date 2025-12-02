// src/pages/DashboardPro.jsx
import React, { useState, useEffect } from 'react';
import BarChart from '../components/BarChart';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'http://localhost:8080';

// --- FUNCIÓN HELPER PARA TOKEN ---
const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export default function DashboardPro({ userName, handleLogout, setPagina }) {
    const [chartData, setChartData] = useState([]);
    const [agendaSummary, setAgendaSummary] = useState([]);

    // Navegación segura usando la prop setPagina que viene de App.jsx
    const navigateTo = (page) => {
        if (setPagina) {
            setPagina(page);
        } else {
            console.error("setPagina no está definido en DashboardPro");
        }
    };

    // Cargar datos del dashboard (Gráficos y Resumen)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Cargar datos del gráfico
                const resChart = await fetch(`${API_BASE_URL}/api/appointments/dashboard/citas-mensuales`, {
                    headers: getAuthHeaders()
                });
                if (resChart.ok) {
                    const data = await resChart.json();
                    setChartData(data);
                }

                // 2. Cargar resumen de agenda
                const resAgenda = await fetch(`${API_BASE_URL}/api/appointments/dashboard/resumen-agenda`, {
                    headers: getAuthHeaders()
                });
                if (resAgenda.ok) {
                    const data = await resAgenda.json();
                    setAgendaSummary(data);
                }
            } catch (error) {
                console.error("Error cargando dashboard:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
            
            {/* MENÚ SUPERIOR */}
            <div style={topMenuStyle}>
                <h2 style={{ fontSize: '1.5rem', margin: '0', fontWeight: 800 }}>
                    Dr. Fachero <span style={{fontSize:'0.8rem', opacity:0.8}}>PRO</span>
                </h2>
                
                <ul style={topMenuItemsStyle}>
                    <li style={topMenuItemStyle}>
                        <button style={{all:'unset', cursor:'pointer'}} onClick={() => navigateTo('pacientes')}>
                            Pacientes
                        </button>
                    </li>
                    <li style={topMenuItemStyle}>
                        <button style={{all:'unset', cursor:'pointer'}} onClick={() => navigateTo('agenda_medica')}>
                            Agenda
                        </button>
                    </li>
                    <li style={topMenuItemStyle}>
                        <button style={{all:'unset', cursor:'pointer'}} onClick={() => navigateTo('recetas_medicas')}>
                            Recetas
                        </button>
                    </li>
                </ul>

                <button onClick={handleLogout} style={logoutButtonStyle}>
                    Cerrar Sesión
                </button>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'left' }}>
                <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Bienvenido, {userName || 'Doctor'}</h1>
                <p style={{ color: '#555', marginBottom: '30px' }}>Resumen de tu actividad clínica.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    
                    {/* TARJETA 1: ACCESOS RÁPIDOS */}
                    <div style={cardStyle}>
                        <h3 style={{ color: '#4a0376', marginTop: 0 }}>Accesos Rápidos</h3>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <button onClick={() => navigateTo('pacientes')} style={actionButtonStyle}>
                                👥 Gestionar Pacientes
                            </button>
                            <button onClick={() => navigateTo('agenda_medica')} style={actionButtonStyle}>
                                📅 Ver Agenda
                            </button>
                            <button onClick={() => navigateTo('recetas_medicas')} style={actionButtonStyle}>
                                💊 Emitir Receta
                            </button>
                        </div>
                    </div>

                    {/* TARJETA 2: GRÁFICO (Componente BarChart) */}
                    <div style={cardStyle}>
                       <BarChart data={chartData} />
                    </div>

                    {/* TARJETA 3: RESUMEN AGENDA */}
                    <div style={cardStyle}>
                        <h3 style={{ color: '#4a0376', marginTop: 0 }}>Agenda de Hoy</h3>
                        {agendaSummary.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {agendaSummary.map((item, index) => (
                                    <li key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0', fontSize: '0.9rem' }}>
                                        <strong>{item.time}</strong> - {item.patient} <br/>
                                        <span style={{ color: '#888', fontSize: '0.8rem' }}>{item.medic}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#999' }}>No hay citas próximas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- ESTILOS LOCALES ---
const topMenuStyle = {
    background: '#830cc4', color: '#fff', padding: '10px 20px', borderRadius: '12px',
    marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};
const topMenuItemsStyle = { display: 'flex', gap: '20px', listStyle: 'none', padding: 0, margin: 0 };
const topMenuItemStyle = { padding: '5px 10px', fontWeight: 600, cursor: 'pointer' };
const logoutButtonStyle = { background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', padding: '25px' };
const actionButtonStyle = { flex: '1 1 45%', padding: '15px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f5ff', color: '#830cc4', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' };