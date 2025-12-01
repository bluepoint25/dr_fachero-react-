
import React, { useState, useEffect, useCallback } from 'react';
import BarChart from '../components/BarChart.jsx';
import UserManagement from '../components/UserManagement.jsx';
import CalendarModule from '../components/CalendarModule.jsx'; 
// Asegúrate de que CalendarModule.jsx y UserManagement.jsx existan e implementen el código adecuado.

// NOTA IMPORTANTE: Para que el gráfico funcione, el endpoint en el backend 
// (Java - AppointmentController o DashboardController) debe coincidir con este URL:
const API_CHART_URL = 'http://localhost:8080/api/appointments/dashboard/citas-mensuales'; 
const API_AGENDA_SUMMARY_URL = 'http://localhost:8080/api/appointments/dashboard/resumen-agenda';
const API_BASE_URL = 'http://localhost:8080/api/appointments';

// Estilos de contenedores (Base del código proporcionado)
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
   opacity: 0.85,
   transition: 'opacity 0.2s',
   whiteSpace: 'nowrap',
};
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

export default function DashboardPro({ userName, handleLogout, setPagina }) { 
  const [chartData, setChartData] = useState([]); 
  const [chartMaxValue, setChartMaxValue] = useState(100);
  const [chartError, setChartError] = useState(null);
  
  const [agendaSummary, setAgendaSummary] = useState(null); 
  const [agendaError, setAgendaError] = useState(null); 

  
  // Función para manejar la navegación a las páginas de módulos
  const navigateTo = (page) => {
     setPagina(page);
  };
  
  // --- LÓGICA DE OBTENCIÓN DE DATOS PARA EL DASHBOARD ---
  // Esta función ya contiene la conexión a la API para el gráfico y el resumen de agenda.
  const fetchDashboardData = useCallback(async () => {
     // 1. Fetch de datos del Gráfico (Conexión BarChart)
     try {
      const chartResponse = await fetch(API_CHART_URL); 
      
      if (!chartResponse.ok) {
         throw new Error(`Gráfico: Endpoint no implementado (${API_CHART_URL}) o API inactiva.`);
      }
      
      const data = await chartResponse.json();
      
      if (Array.isArray(data) && data.length > 0) {
         // Calcular el valor máximo para que el gráfico escale correctamente
         const maxVal = Math.max(...data.map(d => d.value)) + 5; 
         setChartData(data);
         setChartMaxValue(maxVal);
      } else {
         setChartData([]); 
      }
      // Limpiar errores si la carga fue exitosa
      setChartError(null); 

     } catch (error) {
      setChartError(error.message); 
      setChartData([]); // Establecer datos vacíos para mostrar mensaje de 'No data' en BarChart.jsx
     }
     
     // 2. Fetch de resumen de Agenda
     try {
      const agendaResponse = await fetch(API_AGENDA_SUMMARY_URL);
      
      if (!agendaResponse.ok) {
         throw new Error("Resumen: Endpoint no implementado o API inactiva.");
      }
      
      const summaryData = await agendaResponse.json();
      setAgendaSummary(summaryData);
      setAgendaError(null); // Limpiar errores
      
     } catch(error) {
        setAgendaError(error.message);
        setAgendaSummary([]); // Se establece vacío
     }
     
  }, []);

  useEffect(() => {
   fetchDashboardData();
  }, [fetchDashboardData]); 


  return (
   <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
     
     {/* --------------------------------- */}
     {/* 1. MENÚ DE NAVEGACIÓN SUPERIOR */}
     {/* --------------------------------- */}
     <div style={topMenuStyle}>
      
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
     {/* 2. CONTENIDO PRINCIPAL Y CUERPO */}
     {/* --------------------------------- */}
     <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', textAlign: 'left' }}>
        <h1 style={{ color: '#830cc4', margin: '0' }}>Bienvenido, {userName}</h1>
        <h2 style={{ color: '#830cc4', fontSize: '1.5rem', fontWeight: 600 }}>Centro de Gestión Dr. Pro 👑</h2>
      </header>
      
      {/* GRUPO SUPERIOR: GRÁFICO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {/* COLUMNA 1: Gráfico de Barras - Ocupa 3/3 */}
        <div style={{ gridColumn: '1 / -1' }}>
         {/* Mensaje de Error (si fetch falló) */}
         {chartError && (
           <div style={{ padding: '10px', backgroundColor: '#fdd', border: '1px solid #e35c5c', color: '#e35c5c', borderRadius: '4px', marginBottom: '15px' }}>
            **Error de Conexión (Gráfico):** {chartError}
           </div>
         )}
         {/* BarChart recibe la data (cargada o vacía/error) */}
         <BarChart 
            data={chartData} 
            maxValue={chartMaxValue} 
         />
        </div> 
      </div>
      
      {/* GRUPO DE MÓDULOS INTERMEDIOS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
         
         {/* MÓDULO 4: CALENDARIO DINÁMICO */}
         <div style={{ gridColumn: 'span 1' }}><CalendarModule /></div>

         {/* MÓDULO 5: Agenda Médica (Resumen - CONECTADO) */}
         <div style={cardStyle}>
            <h4 style={{ color: '#4a0376', margin: '0 0 10px', fontSize: '1.4rem' }}>Agenda Médica</h4>
            {agendaError ? (
               <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#e35c5c' }}>
                  **Error de Conexión:** {agendaError}
               </p>
            ) : (
               agendaSummary && Array.isArray(agendaSummary) && agendaSummary.length > 0 ? (
                  agendaSummary.map((item, index) => (
                     <div key={index} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#830cc4' }}>{item.medic}</span>
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#555' }}>Cita {item.time} | {item.patient}</p>
                     </div>
                  ))
               ) : (
                  <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#999' }}>
                     Implementar la conexión a la API para resumen.
                  </p>
               )
            )}
            <button 
              onClick={() => navigateTo('agenda_medica')}
              style={{ all: 'unset', display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', color: '#830cc4', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #830cc4', padding: '8px', borderRadius: '8px' }}
            >
              Ver Agenda Completa
            </button>
         </div>
         
         {/* MÓDULO 6: Ficha Clínica */}
         <div style={cardStyle}>
            <h4 style={{ color: '#4a0376', margin: '0 0 10px', fontSize: '1.4rem' }}>Ficha Clínica Rápida</h4>
            <p style={{ margin: '0 0 15px', color: '#555', fontSize: '0.9rem' }}>Busca un paciente para una vista rápida.</p>
            <input 
               type="text" 
               placeholder="Buscar paciente por RUT/Nombre" 
               style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '15px' }}
            />
            <p style={{ margin: '10px 0', fontSize: '0.9rem', color: '#999' }}>
               Implementar la búsqueda en la API de Pacientes.
            </p>
            <button 
              onClick={() => navigateTo('pacientes')}
              style={{ all: 'unset', display: 'block', width: '100%', textAlign: 'center', marginTop: '20px', color: '#830cc4', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #830cc4', padding: '8px', borderRadius: '8px' }}
            >
              Ir a Expediente Pacientes
            </button>
         </div>
      </div>

     </div>
   </div>
  );
}