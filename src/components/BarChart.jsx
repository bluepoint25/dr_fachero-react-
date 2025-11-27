// src/components/BarChart.jsx
import React from 'react';

// Componente simple para simular un gráfico de barras
export default function BarChart() {
  const data = [
    { label: 'Ene', value: 45 },
    { label: 'Feb', value: 60 },
    { label: 'Mar', value: 85 },
    { label: 'Abr', value: 70 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 50 },
  ];
  const maxValue = 100;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', textAlign: 'left' }}>
      <h3 style={{ color: '#4a0376', margin: '0 0 20px', fontSize: '1.4rem' }}>Citas Finalizadas (Últimos 6 meses)</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        {data.map((item) => (
          <div 
            key={item.label} 
            title={`Citas: ${item.value}`}
            style={{ 
              flex: 1, 
              height: `${(item.value / maxValue) * 100}%`, 
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