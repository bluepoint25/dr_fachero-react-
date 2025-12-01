// src/pages/AgendaMedica.jsx
import React, { useState, useMemo } from 'react'; // Importar useMemo
import { useForm } from 'react-hook-form';

// Estilos Reutilizados del DashboardPro/RecetasMedicas
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

// Datos simulados de citas (incluyendo todos los campos para el comprobante)
const initialAppointments = [
    { id: 1, time: '09:00', date: new Date().toISOString().substring(0, 10), patient: 'Ana GÓMEZ', rut: '18123456-7', reason: 'Control de rutina', status: 'Confirmada', medic: 'DR. FACHERO (PRO)', location: 'Clínica Los Andes' },
    { id: 2, time: '10:00', date: new Date().toISOString().substring(0, 10), patient: 'Luis MARTÍNEZ', rut: '15678901-2', reason: 'Dolor de espalda', status: 'En espera', medic: 'DR. FACHERO (PRO)', location: 'Clínica Los Andes' },
];

// Mock function para estructurar los datos del recibo
const getReceiptData = (appointment) => ({
    patientName: appointment.patient.toUpperCase(),
    patientId: appointment.rut,
    medic: appointment.medic,
    procedure: appointment.reason,
    date: new Date(appointment.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: appointment.time,
    location: appointment.location,
});


export default function AgendaMedica({ goBack }) {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para Modales
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    // ESTADOS PARA EL MODAL DE RECIBO
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    
    // ESTADOS PARA EL MODAL DE VALIDACIÓN (NUEVO)
    const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
    const [validationModalLines, setValidationModalLines] = useState([]);


    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const filteredAppointments = appointments.filter(app =>
        app.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- FUNCIONES DE GESTIÓN ---

    const changeStatus = (id, newStatus) => {
        setAppointments(appointments.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    // Abre Modal de Recibo con datos estructurados
    const printAppointment = (appointment) => {
        const data = getReceiptData(appointment);
        setReceiptData(data);
        setIsReceiptModalOpen(true);
    };

    // Añadir Nueva Cita (Manejo del formulario - Lógica de datos válidos)
    const onSubmitNewAppointment = (data) => {
        const newAppointment = {
            id: Date.now(),
            ...data,
            status: 'Confirmada', 
            reason: data.procedure, // Mapeamos 'procedure' a 'reason' para la tabla
            patient: data.patient.toUpperCase(), // Estilo de mayúsculas para el recibo
        };
        // Aseguramos que el paciente, si no tiene RUT, lo tenga como "NO REGISTRADO"
        if (!newAppointment.rut) newAppointment.rut = "NO REGISTRADO";

        setAppointments([...appointments, newAppointment].sort((a, b) => a.time.localeCompare(b.time)));
        setIsNewAppointmentModalOpen(false);
        reset();
    };
    
    // VALIDACIÓN (NUEVO: Lógica de datos inválidos - Abre Modal)
    const onInvalidNewAppointment = (errs) => {
        const order = [
            "patient", "rut", "date", "time", "procedure", "medic", "location"
        ];
        const labels = {
            patient: "Nombre Paciente",
            rut: "C. Identidad/RUT",
            date: "Fecha",
            time: "Hora",
            procedure: "Procedimiento/Motivo",
            medic: "Médico",
            location: "Lugar",
        };

        const lines = order
          .filter((k) => errs[k])
          .map((k) => `• ${labels[k]}: ${errs[k]?.message ?? "Dato inválido"}`);
          
        setValidationModalLines(lines.length ? lines : ["• Verifica los datos ingresados."]);
        setIsValidationModalOpen(true);
        setIsNewAppointmentModalOpen(true); // Asegura que el modal de formulario siga visible
    };
    
    const validationModalTitle = useMemo(() => {
        const count = validationModalLines.length;
        return count > 1 ? "Verifique los datos:" : "Verifique el dato:";
    }, [validationModalLines]);


    // Borrar Cita (Abre Modal)
    const deleteAppointment = (appointment) => {
        setAppointmentToDelete(appointment);
        setIsDeleteModalOpen(true);
    };

    // Confirmar Borrado
    const confirmDeletion = () => {
        if (appointmentToDelete) {
            setAppointments(appointments.filter(app => app.id !== appointmentToDelete.id));
            setAppointmentToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    // Función para renderizar una línea del comprobante
    const renderReceiptLine = (label, value) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '1rem' }}>
            <strong style={{ minWidth: '150px' }}>{label}:</strong> 
            <span style={{ textAlign: 'right', fontWeight: 'normal' }}>{value}</span>
        </div>
    );

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
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Agenda Médica</span>
            </div>

            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Agenda de Citas Diarias</h1>
                    <p style={{ color: '#555', marginBottom: '30px' }}>Citas programadas para el día de hoy.</p>

                    {/* Controles y Filtros */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        
                        {/* Búsqueda */}
                        <input
                            type="text"
                            placeholder="Buscar por paciente o motivo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        
                        {/* Botones de Acción */}
                        <div>
                            {/* BOTÓN + NUEVA CITA */}
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

                    {/* Tabla de Citas */}
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
                                        {/* Selector de Estado */}
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
                                            {/* Botón de Impresión (Documento de cita) */}
                                            <button 
                                                onClick={() => printAppointment(app)}
                                                style={{ background: '#00b050', color: '#fff', padding: '5px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                                title="Imprimir comprobante"
                                            >
                                                📄
                                            </button>
                                            {/* Botón de Eliminación (Abre modal) */}
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
                                        No se encontraron citas para la búsqueda actual.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* --- MODAL 1: AÑADIR NUEVA CITA (NUEVOS CAMPOS) --- */}
            {isNewAppointmentModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsNewAppointmentModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(500px, 90vw)' }}>
                        <h3 style={{ color: '#830cc4', margin: '0 0 15px' }}>Agendar Nueva Cita</h3>
                        {/* CONEXIÓN: onValid y onInvalid */}
                        <form onSubmit={handleSubmit(onSubmitNewAppointment, onInvalidNewAppointment)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                            
                            {/* INFORMACIÓN DEL PACIENTE */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <h4 style={{ color: '#555', margin: '0 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Información del Paciente</h4>
                            </div>
                            
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="patient">Nombre Completo*</label>
                                <input type="text" {...register('patient', { required: 'El nombre es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} />
                                {errors.patient && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.patient.message}</small>}
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="rut">C. Identidad (RUT)*</label>
                                <input type="text" {...register('rut', { required: 'El RUT es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} placeholder="Ej: 16718683-1" />
                                {errors.rut && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.rut.message}</small>}
                            </div>

                            {/* DETALLES DE LA CITA */}
                            <div style={{ gridColumn: 'span 2', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                <h4 style={{ color: '#555', margin: '0 0 10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Detalles de la Cita</h4>
                            </div>
                            
                            <div className="field">
                                <label htmlFor="date">Fecha*</label>
                                <input type="date" {...register('date', { required: 'Fecha es obligatoria' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} defaultValue={new Date().toISOString().substring(0, 10)} />
                                {errors.date && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.date.message}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="time">Hora*</label>
                                <input type="time" {...register('time', { required: 'Hora es obligatoria' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} />
                                {errors.time && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.time.message}</small>}
                            </div>
                            
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="procedure">Procedimiento/Motivo*</label>
                                <input type="text" {...register('procedure', { required: 'Procedimiento es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} placeholder="Ej: Consulta Médica" />
                                {errors.procedure && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.procedure.message}</small>}
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="medic">Médico*</label>
                                <input type="text" {...register('medic', { required: 'Médico es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} placeholder="Ej: RAFAEL BITRAN MOGILEVICH" />
                                {errors.medic && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.medic.message}</small>}
                            </div>
                            <div className="field" style={{ gridColumn: 'span 2' }}>
                                <label htmlFor="location">Lugar*</label>
                                <input type="text" {...register('location', { required: 'Lugar es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }} placeholder="Ej: Clínica Los Andes" />
                                {errors.location && <small className="input-hint" style={{ color: '#e35c5c' }}>{errors.location.message}</small>}
                            </div>

                            <button type="submit" style={{ background: '#830cc4', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', gridColumn: 'span 2', marginTop: '10px' }}>
                                Confirmar Cita
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* --- MODAL DE ERRORES DE VALIDACIÓN (NUEVO POP-UP) --- */}
            {isValidationModalOpen && (
                <div
                    className="modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="validation-modal-title"
                    onClick={() => setIsValidationModalOpen(false)}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="document"
                    >
                        <h3 id="validation-modal-title" style={{ color: '#e35c5c' }}>¡Errores de Validación!</h3>
                        <p className="modal-subtitle">{validationModalTitle}</p>
                        <ul className="modal-list">
                            {validationModalLines.map((line, idx) => (
                                <li key={idx}>{line}</li>
                            ))}
                        </ul>
                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setIsValidationModalOpen(false)}
                                className="btn btn--primary"
                                style={{ background: '#e35c5c' }}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* --- MODAL 2: CONFIRMACIÓN DE ELIMINACIÓN DE CITA (SIN CAMBIOS) --- */}
            {isDeleteModalOpen && appointmentToDelete && (
                <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 10px' }}>Confirmar Eliminación</h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>
                            ¿Seguro que deseas eliminar la cita de **{appointmentToDelete.patient}** a las **{appointmentToDelete.time}**?
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
                                Sí, Eliminar Cita
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 3: COMPROBANTE DE CITA MÉDICA (SIN CAMBIOS) --- */}
            {isReceiptModalOpen && receiptData && (
                 <div className="modal-backdrop" onClick={() => setIsReceiptModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '30px', border: '1px solid #ccc' }}>
                        <div id="print-area" style={{ color: '#2b2b2b' }}>
                            <h2 style={{ textAlign: 'center', margin: '0 0 20px', color: '#4a0376' }}>Comprobante de Cita Médica</h2>
                            <hr style={{ borderTop: '2px solid #333', margin: '15px 0' }} />

                            {/* Información del Paciente */}
                            <h3 style={{ margin: '15px 0 5px', fontSize: '1.2rem', color: '#2b2b2b' }}>Información del Paciente</h3>
                            {renderReceiptLine("Nombre", receiptData.patientName)}
                            {renderReceiptLine("C. Identidad", receiptData.patientId)}
                            
                            <hr style={{ borderTop: '1px solid #eee', margin: '20px 0' }} />

                            {/* Información de la Cita */}
                            <h3 style={{ margin: '15px 0 5px', fontSize: '1.2rem', color: '#2b2b2b' }}>Información de la Cita</h3>
                            {renderReceiptLine("Médico", receiptData.medic)}
                            {renderReceiptLine("Procedimiento", receiptData.procedure)}
                            {renderReceiptLine("Fecha", receiptData.date)}
                            {renderReceiptLine("Hora", receiptData.time)}
                            {renderReceiptLine("Lugar", receiptData.location)}
                            
                            <hr style={{ borderTop: '2px solid #333', marginTop: '20px' }} />

                        </div>

                        {/* Botón de Cierre (Simulación de impresión) */}
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                             <button
                                type="button"
                                onClick={() => { window.print(); setIsReceiptModalOpen(false); }}
                                style={{ background: '#00b050', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
                            >
                                Imprimir Comprobante
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}