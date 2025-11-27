
import React from 'react';


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

// Función principal
export default function RecetasMedicas({ goBack }) {
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
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Recetas Médicas</span>
        </div>

        {/* CONTENIDO DEL MÓDULO */}
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={cardStyle}>
                <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Creación de Receta Electrónica</h1>
                <p style={{ color: '#555', marginBottom: '30px' }}>
                    Utiliza el formulario para generar, firmar y enviar una receta directamente al paciente.
                </p>

                {/* Área de Contenido de la Receta */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Columna Izquierda: Formulario de Receta (Mock) */}
                    <div>
                        <h3 style={{ color: '#4a0376' }}>Detalles del Medicamento</h3>
                        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
                            <p>Paciente: **Juan Pérez**</p>
                            <p>Diagnóstico: Hipertensión</p>
                            <p>Medicamento: **Enalapril 10mg**</p>
                            <p>Dosis: 1 tableta, cada 12 horas</p>
                        </div>
                        <button 
                            style={{ 
                                background: '#00b050', color: '#fff', padding: '10px 20px', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' 
                            }}
                        >
                            + Agregar Medicamento
                        </button>
                    </div>

                    {/* Columna Derecha: Vista Previa y Acciones */}
                    <div style={{ borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
                        <h3 style={{ color: '#4a0376' }}>Acciones</h3>
                        <button 
                            style={{ 
                                background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', marginTop: '10px', width: '100%', fontWeight: 'bold' 
                            }}
                        >
                            Firmar y Enviar (PDF)
                        </button>
                        <button 
                            style={{ 
                                background: '#f0f0f0', color: '#4a0376', padding: '10px 20px', border: '1px solid #ccc', 
                                borderRadius: '8px', cursor: 'pointer', marginTop: '10px', width: '100%' 
                            }}
                        >
                            Guardar Borrador
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}