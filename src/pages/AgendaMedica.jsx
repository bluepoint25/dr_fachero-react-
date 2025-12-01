// src/pages/AgendaMedica.jsx
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

// URL base de la API para Citas
const API_APPOINTMENTS_URL = 'http://localhost:8080/api/appointments'; 

// --- FUNCIÓN DE UTILIDAD: MANEJO SEGURO DE ERRORES DE API ---
// Lee el cuerpo de la respuesta. Intenta JSON, si falla, lee como texto.
const getSafeErrorMessage = async (response) => {
    try {
        const errorBody = await response.json();
        
        // Intenta extraer el mensaje del error de Spring Boot
        if (errorBody.errors && errorBody.errors.length > 0) {
            return errorBody.errors.map(err => `${err.field}: ${err.defaultMessage}`).join('; ');
        }
        return errorBody.message || errorBody.error || JSON.stringify(errorBody);

    } catch (_e) { // Uso de _e para evitar el warning de ESLint
        // Si falla la lectura JSON, lee como texto
        try {
            const errorText = await response.text();
            return errorText || `Error HTTP ${response.status}. Respuesta vacía.`;
        } catch (_e) { // Uso de _e para evitar el warning de ESLint
            return `Error HTTP ${response.status}. Fallo al procesar la respuesta.`;
        }
    }
};

// Estilos Reutilizados (Se mantienen)
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
    padding: '30px',
    textAlign: 'left',
};


