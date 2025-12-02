// src/pages/AgendaMedica.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

const API_BASE_URL = 'http://localhost:8080';
const API_APPOINTMENTS_URL = `${API_BASE_URL}/api/appointments`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
};

export default function AgendaMedica({ goBack, setPagina, handleLogout }) { 
    const [appointments, setAppointments] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [isLoading, setIsLoading] = useState(true); 
    const [ setError] = useState(null); 
    
    // Modales
    const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false); 
    const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
    const [appointmentToEdit, setAppointmentToEdit] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
   
    
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationMessages, setValidationMessages] = useState([]);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const { register, handleSubmit, reset, setValue } = useForm();
    
    const navigateTo = (page) => { if (setPagina) setPagina(page); };
    
    const fetchAppointments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_APPOINTMENTS_URL, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const filteredAppointments = appointments.filter(app =>
        app.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const changeStatus = async (id, newStatus) => {
        try {
            await fetch(`${API_APPOINTMENTS_URL}/${id}/status`, {
                method: 'PATCH', 
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: newStatus }),
            });
            setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
        } catch (err) { alert("Error al actualizar estado"); }
    };

    const openEditAppointmentModal = (app) => {
        setAppointmentToEdit(app);
        setValue("patient", app.patient);
        setValue("rut", app.rut);
        setValue("date", app.date); // Formato YYYY-MM-DD
        setValue("time", app.time);
        setValue("procedure", app.reason);
        setValue("medic", app.medic);
        setValue("location", app.location);
        setIsEditAppointmentModalOpen(true);
    };

    const onSubmitNewAppointment = async (data) => await handleSave(data, 'POST', API_APPOINTMENTS_URL, "Cita agendada.");
    const onSubmitEditAppointment = async (data) => {
        if (!appointmentToEdit) return;
        await handleSave(data, 'PUT', `${API_APPOINTMENTS_URL}/${appointmentToEdit.id}`, "Cita actualizada.");
    };

    const handleSave = async (data, isEdit) => {
            try {
                const url = isEdit ? `${API_APPOINTMENTS_URL}/${appointmentToEdit.id}` : API_APPOINTMENTS_URL;
                const method = isEdit ? 'PUT' : 'POST';

                const payload = {
                    patient: data.patient.toUpperCase(),
                    rut: data.rut,
                    time: data.time,
                    date: data.date,
                    reason: data.procedure, 
                    medic: data.medic,
                    location: data.location || 'Consultorio 1', 
                    status: isEdit ? appointmentToEdit.status : 'Confirmada', 
                };

                const response = await fetch(url, {
                    method: method,
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload),
                });

                if (!response.ok) throw new Error("Fallo al guardar");

                setIsNewAppointmentModalOpen(false);
                setIsEditAppointmentModalOpen(false);
                reset();
                fetchAppointments(); 
                setSuccessMessage(isEdit ? "Cita actualizada." : "Cita agendada.");
                setIsSuccessModalOpen(true);
            } catch (err) { alert(err.message); }
        };

    const onInvalid = (errors) => {
        const msgs = [];
        if (errors.patient) msgs.push("Paciente obligatorio.");
        if (errors.date) msgs.push("Fecha obligatoria.");
        if (errors.time) msgs.push("Hora obligatoria.");
        setValidationMessages(msgs);
        setShowValidationModal(true);
    };

    const deleteAppointment = (app) => { setAppointmentToDelete(app); setIsDeleteModalOpen(true); };
    const confirmDeletion = async () => {
        if (appointmentToDelete) {
            await fetch(`${API_APPOINTMENTS_URL}/${appointmentToDelete.id}`, { method: 'DELETE', headers: getAuthHeaders() });
            setIsDeleteModalOpen(false);
            fetchAppointments(); 
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#faf7ff', minHeight: '100vh' }}>
            <div style={topMenuStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={goBack} style={{ ...topBtnStyle, fontSize: '1.2rem', fontWeight: '800' }}>← Volver al Dashboard</button>
                    <button onClick={() => navigateTo('pacientes')} style={{ ...topBtnStyle, opacity: 1, fontWeight: '700' }}>Pacientes</button>
                    <button onClick={() => navigateTo('agenda_medica')} style={topBtnStyle}>Agenda médica</button>
                    <button onClick={() => navigateTo('recetas_medicas')} style={topBtnStyle}>Recetas médicas</button>
                </div>
                <button onClick={handleLogout} style={logoutBtnStyle}>Cerrar Sesión</button>
            </div>

            <div style={cardStyle}>
                <h1 style={{ color: '#830cc4' }}>Agenda de Citas</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={searchInputStyle} />
                    <button onClick={() => { reset(); setIsNewAppointmentModalOpen(true); }} style={actionBtnStyle}>+ Nueva Cita</button>
                </div>

                {!isLoading && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                         <thead>
                            <tr style={{ background: '#f3e8ff', color: '#4a0376' }}>
                                <th style={thStyle}>Hora</th>
                                <th style={thStyle}>Paciente</th>
                                <th style={thStyle}>Motivo</th>
                                <th style={{...thStyle, textAlign:'center'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{...tdStyle, fontWeight:'bold'}}>{app.time}</td>
                                    <td style={tdStyle}>{app.patient}</td>
                                    <td style={tdStyle}>{app.reason}</td>
                                    <td style={{...tdStyle, textAlign:'center'}}>
                                        <button onClick={() => openEditAppointmentModal(app)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', marginRight:'10px'}}>✏️</button>
                                        <button onClick={() => deleteAppointment(app)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem'}}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL NUEVA / EDITAR CITA */}
            {(isNewAppointmentModalOpen || isEditAppointmentModalOpen) && (
                <div className="modal-backdrop" style={modalBackdropStyle} onClick={() => {setIsNewAppointmentModalOpen(false); setIsEditAppointmentModalOpen(false);}}>
                    <div className="modal-card" style={modalCardStyle} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: '#830cc4', textAlign: 'center' }}>{isEditAppointmentModalOpen ? "Editar Cita" : "Nueva Cita"}</h2>
                        <form onSubmit={handleSubmit(isEditAppointmentModalOpen ? onSubmitEditAppointment : onSubmitNewAppointment, onInvalid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input {...register("patient", { required: true })} placeholder="Paciente" style={inputStyle} />
                            <input {...register("rut")} placeholder="RUT" style={inputStyle} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <input type="date" {...register("date", { required: true })} style={inputStyle} />
                                <input type="time" {...register("time", { required: true })} style={inputStyle} />
                            </div>
                            <input {...register("procedure", { required: true })} placeholder="Motivo" style={inputStyle} />
                            <button type="submit" style={modalBtnStyle}>{isEditAppointmentModalOpen ? "Actualizar" : "Agendar"}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* POPUPS (Validación, Éxito, Eliminar) - REUTILIZADOS */}
             {showValidationModal && (
                <div className="modal-backdrop" style={modalBackdropStyle} onClick={() => setShowValidationModal(false)}>
                    <div style={{ ...alertModalStyle }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c' }}>Datos Faltantes</h3>
                        <ul>{validationMessages.map((m, i) => <li key={i}>{m}</li>)}</ul>
                        <button onClick={() => setShowValidationModal(false)} style={{ ...modalBtnStyle, background: '#e35c5c' }}>OK</button>
                    </div>
                </div>
            )}
            {isSuccessModalOpen && (
                <div className="modal-backdrop" style={modalBackdropStyle}>
                    <div style={{ ...alertModalStyle, textAlign: 'center' }}>
                        <h2 style={{ color: '#00b050' }}>¡Hecho!</h2>
                        <p>{successMessage}</p>
                        <button onClick={() => setIsSuccessModalOpen(false)} style={{ ...modalBtnStyle, background: '#00b050' }}>Aceptar</button>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="modal-backdrop" style={modalBackdropStyle}>
                    <div style={{ ...alertModalStyle, textAlign: 'center' }}>
                        <h2 style={{ color: '#e35c5c' }}>Eliminar</h2>
                        <button onClick={() => setIsDeleteModalOpen(false)} style={{...btnCancelStyle, marginRight:'10px'}}>Cancelar</button>
                        <button onClick={confirmDeletion} style={{...modalBtnStyle, background: '#e35c5c', width:'auto'}}>Sí</button>
                    </div>
                </div>
            )}
             <style>{` @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } } `}</style>
        </div>
    );
}

// ESTILOS (Idénticos)
const topMenuStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#830cc4', padding: '12px 25px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: 'white' };
const topBtnStyle = { all: 'unset', color: 'white', cursor: 'pointer', fontSize: '1rem', padding: '5px 10px', opacity: 0.9, transition: 'opacity 0.2s' };
const logoutBtnStyle = { all: 'unset', background: 'rgba(255, 255, 255, 0.2)', padding: '8px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', color: 'white', transition: 'background 0.2s' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '1100px', margin: '0 auto' };
const searchInputStyle = { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', maxWidth: '350px', fontSize: '1rem' };
const actionBtnStyle = { background: '#830cc4', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const modalBackdropStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalCardStyle = { background: 'white', padding: '35px', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const alertModalStyle = { background: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' };
const modalBtnStyle = { width: '100%', padding: '12px', background: '#830cc4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };
const btnCancelStyle = { padding: '12px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' };
const thStyle = { padding: '15px', textAlign: 'left', fontWeight: '700' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #f0f0f0', color: '#555' };