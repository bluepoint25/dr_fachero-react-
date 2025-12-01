// src/pages/Pacientes.jsx

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';

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

// Datos simulados de pacientes
const initialPatients = [
  { id: 1, name: 'Ana M. Gutiérrez', rut: '18123456-7', phone: '12345678', diagnosis: 'Hipertensión', status: 'Activo' },
  { id: 2, name: 'Roberto J. Soto', rut: '15678901-2', phone: '98765432', diagnosis: 'Diabetes Tipo 2', status: 'Activo' },
  { id: 3, name: 'Elena C. Torres', rut: '17345678-K', phone: '55554444', diagnosis: 'Control Anual', status: 'Inactivo' },
];

export default function Pacientes({ goBack }) {
    const [patients, setPatients] = useState(initialPatients);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null); 
    
    // --- ESTADOS PARA MODALES ---
    const [modalErrorOpen, setModalErrorOpen] = useState(false);
    const [modalLines, setModalLines] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // NUEVO
    const [patientToDelete, setPatientToDelete] = useState(null); // NUEVO


    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.rut.includes(searchTerm)
    );

    // CRUD - Abrir Modal de Formulario
    const openModal = (patient = null) => {
        setEditingPatient(patient);
        setIsModalOpen(true);
        setModalErrorOpen(false); 

        if (patient) {
            setValue('name', patient.name);
            setValue('rut', patient.rut);
            setValue('phone', patient.phone);
            setValue('diagnosis', patient.diagnosis);
            setValue('status', patient.status); 
        } else {
            reset();
            setValue('diagnosis', ''); 
            setValue('status', 'Activo'); 
        }
    };

    // CRUD - Enviar formulario (datos válidos)
    const onSubmit = (data) => {
        if (editingPatient) {
            setPatients(patients.map(p => 
                p.id === editingPatient.id ? { ...p, ...data } : p
            ));
        } else {
            const newPatient = {
                id: Date.now(), 
                ...data,
            };
            setPatients([...patients, newPatient]);
        }
        setIsModalOpen(false);
        reset();
    };
    
    // Lógica de Validación (datos inválidos)
    const onInvalid = (errs) => {
        const order = [
            "name", "rut", "phone", "diagnosis", "status"
        ];
        const labels = {
            name: "Nombre Completo",
            rut: "RUT/Identificación",
            phone: "Teléfono",
            diagnosis: "Diagnóstico Principal",
            status: "Estado",
        };

        const lines = order
          .filter((k) => errs[k])
          .map((k) => `• ${labels[k]}: ${errs[k]?.message ?? "Dato inválido"}`);
          
        setModalLines(lines.length ? lines : ["• Verifica los datos ingresados."]);
        setModalErrorOpen(true);
        setIsModalOpen(true); 
    };
    
    const modalTitle = useMemo(() => {
        const count = modalLines.length;
        return count > 1 ? "Verifique los datos:" : "Verifique el dato:";
    }, [modalLines]);

    // MODIFICADO: Abre el modal de confirmación de eliminación
    const deletePatient = (id) => {
        const patient = patients.find(p => p.id === id);
        if (patient) {
            setPatientToDelete(patient);
            setIsDeleteModalOpen(true);
        }
    };
    
    // NUEVO: Ejecuta la eliminación después de la confirmación
    const confirmDeletion = () => {
        if (patientToDelete) {
            setPatients(patients.filter(p => p.id !== patientToDelete.id));
            setPatientToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const getStatusStyle = (status) => ({
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        backgroundColor: status === 'Activo' ? '#d9f7e5' : '#fbe5e4',
        color: status === 'Activo' ? '#00b050' : '#e35c5c',
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
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Pacientes</span>
            </div>

            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Gestión de Pacientes</h1>
                    <p style={{ color: '#555', marginBottom: '30px' }}>
                        Base de datos y acceso a fichas clínicas de {patients.length} pacientes.
                    </p>

                    {/* Controles: Buscar y Agregar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Buscar por Nombre o RUT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <button 
                            onClick={() => openModal(null)}
                            style={{ 
                                background: '#00b050', color: '#fff', padding: '10px 15px', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            + Agregar Nuevo Paciente
                        </button>
                    </div>

                    {/* Tabla de Pacientes */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #830cc4', backgroundColor: '#f9f5ff' }}>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Nombre</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '15%' }}>RUT</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '20%' }}>Diagnóstico</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '10%' }}>Estado</th> 
                                <th style={{ padding: '15px 10px', textAlign: 'center', width: '10%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                                <tr key={patient.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{patient.name}</td>
                                    <td style={{ padding: '15px 10px', color: '#555' }}>{patient.rut}</td>
                                    <td style={{ padding: '15px 10px', color: '#555' }}>{patient.diagnosis}</td>
                                    <td style={{ padding: '15px 10px' }}>
                                        <span style={getStatusStyle(patient.status)}>{patient.status}</span> 
                                    </td>
                                    <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => openModal(patient)} 
                                            style={{ background: '#830cc4', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            onClick={() => deletePatient(patient.id)} 
                                            style={{ background: '#e35c5c', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                        No se encontraron pacientes que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para Agregar/Modificar Paciente */}
            {isModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    {/* MODAL DE FORMULARIO */}
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(550px, 90vw)' }}>
                        <h3 style={{ color: '#4a0376' }}>{editingPatient ? 'Modificar Paciente' : 'Agregar Nuevo Paciente'}</h3>
                        <form onSubmit={handleSubmit(onSubmit, onInvalid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            <div className="field">
                                <label htmlFor="name">Nombre Completo*</label>
                                <input 
                                    id="name"
                                    type="text"
                                    {...register('name', { required: 'El nombre es obligatorio' })}
                                    className={errors.name ? 'input-error' : ''}
                                />
                                {errors.name && <small className="input-hint">{errors.name.message}</small>}
                            </div>

                            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="field">
                                    <label htmlFor="rut">RUT/Identificación*</label>
                                    <input 
                                        id="rut"
                                        type="text"
                                        {...register('rut', { 
                                            required: 'El RUT es obligatorio',
                                            pattern: {
                                                // Rut sin puntos, con guion, y dígito verificador (dígito o K/k)
                                                value: /^\d{1,8}-[\dkK]$/,
                                                message: 'Formato de RUT inválido. Debe ser sin puntos y con guion (Ej: 12345678-K).'
                                            }
                                        })}
                                        className={errors.rut ? 'input-error' : ''}
                                        placeholder="Ej: 12345678-K"
                                    />
                                    {errors.rut && <small className="input-hint">{errors.rut.message}</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="phone">Teléfono*</label>
                                    <input 
                                        id="phone"
                                        type="tel"
                                        {...register('phone', { 
                                            required: 'El teléfono es obligatorio',
                                            pattern: {
                                                // 8 dígitos numéricos exactos
                                                value: /^\d{8}$/,
                                                message: 'Debe tener exactamente 8 dígitos numéricos.'
                                            }
                                        })}
                                        className={errors.phone ? 'input-error' : ''}
                                        placeholder="Ej: 12345678"
                                    />
                                    {errors.phone && <small className="input-hint">{errors.phone.message}</small>}
                                </div>
                            </div>
                            
                            {/* Campo de Diagnóstico (Ahora Requerido) */}
                            <div className="field">
                                <label htmlFor="diagnosis">Diagnóstico Principal*</label>
                                <input 
                                    id="diagnosis"
                                    type="text"
                                    {...register('diagnosis', { required: 'El diagnóstico es obligatorio' })}
                                    className={errors.diagnosis ? 'input-error' : ''}
                                />
                                {errors.diagnosis && <small className="input-hint">{errors.diagnosis.message}</small>}
                            </div>

                            {/* Campo de Estado */}
                            <div className="field">
                                <label htmlFor="status">Estado del Paciente*</label>
                                <select 
                                    id="status"
                                    {...register('status', { required: 'El estado es obligatorio' })}
                                    className={errors.status ? 'input-error' : ''}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                                {errors.status && <small className="input-hint">{errors.status.message}</small>}
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn--primary" 
                                style={{ background: '#830cc4', marginTop: '15px' }}
                            >
                                {editingPatient ? 'Guardar Cambios' : 'Registrar Paciente'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* --- MODAL DE ERRORES DE VALIDACIÓN (Pop-up) --- */}
            {modalErrorOpen && (
                <div
                  className="modal-backdrop"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-title"
                  onClick={() => setModalErrorOpen(false)}
                >
                  <div
                    className="modal-card"
                    onClick={(e) => e.stopPropagation()}
                    role="document"
                  >
                    <h3 id="modal-title" style={{color: '#e35c5c'}}>¡Errores de Validación!</h3>
                    <p className="modal-subtitle">{modalTitle}</p>
                    <ul className="modal-list">
                      {modalLines.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                    <div className="modal-actions">
                      <button
                        type="button"
                        onClick={() => setModalErrorOpen(false)}
                        className="btn btn--primary"
                        style={{ background: '#e35c5c' }} 
                      >
                        Entendido
                      </button>
                    </div>
                  </div>
                </div>
              )}

            {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
            {isDeleteModalOpen && patientToDelete && (
                <div
                    className="modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="document"
                        style={{ maxWidth: '400px' }}
                    >
                        <h3 id="delete-modal-title" style={{ color: '#e35c5c', margin: '0 0 10px' }}>
                            Confirmar Eliminación
                        </h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>
                            ¿Estás seguro de que deseas eliminar al paciente **{patientToDelete.name}**? Esta acción es irreversible.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{ 
                                    background: '#f0f0f0', color: '#4a0376', padding: '10px 14px', border: 'none', 
                                    borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeletion}
                                style={{ 
                                    background: '#e35c5c', color: '#fff', padding: '10px 14px', border: 'none', 
                                    borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}