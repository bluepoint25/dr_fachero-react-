// src/components/BarChart.jsx
import React from 'react';

// Componente de presentación pura: muestra datos o un mensaje de error/no data.
export default function BarChart({ data, maxValue = 100 }) {
  
  // Si no hay datos (por error de API o tabla vacía), muestra un mensaje claro.
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', textAlign: 'left', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3 style={{ color: '#4a0376', margin: '0 0 20px', fontSize: '1.4rem', textAlign: 'center' }}>Citas Finalizadas (Últimos meses)</h3>
        <p style={{ color: '#555', fontWeight: 'bold', textAlign: 'center' }}>Datos del gráfico no cargados. Verifique el estado de la API.</p>
        <div style={{ height: '100px', borderBottom: '1px solid #eee' }}></div>
      </div>
    );
  }

  const safeMaxValue = maxValue > 0 ? maxValue : Math.max(...data.map(d => d.value)) + 5;


  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', textAlign: 'left' }}>
      <h3 style={{ color: '#4a0376', margin: '0 0 20px', fontSize: '1.4rem' }}>Citas Finalizadas (Últimos {data.length} meses)</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        {data.map((item) => (
          <div 
            key={item.label} 
            title={`Citas: ${item.value}`}
            style={{ 
              flex: 1, 
              height: `${Math.max(1, (item.value / safeMaxValue) * 100)}%`, 
              backgroundColor: '#830cc4', 
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', top: '-25px', fontSize: '12px', fontWeight: 'bold', color: '#830cc4' }}>{item.value}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
        {data.map((item) => (
          <div key={item.label} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#555' }}>{item.label}</div>
        ))}
      </div>
    </div>
  );
}