// Función auxiliar para estructurar los datos del recibo (Necesaria para printAppointment)
const getReceiptData = (appointment) => ({
    patientName: appointment.patient.toUpperCase(),
    patientId: appointment.rut,
    medic: appointment.medic,
    procedure: appointment.reason,
    date: new Date(appointment.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: appointment.time,
    location: appointment.location,
});


export default function AgendaMedica({ goBack, setPagina }) { 
    // State variables
    const [appointments, setAppointments] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); // Usada en el input
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    
    // Estados para Modales (Usados en JSX)
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalLines, setValidationModalLines] = useState([]);


    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
    
    // Función para manejar la navegación a las páginas de módulos
    const navigateTo = (page) => {
      if (setPagina) {
        setPagina(page);
      } else {
        console.error("setPagina is not defined. Cannot navigate to:", page); 
      }
    };
    
    // --- FUNCIÓN DE CARGA DE DATOS DE LA API (GET) ---
    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_APPOINTMENTS_URL);

            if (!response.ok) {
                throw new Error(`Error al cargar las citas. HTTP: ${response.status}. Asegúrese de que el endpoint GET ${API_APPOINTMENTS_URL} esté implementado.`);
            }
            
            const data = await response.json();
            setAppointments(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error al cargar citas:", err);
            setError(`Error al cargar citas. Failed to fetch`); 
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);
    // --- FIN FUNCIÓN DE CARGA ---

    // La variable setSearchTerm se usa aquí:
    const filteredAppointments = appointments.filter(app =>
        app.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- FUNCIÓN PARA CAMBIAR EL ESTADO (PUT/PATCH a la API) ---
    const changeStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_APPOINTMENTS_URL}/${id}/status`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorMessage = await getSafeErrorMessage(response);
                throw new Error(errorMessage);
            }

            setAppointments(appointments.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));

        } catch (err) {
            console.error("Error al cambiar estado:", err);
            alert(`Fallo al actualizar el estado de la cita: ${err.message}`);
        }
    };
    
    // Función para mostrar el modal de impresión (Usa getReceiptData y setReceiptData)
    const printAppointment = (appointment) => {
        const data = getReceiptData(appointment);
        setReceiptData(data);
        setIsReceiptModalOpen(true);
    };

    // Función para crear nueva cita (POST a la API)
    const onSubmitNewAppointment = async (data) => {
        try {
            // CORREGIDO: Aseguramos que se envía 'procedure' con el valor de 'procedure' y eliminamos 'reason'
            const payload = {
                patient: data.patient.toUpperCase(),
                rut: data.rut,
                time: data.time,
                date: data.date,
                procedure: data.procedure, // Enviamos 'procedure' que es el campo del formulario
                medic: data.medic,
                location: data.location || 'Consultorio 1', 
                status: 'Confirmada',
            };

            const response = await fetch(API_APPOINTMENTS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorMessage = await getSafeErrorMessage(response);
                throw new Error(errorMessage);
            }

            setIsNewAppointmentModalOpen(false);
            reset();
            fetchAppointments(); 

        } catch (err) {
            console.error("Error al crear cita:", err);
            setError(`Fallo al crear la cita: ${err.message}`);
        }
    };
    
    // Función para manejar errores de validación (Usa setValidationModalLines)
    const onInvalidNewAppointment = (errs) => {
      const errorLines = Object.keys(errs).map(key => {
        const fieldName = {
            patient: 'Nombre del paciente',
            rut: 'RUT/Identificación',
            time: 'Hora',
            date: 'Fecha',
            procedure: 'Motivo/Procedimiento',
            medic: 'Médico',
        }[key] || key;
        return `${fieldName}: Campo requerido`;
      });
      setValidationModalLines(errorLines);
      setIsValidationModalOpen(true);
    };
    
    // Título del modal de validación (Usado en JSX)
    const memoValidationModalTitle = useMemo(() => {
        const count = validationModalLines.length;
        return count > 1 ? "Verifique los datos:" : "Verifique el dato:";
    }, [validationModalLines]);


    // Borrar Cita (Abre Modal)
    const deleteAppointment = (appointment) => {
        setAppointmentToDelete(appointment);
        setIsDeleteModalOpen(true);
    };

    // Función para confirmar borrado (DELETE a la API)
    const confirmDeletion = async () => {
        if (appointmentToDelete) {
            try {
                const response = await fetch(`${API_APPOINTMENTS_URL}/${appointmentToDelete.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorMessage = await getSafeErrorMessage(response);
                    throw new Error(errorMessage);
                }
                
                setAppointmentToDelete(null);
                setIsDeleteModalOpen(false);
                fetchAppointments(); 
                
            } catch (err) {
                console.error("Error al eliminar cita:", err);
                alert(`Fallo al eliminar la cita: ${err.message}`);
            }
        }
    };
    
    // Función para renderizar una línea del comprobante (Usada en el Modal)
    const renderReceiptLine = (label, value) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '1rem' }}>
            <strong style={{ minWidth: '150px' }}>{label}:</strong> 
            <span style={{ textAlign: 'right', fontWeight: 'normal' }}>{value}</span>
        </div>
    );

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
            
            {/* MENÚ SUPERIOR: NAVEGACIÓN CORREGIDA */}
            <div style={topMenuStyle}>
                <button 
                    onClick={goBack} // Volver al Dashboard
                    style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
                >
                    ← Volver al Dashboard
                </button>
                <ul style={topMenuItemsStyle}>
                    {/* Botón Pacientes */}
                    <li style={topMenuItemStyle}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('pacientes')}>Pacientes</button>
                    </li>
                    {/* Botón Agenda (Activo) */}
                    <li style={{...topMenuItemStyle, opacity: 1}}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('agenda_medica')}>Agenda médica</button>
                    </li>
                    {/* Botón Recetas */}
                    <li style={topMenuItemStyle}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('recetas_medicas')}>Recetas médicas</button>
                    </li>
                </ul>
                {/* Botón Cerrar Sesión */}
                <button 
                    onClick={() => navigateTo('login')}
                    style={{ all: 'unset', background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: '#fff', 
                            padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                    Cerrar Sesión
                </button>
            </div>
            
            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Agenda de Citas Diarias</h1>
                    <p style={{ color: '#555', marginBottom: '30px' }}>Citas programadas.</p>
                    
                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fdd', border: '1px solid #e35c5c', color: '#e35c5c', borderRadius: '4px', marginBottom: '20px' }}>
                            **Error de Carga:** {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        
                        <input
                            type="text"
                            placeholder="Buscar por paciente o motivo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        
                        <div>
                            <button 
                                onClick={() => setIsNewAppointmentModalOpen(true)} 
                                style={{ 
                                    background: '#830cc4', color: '#fff', padding: '10px 15px', border: 'none', 
                                    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                                }}
                            >
                                + Nueva Cita
                            </button>
                        </div>
                    </div>

                    {/* Mensaje de Carga */}
                    {isLoading && (
                        <p style={{ textAlign: 'center', color: '#830cc4' }}>Cargando citas...</p>
                    )}

                    {/* Tabla de Citas */}
                    {!isLoading && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #830cc4', backgroundColor: '#f9f5ff' }}>
                                    <th style={{ padding: '15px 10px', textAlign: 'left', width: '10%' }}>Hora</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Paciente</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Motivo</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'center', width: '15%' }}>Estado</th>
                                    <th style={{ padding: '15px 10px', textAlign: 'center', width: '25%' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.length > 0 ? filteredAppointments.map(app => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{app.time}</td>
                                        <td style={{ padding: '15px 10px' }}>{app.patient}</td>
                                        <td style={{ padding: '15px 10px', color: '#555' }}>{app.reason}</td>
                                        <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <select 
                                                value={app.status}
                                                onChange={(e) => changeStatus(app.id, e.target.value)}
                                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                title="Cambiar estado"
                                            >
                                                <option value="Confirmada">Confirmada</option>
                                                <option value="En espera">En espera</option>
                                                <option value="Finalizada">Finalizada</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                <button 
                                                    onClick={() => printAppointment(app)}
                                                    style={{ background: '#00b050', color: '#fff', padding: '5px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                                    title="Imprimir comprobante"
                                                >
                                                    📄
                                                </button>
                                                <button 
                                                    onClick={() => deleteAppointment(app)}
                                                    style={{ background: '#e35c5c', color: '#fff', padding: '5px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                                    title="Borrar cita"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                            No se encontraron citas programadas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* --- MODALES (Usan las variables de estado) --- */}
            
            {isNewAppointmentModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsNewAppointmentModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
                        <h2 style={{ color: '#830cc4', marginTop: 0 }}>Agendar Nueva Cita</h2>
                        <form onSubmit={handleSubmit(onSubmitNewAppointment, onInvalidNewAppointment)}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Paciente*</label>
                                <input {...register("patient", { required: "El nombre es obligatorio" })} placeholder="Nombre completo" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.patient && <small style={{ color: '#e35c5c' }}>{errors.patient.message || "Campo obligatorio"}</small>}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>RUT/Identificación</label>
                                <input {...register("rut")} placeholder="RUT o ID del paciente" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha*</label>
                                    <input type="date" {...register("date", { required: "La fecha es obligatoria" })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.date && <small style={{ color: '#e35c5c' }}>{errors.date.message || "Campo obligatorio"}</small>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hora*</label>
                                    <input type="time" {...register("time", { required: "La hora es obligatoria" })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.time && <small style={{ color: '#e35c5c' }}>{errors.time.message || "Campo obligatorio"}</small>}
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Motivo/Procedimiento*</label>
                                <input {...register("procedure", { required: "El motivo es obligatorio" })} placeholder="Motivo de la consulta" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.procedure && <small style={{ color: '#e35c5c' }}>{errors.procedure.message || "Campo obligatorio"}</small>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Médico Tratante*</label>
                                <select {...register("medic", { required: "El médico es obligatorio" })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                                    <option value="">Seleccione...</option>
                                    <option value="DR. FACHERO (PRO)">DR. FACHERO (PRO)</option>
                                    <option value="DRA. JANE SMITH">DRA. JANE SMITH</option>
                                </select>
                                {errors.medic && <small style={{ color: '#e35c5c' }}>{errors.medic.message || "Campo obligatorio"}</small>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ubicación</label>
                                <input {...register("location")} placeholder="Consultorio 1, Sala B, etc." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsNewAppointmentModalOpen(false)} style={{ background: '#ccc', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar Cita</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {isValidationModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsValidationModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h2 style={{ color: '#e35c5c', marginTop: 0 }}>¡Atención!</h2>
                        <p style={{ color: '#e35c5c', fontWeight: 'bold' }}>{memoValidationModalTitle}</p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', textAlign: 'left', margin: '20px 0' }}>
                            {validationModalLines.map((line, index) => (
                                <li key={index} style={{ color: '#333', marginBottom: '5px' }}>{line}</li>
                            ))}
                        </ul>
                        <button onClick={() => setIsValidationModalOpen(false)} style={{ background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Entendido</button>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && appointmentToDelete && (
                <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h2 style={{ color: '#e35c5c', marginTop: 0 }}>Confirmar Eliminación</h2>
                        <p>¿Está seguro de que desea eliminar la cita de **{appointmentToDelete.patient}** a las **{appointmentToDelete.time}**?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} style={{ background: '#ccc', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                            <button type="button" onClick={confirmDeletion} style={{ background: '#e35c5c', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {isReceiptModalOpen && receiptData && (
                <div className="modal-backdrop" onClick={() => setIsReceiptModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', width: '90%', textAlign: 'center' }}>
                        <div style={{ border: '2px dashed #830cc4', padding: '20px' }}>
                            <h2 style={{ color: '#830cc4', margin: '0 0 10px' }}>COMPROBANTE DE CITA</h2>
                            <p style={{ color: '#555', margin: '0 0 20px', fontSize: '0.9rem' }}>Clínica Dr. Fachero - PRO</p>
                            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                                {renderReceiptLine("Fecha", receiptData.date)}
                                {renderReceiptLine("Hora", receiptData.time)}
                                {renderReceiptLine("Paciente", receiptData.patientName)}
                                {renderReceiptLine("ID/RUT", receiptData.patientId)}
                                {renderReceiptLine("Motivo", receiptData.procedure)}
                                {renderReceiptLine("Médico", receiptData.medic)}
                                {renderReceiptLine("Ubicación", receiptData.location)}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#830cc4' }}>* Presentar este comprobante al ingresar.</p>
                        </div>
                        <button onClick={() => setIsReceiptModalOpen(false)} style={{ background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}