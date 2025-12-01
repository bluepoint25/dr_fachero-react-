// src/pages/Pacientes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

// URL base de tu API Spring Boot
const API_BASE_URL = 'http://localhost:8080/api/patients';

// --- FUNCIÓN DE UTILIDAD: MANEJO SEGURO DE ERRORES DE API ---
// Lee el cuerpo de la respuesta. Intenta JSON, si falla, lee como texto.
const getSafeErrorMessage = async (response) => {
    try {
        const errorBody = await response.json();
        
        // Intenta extraer el mensaje del error de Spring Boot o usar un mensaje genérico
        if (errorBody.errors && errorBody.errors.length > 0) {
            return errorBody.errors.map(err => `${err.field}: ${err.defaultMessage}`).join('; ');
        }
        return errorBody.message || errorBody.error || JSON.stringify(errorBody);

    } catch { // FIX: Se elimina la declaración de variable (_e) para evitar warning
        // 2. Si falla la lectura JSON, lee como texto
        try {
            const errorText = await response.text();
            return errorText || `Error HTTP ${response.status}. Respuesta vacía.`;
        } catch { // FIX: Se elimina la declaración de variable (_e) para evitar warning
            return `Error HTTP ${response.status}. Fallo al procesar la respuesta.`;
        }
    }
};

