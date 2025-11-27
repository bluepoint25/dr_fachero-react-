// src/components/CalendarModule.jsx
import React from 'react';

// Estilo para el módulo (tarjeta)
const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    padding: '20px',
    textAlign: 'left',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
};

// Función principal del módulo de Calendario
export default function CalendarModule() {
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth(); // 0 para Enero, 11 para Diciembre
    const currentDay = today.getDate();
    
    // --- Lógica del Calendario ---
    
    // 1. Obtener el primer día del mes (para saber dónde empezar la cuadrícula)
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    
    // 2. Obtener el día de la semana del primer día (0=Domingo, 1=Lunes, ..., 6=Sábado)
    // Ajustamos para que Lunes sea 0 y Domingo sea 6 (convirtiendo 0 de JS a 6)
    let dayOfWeek = firstDayOfMonth.getDay();
    dayOfWeek = (dayOfWeek === 0) ? 6 : dayOfWeek - 1; // 0=Lunes, 6=Domingo
    
    // 3. Obtener el número de días en el mes
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // 4. Generar la lista completa de elementos de la cuadrícula
    const daysArray = [];
    
    // Rellenar con días vacíos al principio para alinear el primer día
    for (let i = 0; i < dayOfWeek; i++) {
        daysArray.push(<div key={`empty-${i}`}></div>);
    }

    // Rellenar con los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const isCurrentDay = day === currentDay;
        
        daysArray.push(
            <div 
                key={day} 
                style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: isCurrentDay ? 'bold' : 'normal',
                    backgroundColor: isCurrentDay ? '#830cc4' : 'transparent', // Morado para el día actual
                    color: isCurrentDay ? '#fff' : '#4a0376',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                {day}
            </div>
        );
    }
    
    // --- Datos de Visualización ---
    const monthName = today.toLocaleDateString('es-ES', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    const daysOfWeekLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    return (
        <div style={cardStyle}>
            <h4 style={{ color: '#4a0376', margin: '0 0 10px', fontSize: '1.4rem' }}>
                Calendario de Citas
            </h4>
            
            {/* Encabezado con Mes y flechas de navegación simuladas */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', color: '#4a0376' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{capitalizedMonth} de {year}</span>
                <div style={{ fontSize: '1.2rem' }}>
                    <span>{'<'}</span>
                    <span style={{ marginLeft: '10px' }}>{'>'}</span>
                </div>
            </div>

            {/* Días de la semana */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', color: '#555', fontSize: '12px', fontWeight: 'bold' }}>
                {daysOfWeekLabels.map(day => <div key={day} style={{ textAlign: 'center' }}>{day}</div>)}
            </div>

            {/* Cuadrícula del mes completo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginTop: '10px' }}>
                {daysArray}
            </div>


        </div>
    );
}