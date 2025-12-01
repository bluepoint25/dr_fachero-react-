// src/pages/Pacientes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

// URL base de tu API Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/patients';

// Estilos Reutilizados del DashboardPro
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

export default function Pacientes({ goBack }) {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para Modales de Formulario y Estado
    const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [patientToDelete, setPatientToDelete] = useState(null); 
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // --- FUNCIÓN PRINCIPAL: CARGAR PACIENTES (GET) ---
    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar pacientes:", err);
            setError("No se pudo conectar al API del servidor. Asegúrese de que Spring Boot esté activo en http://localhost:8080.");
            setPatients([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Cargar pacientes al montar el componente
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- MANEJO DE MODALES Y FORMULARIOS ---

    const openNewPatientModal = () => {
        reset();
        setIsNewPatientModalOpen(true);
        setIsEditModalOpen(false);
        setPatientToEdit(null);
    };

    const openEditPatientModal = (patient) => {
        setPatientToEdit(patient);
        setIsEditModalOpen(true);
        setIsNewPatientModalOpen(false);
        // Llenar el formulario con los datos del paciente a editar
        setValue('name', patient.name);
        setValue('rut', patient.rut);
        setValue('phone', patient.phone);
        setValue('diagnosis', patient.diagnosis);
        setValue('status', patient.status);
    };
    
    // Función para mostrar el modal de éxito con un mensaje
    const showSuccessModal = (message) => {
        setSuccessMessage(message);
        setIsSuccessModalOpen(true);
        setTimeout(() => setIsSuccessModalOpen(false), 3000); 
    };

    // --- FUNCIONES CRUD ASÍNCRONAS ---

    // Crear Nuevo Paciente (POST)
    const onSubmitNewPatient = async (data) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // Manejar errores de validación o del servidor
                const errorBody = await response.json();
                const errorMessage = errorBody.message || 'Error desconocido al crear el paciente.';
                throw new Error(errorMessage);
            }

            setIsNewPatientModalOpen(false);
            reset();
            
            await fetchPatients();
            showSuccessModal('Paciente creado con éxito.');

        } catch (err) {
            setError(`Fallo al guardar: ${err.message}`);
        }
    };

    // Actualizar Paciente Existente (PUT)
    const onSubmitEditPatient = async (data) => {
        if (!patientToEdit) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/${patientToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                const errorMessage = errorBody.message || 'Error desconocido al actualizar el paciente.';
                throw new Error(errorMessage);
            }

            setIsEditModalOpen(false);
            setPatientToEdit(null);
            reset();

            await fetchPatients();
            showSuccessModal('Paciente actualizado con éxito.');

        } catch (err) {
            setError(`Fallo al actualizar: ${err.message}`);
        }
    };

    // Abre modal de eliminación
    const deletePatient = (patient) => {
        setPatientToDelete(patient);
        setIsDeleteModalOpen(true);
    };

    // Confirma la eliminación (DELETE)
    const confirmDeletion = async () => {
        if (!patientToDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${patientToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el paciente. El servidor no respondió OK.');
            }
            
            setIsDeleteModalOpen(false);
            setPatientToDelete(null);

            await fetchPatients();
            showSuccessModal('Paciente eliminado con éxito.');

        } catch (err) {
            setError(`Fallo al eliminar: ${err.message}`);
        }
    };

    const getStatusStyle = (status) => ({
        padding: '5px 10px', 
        borderRadius: '15px', 
        fontSize: '0.8rem', 
        fontWeight: 'bold',
        backgroundColor: status === 'Activo' ? '#e6ffe6' : '#fff0f0',
        color: status === 'Activo' ? '#00b050' : '#e35c5c'
    });


    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
            
            {/* MENÚ SUPERIOR */}
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
                        Administra la información de tus pacientes.
                    </p>

                    {/* Mensajes de Error y Carga */}
                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fdd', border: '1px solid #e35c5c', color: '#e35c5c', borderRadius: '4px', marginBottom: '20px' }}>
                            **Error de Conexión:** {error}
                        </div>
                    )}

                    {isLoading && !error && (
                         <div style={{ padding: '10px', textAlign: 'center', color: '#830cc4', fontWeight: 'bold' }}>
                            Cargando pacientes desde el API...
                        </div>
                    )}

                    {/* Controles: Buscar y Nuevo Paciente */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, RUT o diagnóstico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <button 
                            onClick={openNewPatientModal}
                            style={{ 
                                background: '#830cc4', color: '#fff', padding: '10px 15px', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            + Nuevo Paciente
                        </button>
                    </div>

                    {/* Tabla de Pacientes */}
                    {!isLoading && !error && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #830cc4', backgroundColor: '#f9f5ff' }}>
                                    <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Nombre</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'left', width: '15%' }}>RUT</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Diagnóstico</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'center', width: '10%' }}>Estatus</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'center', width: '25%' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? filteredPatients.map(patient => (
                                    <tr key={patient.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{patient.name}</td>
                                        <td style={{ padding: '15px 10px', color: '#555' }}>{patient.rut}</td>
                                        <td style={{ padding: '15px 10px', color: '#555' }}>{patient.diagnosis}</td>
                                        <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <span style={getStatusStyle(patient.status)}>
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <button 
                                                onClick={() => openEditPatientModal(patient)} 
                                                style={{ background: '#ffa500', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => deletePatient(patient)} 
                                                style={{ background: '#e35c5c', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                            {searchTerm ? "No se encontraron pacientes que coincidan con la búsqueda." : "No hay pacientes registrados. ¡Crea uno nuevo!"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- MODAL 1: NUEVO PACIENTE (FORMULARIO POST) --- */}
            {isNewPatientModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsNewPatientModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(500px, 90vw)' }}>
                        <h3 style={{ color: '#830cc4', margin: '0 0 15px' }}>Registrar Nuevo Paciente</h3>
                        <form onSubmit={handleSubmit(onSubmitNewPatient)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            
                            <div className="field">
                                <label htmlFor="name">Nombre Completo*</label>
                                <input type="text" {...register('name', { required: 'El nombre es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.name && <small style={{ color: '#e35c5c' }}>{errors.name.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="rut">RUT/Identificación*</label>
                                <input type="text" {...register('rut', { required: 'El RUT es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.rut && <small style={{ color: '#e35c5c' }}>{errors.rut.message}</small>}
                            </div>
                            
                            <div className="field">
                                <label htmlFor="phone">Teléfono de Contacto*</label>
                                <input type="text" {...register('phone', { required: 'El teléfono es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.phone && <small style={{ color: '#e35c5c' }}>{errors.phone.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="diagnosis">Diagnóstico Principal*</label>
                                <input type="text" {...register('diagnosis', { required: 'El diagnóstico es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="Ej: Hipertensión, Diabetes Tipo 2" />
                                {errors.diagnosis && <small style={{ color: '#e35c5c' }}>{errors.diagnosis.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="status">Estatus*</label>
                                <select {...register('status', { required: 'El estatus es obligatorio' })} defaultValue="Activo" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Seguimiento">Seguimiento</option>
                                </select>
                                {errors.status && <small style={{ color: '#e35c5c' }}>{errors.status.message}</small>}
                            </div>
                            
                            <button type="submit" style={{ background: '#830cc4', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', marginTop: '10px' }}>
                                Guardar Paciente
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* --- MODAL 2: EDITAR PACIENTE (FORMULARIO PUT) --- */}
            {isEditModalOpen && patientToEdit && (
                <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(500px, 90vw)' }}>
                        <h3 style={{ color: '#ffa500', margin: '0 0 15px' }}>Editar Paciente: {patientToEdit.name}</h3>
                        <form onSubmit={handleSubmit(onSubmitEditPatient)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            
                            <div className="field">
                                <label htmlFor="name">Nombre Completo*</label>
                                <input type="text" {...register('name', { required: 'El nombre es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.name && <small style={{ color: '#e35c5c' }}>{errors.name.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="rut">RUT/Identificación*</label>
                                <input type="text" {...register('rut', { required: 'El RUT es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.rut && <small style={{ color: '#e35c5c' }}>{errors.rut.message}</small>}
                            </div>
                            
                            <div className="field">
                                <label htmlFor="phone">Teléfono de Contacto*</label>
                                <input type="text" {...register('phone', { required: 'El teléfono es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.phone && <small style={{ color: '#e35c5c' }}>{errors.phone.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="diagnosis">Diagnóstico Principal*</label>
                                <input type="text" {...register('diagnosis', { required: 'El diagnóstico es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.diagnosis && <small style={{ color: '#e35c5c' }}>{errors.diagnosis.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="status">Estatus*</label>
                                <select {...register('status', { required: 'El estatus es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="Seguimiento">Seguimiento</option>
                                </select>
                                {errors.status && <small style={{ color: '#e35c5c' }}>{errors.status.message}</small>}
                            </div>
                            
                            <button type="submit" style={{ background: '#ffa500', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', marginTop: '10px' }}>
                                Actualizar Paciente
                            </button>
                        </form>
                    </div>
                </div>
            )}


            {/* --- MODAL 3: CONFIRMACIÓN DE ELIMINACIÓN (DELETE) --- */}
            {isDeleteModalOpen && patientToDelete && (
                <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 10px' }}>Confirmar Eliminación</h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>
                            ¿Seguro que deseas eliminar a **{patientToDelete.name}** del registro de pacientes?
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{ background: '#f0f0f0', color: '#4a0376', padding: '10px 14px', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeletion}
                                style={{ background: '#e35c5c', color: '#fff', padding: '10px 14px', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- MODAL 4: CONFIRMACIÓN DE ÉXITO --- */}
            {isSuccessModalOpen && (
                <div 
                    className="modal-backdrop" 
                    role="dialog" 
                    aria-modal="true" 
                    onClick={() => setIsSuccessModalOpen(false)}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="document"
                        style={{ maxWidth: '400px', textAlign: 'center' }}
                    >
                        <h3 style={{ color: '#00b050', margin: '0 0 10px' }}>
                            ¡Operación Exitosa!
                        </h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>
                            {successMessage}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsSuccessModalOpen(false)}
                                style={{ 
                                    background: '#00b050', color: '#fff', padding: '10px 14px', border: 'none', 
                                    borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}