// --- FUNCIÓN UTILITARIA para EXPORTAR a CSV/EXCEL (Se mantiene) ---
const convertToCsvAndDownload = (data, filename, headers, keys) => {
    if (!data || data.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    // Encabezado con BOM (Byte Order Mark) para forzar UTF-8 en Excel
    let csv = '\uFEFF'; 
    
    // 1. Añadir encabezados
    csv += headers.join(';') + '\n';

    // 2. Añadir filas de datos
    data.forEach(item => {
        const row = keys.map(key => {
            let value = item[key] !== null && item[key] !== undefined ? item[key].toString() : '';
            // Escape de comillas y delimitadores
            if (value.includes(';') || value.includes('\n') || value.includes('"')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(';');
        csv += row + '\n';
    });

    // 3. Crear Blob y descargar
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
// --- FIN FUNCIÓN UTILITARIA ---


// --- HELPER PARA MAPEAR NOMBRES DE CAMPOS DE BACKEND A FRONTEND ---
const mapPatientDataForFrontend = (patient) => ({
    // Combina nombre y apellido para la visualización/filtrado en la tabla (patient.name)
    name: `${patient.nombrePaciente || ''} ${patient.apellidoPaciente || ''}`.trim(),
    
    // Mapea y renombra otros campos necesarios para la tabla/acciones
    id: patient.id,
    rut: patient.rutPaciente, // Usa 'rut' en el frontend
    phone: patient.telefonoPaciente, // Usa 'phone' en el frontend
    diagnosis: patient.diagnostico, // Usa 'diagnosis' en el frontend
    status: patient.status,
    
    // Mantiene los campos originales del backend para facilitar la edición y el reenvío
    nombrePaciente: patient.nombrePaciente,
    apellidoPaciente: patient.apellidoPaciente,
    rutPaciente: patient.rutPaciente,
    telefonoPaciente: patient.telefonoPaciente,
    diagnostico: patient.diagnostico,
});


// --- ESTILOS UNIFICADOS DE DASHBOARD PRO (Se mantienen) ---
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
// --- FIN ESTILOS UNIFICADOS ---

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
    padding: '30px',
    textAlign: 'left',
};


export default function Pacientes({ goBack, setPagina, handleLogout }) {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para Modales
    const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [patientToDelete, setPatientToDelete] = useState(null); 
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Se cambia 'name' por 'nombre' y 'apellido' en useForm
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    
    // Función para manejar la navegación a las páginas de módulos
    const navigateTo = (page) => {
      if (setPagina) {
        setPagina(page);
      } else {
        console.error("setPagina is not defined. Cannot navigate to:", page);
      }
    };

    // --- FUNCIÓN PRINCIPAL: CARGAR PACIENTES (GET) ---
    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}. Asegúrese de que el endpoint GET ${API_BASE_URL} esté implementado.`);
            }
            const data = await response.json();
            
            // APLICA MAPEO para compatibilidad con la tabla
            const mappedData = Array.isArray(data) ? data.map(mapPatientDataForFrontend) : [];
            
            setPatients(mappedData);
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
    
    // --- FUNCIÓN EXPORTAR PACIENTES (Mantiene los nombres de campos del frontend) ---
    const exportPatientsToExcel = () => {
        const headers = ["ID", "Nombre Completo", "RUT", "Teléfono", "Diagnóstico", "Estatus"];
        // Usa los campos mapeados para la tabla (incluyendo 'name' combinado)
        const keys = ["id", "name", "rut", "phone", "diagnosis", "status"];
        const filename = `pacientes_${new Date().toISOString().substring(0, 10)}.csv`;
        
        convertToCsvAndDownload(filteredPatients, filename, headers, keys);
    };
    
    // --- MANEJO DE MODALES Y FORMULARIOS (Refactorizados) ---

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
        
        // Llenar el formulario con los campos separados del backend (almacenados en el objeto patient)
        setValue('nombre', patient.nombrePaciente);
        setValue('apellido', patient.apellidoPaciente);
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

    // --- FUNCIONES CRUD ASÍNCRONAS (MODIFICADAS PARA USAR EL PAYLOAD CORRECTO) ---

    // Crear Nuevo Paciente (POST)
    const onSubmitNewPatient = async (data) => {
        try {
            // Construir el payload con los nombres de campos del backend
            const payload = {
                nombrePaciente: data.nombre,
                apellidoPaciente: data.apellido,
                rutPaciente: data.rut,
                telefonoPaciente: data.phone,
                diagnostico: data.diagnosis,
                status: data.status,
                clinicaId: 1, // AÑADIDO: ID mock para pasar la validación de suscripción
            };
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await getSafeErrorMessage(response);
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
            // Construir el payload con los nombres de campos del backend
            const payload = {
                nombrePaciente: data.nombre,
                apellidoPaciente: data.apellido,
                rutPaciente: data.rut,
                telefonoPaciente: data.phone,
                diagnostico: data.diagnosis,
                status: data.status,
                clinicaId: 1, // AÑADIDO: ID mock para pasar la validación de suscripción
            };

            const response = await fetch(`${API_BASE_URL}/${patientToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await getSafeErrorMessage(response);
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
                const errorMessage = await getSafeErrorMessage(response);
                throw new Error(errorMessage);
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
            
            {/* MENÚ SUPERIOR: NAVEGACIÓN */}
            <div style={topMenuStyle}>
                {/* Botón Volver (usa goBack) */}
                <button 
                    onClick={goBack} 
                    style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
                >
                    ← Volver al Dashboard
                </button>
                <ul style={topMenuItemsStyle}>
                    {/* Botón Pacientes (Activo) */}
                    <li style={{...topMenuItemStyle, opacity: 1}}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('pacientes')}>Pacientes</button>
                    </li>
                    {/* Botón Agenda */}
                    <li style={topMenuItemStyle}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('agenda_medica')}>Agenda médica</button>
                    </li>
                    {/* Botón Recetas */}
                    <li style={topMenuItemStyle}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('recetas_medicas')}>Recetas médicas</button>
                    </li>
                </ul>
                {/* Botón Cerrar Sesión (Usa handleLogout de App.jsx) */}
                <button 
                    onClick={handleLogout}
                    style={{ all: 'unset', background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', 
                            padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                    Cerrar Sesión
                </button>
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

                    {/* Controles: Buscar y Botones de Acción */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, RUT o diagnóstico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* BOTÓN: EXPORTAR A EXCEL */}
                            <button 
                                onClick={exportPatientsToExcel}
                                disabled={isLoading || filteredPatients.length === 0}
                                style={{ 
                                    background: '#00b050', color: '#fff', padding: '10px 15px', border: 'none', 
                                    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                                    opacity: (isLoading || filteredPatients.length === 0) ? 0.6 : 1 
                                }}
                                title="Exportar pacientes visibles a CSV/Excel"
                            >
                                🗂️ Exportar Excel
                            </button>
                            {/* BOTÓN: NUEVO PACIENTE */}
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

            {/* --- MODALES --- */}
            {/* Modal 1: Nuevo Paciente (AJUSTADO: separamos Nombre y Apellido) */}
            {isNewPatientModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsNewPatientModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(500px, 90vw)' }}>
                        <h3 style={{ color: '#830cc4', margin: '0 0 15px' }}>Registrar Nuevo Paciente</h3>
                        <form onSubmit={handleSubmit(onSubmitNewPatient)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            
                            <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                                {/* Campo NOMBRE */}
                                <div className="field" style={{ flex: 1 }}>
                                    <label htmlFor="nombre">Nombre*</label>
                                    <input type="text" {...register('nombre', { required: 'El nombre es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.nombre && <small style={{ color: '#e35c5c' }}>{errors.nombre.message}</small>}
                                </div>
                                {/* Campo APELLIDO */}
                                <div className="field" style={{ flex: 1 }}>
                                    <label htmlFor="apellido">Apellido*</label>
                                    <input type="text" {...register('apellido', { required: 'El apellido es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.apellido && <small style={{ color: '#e35c5c' }}>{errors.apellido.message}</small>}
                                </div>
                            </div>
                            
                            {/* Campo RUT */}
                            <div className="field">
                                <label htmlFor="rut">RUT/Identificación*</label>
                                <input type="text" {...register('rut', { required: 'El RUT es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.rut && <small style={{ color: '#e35c5c' }}>{errors.rut.message}</small>}
                            </div>
                            
                            {/* Campo Teléfono */}
                            <div className="field">
                                <label htmlFor="phone">Teléfono de Contacto*</label>
                                <input type="text" {...register('phone', { required: 'El teléfono es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.phone && <small style={{ color: '#e35c5c' }}>{errors.phone.message}</small>}
                            </div>

                            {/* Campo Diagnóstico */}
                            <div className="field">
                                <label htmlFor="diagnosis">Diagnóstico Principal*</label>
                                <input type="text" {...register('diagnosis', { required: 'El diagnóstico es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="Ej: Hipertensión, Diabetes Tipo 2" />
                                {errors.diagnosis && <small style={{ color: '#e35c5c' }}>{errors.diagnosis.message}</small>}
                            </div>

                            {/* Campo Estatus */}
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
            
            {/* Modal 2: Editar Paciente (AJUSTADO: separamos Nombre y Apellido) */}
            {isEditModalOpen && patientToEdit && (
                <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(500px, 90vw)' }}>
                        <h3 style={{ color: '#ffa500', margin: '0 0 15px' }}>Editar Paciente: {patientToEdit.name}</h3>
                        <form onSubmit={handleSubmit(onSubmitEditPatient)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            
                            <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                                {/* Campo NOMBRE */}
                                <div className="field" style={{ flex: 1 }}>
                                    <label htmlFor="nombre">Nombre*</label>
                                    <input type="text" {...register('nombre', { required: 'El nombre es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.nombre && <small style={{ color: '#e35c5c' }}>{errors.nombre.message}</small>}
                                </div>
                                {/* Campo APELLIDO */}
                                <div className="field" style={{ flex: 1 }}>
                                    <label htmlFor="apellido">Apellido*</label>
                                    <input type="text" {...register('apellido', { required: 'El apellido es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.apellido && <small style={{ color: '#e35c5c' }}>{errors.apellido.message}</small>}
                                </div>
                            </div>
                            
                            {/* Campo RUT */}
                            <div className="field">
                                <label htmlFor="rut">RUT/Identificación*</label>
                                <input type="text" {...register('rut', { required: 'El RUT es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.rut && <small style={{ color: '#e35c5c' }}>{errors.rut.message}</small>}
                            </div>
                            
                            {/* Campo Teléfono */}
                            <div className="field">
                                <label htmlFor="phone">Teléfono de Contacto*</label>
                                <input type="text" {...register('phone', { required: 'El teléfono es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.phone && <small style={{ color: '#e35c5c' }}>{errors.phone.message}</small>}
                            </div>

                            {/* Campo Diagnóstico */}
                            <div className="field">
                                <label htmlFor="diagnosis">Diagnóstico Principal*</label>
                                <input type="text" {...register('diagnosis', { required: 'El diagnóstico es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.diagnosis && <small style={{ color: '#e35c5c' }}>{errors.diagnosis.message}</small>}
                            </div>

                            {/* Campo Estatus */}
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


            {/* Modal 3: Confirmación de Eliminación (Se mantiene) */}
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
            
            {/* Modal 4: Confirmación de Éxito (Se mantiene) */}
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