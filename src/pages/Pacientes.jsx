// src/pages/Pacientes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';

const API_BASE_URL = 'http://localhost:8080';
const API_PATIENTS_ENDPOINT = `${API_BASE_URL}/api/patients`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
};

const convertToCsvAndDownload = (data, filename, headers, keys) => {
    if (!data || data.length === 0) { alert("No hay datos."); return; }
    let csv = '\uFEFF' + headers.join(';') + '\n';
    data.forEach(item => {
        const row = keys.map(key => {
            let val = item[key] ? item[key].toString() : '';
            if (val.includes(';') || val.includes('\n')) val = `"${val.replace(/"/g, '""')}"`;
            return val;
        }).join(';');
        csv += row + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
};

export default function Pacientes({ goBack, setPagina, handleLogout }) {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [patientToEdit, setPatientToEdit] = useState(null);
    
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [patientToDelete, setPatientToDelete] = useState(null); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationMessages, setValidationMessages] = useState([]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const navigateTo = (page) => { if (setPagina) setPagina(page); };

    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_PATIENTS_ENDPOINT, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            const mappedData = data.map(p => ({
                id: p.id,
                nombreCompleto: `${p.nombrePaciente} ${p.apellidoPaciente}`,
                rut: p.rutPaciente,
                telefono: p.telefono || '-',
                extra: p.direccionPaciente || 'Sin observaciones',
                raw: p 
            }));
            setPatients(mappedData);
            setError(null);
        } catch (err) { setError("No se pudo conectar con el servidor."); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

    const filteredPatients = patients.filter(p =>
        p.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.rut.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (patient) => {
        setPatientToEdit(patient);
        setValue("nombre", patient.raw.nombrePaciente);
        setValue("apellido", patient.raw.apellidoPaciente);
        setValue("rut", patient.raw.rutPaciente);
        setValue("telefono", patient.raw.telefono);
        setValue("diagnosis", patient.raw.direccionPaciente);
        setValue("status", patient.raw.estado || "Activo");
        setIsEditModalOpen(true);
        setIsNewPatientModalOpen(false);
    };

    const openNewModal = () => {
        setPatientToEdit(null);
        reset();
        setIsNewPatientModalOpen(true);
        setIsEditModalOpen(false);
    };

    // --- FUNCIÓN UNIFICADA (SOLUCIÓN) ---
    const onSubmitForm = async (data) => {
        try {
            let url = API_PATIENTS_ENDPOINT;
            let method = 'POST';
            let msg = "Paciente creado.";
            
            let extraData = {
                fechaNacimiento: new Date().toISOString().split('T')[0],
                genero: "Masculino"
            };

            if (isEditModalOpen) {
                if (!patientToEdit || !patientToEdit.id) {
                    alert("Error: No se identificó el paciente.");
                    return;
                }
                url = `${API_PATIENTS_ENDPOINT}/${patientToEdit.id}`;
                method = 'PUT';
                msg = "Paciente actualizado.";
                // Mantener datos originales
                extraData.fechaNacimiento = patientToEdit.raw.fechaNacimiento;
                extraData.genero = patientToEdit.raw.genero;
            }

            const payload = {
                nombrePaciente: data.nombre,
                apellidoPaciente: data.apellido,
                rutPaciente: data.rut,
                telefono: data.telefono,
                direccionPaciente: data.diagnosis || "Sin observaciones",
                estado: data.status,
                clinicaId: 1,
                ...extraData
            };

            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Fallo al guardar.");
            }

            setIsNewPatientModalOpen(false);
            setIsEditModalOpen(false);
            setPatientToEdit(null);
            reset();
            setSuccessMessage(msg);
            setIsSuccessModalOpen(true);
            fetchPatients(); 

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const onInvalid = (errors) => {
        const msgs = [];
        if (errors.nombre) msgs.push("Nombre obligatorio.");
        if (errors.apellido) msgs.push("Apellido obligatorio.");
        if (errors.rut) msgs.push(errors.rut.message || "RUT inválido.");
        setValidationMessages(msgs);
        setShowValidationModal(true);
    };

    const deletePatient = (p) => { setPatientToDelete(p); setIsDeleteModalOpen(true); };
    const confirmDeletion = async () => {
        if (!patientToDelete) return;
        try {
            await fetch(`${API_PATIENTS_ENDPOINT}/${patientToDelete.id}`, { method: 'DELETE', headers: getAuthHeaders() });
            setIsDeleteModalOpen(false);
            fetchPatients();
        } catch (err) { alert("Error al eliminar"); }
    };

    const exportPatientsToExcel = () => {
        const headers = ["ID", "Nombre", "RUT", "Teléfono", "Info Extra"];
        const keys = ["id", "nombreCompleto", "rut", "telefono", "extra"];
        convertToCsvAndDownload(filteredPatients, "pacientes.csv", headers, keys);
    }; 

    return (
        <div style={{ padding: '20px', backgroundColor: '#faf7ff', minHeight: '100vh' }}>
            <div style={topMenuStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={goBack} style={{ ...topBtnStyle, fontSize: '1.2rem', fontWeight: '800' }}>← Volver</button>
                    <button onClick={() => navigateTo('pacientes')} style={{ ...topBtnStyle, opacity: 1, fontWeight: '700' }}>Pacientes</button>
                    <button onClick={() => navigateTo('agenda_medica')} style={topBtnStyle}>Agenda</button>
                    <button onClick={() => navigateTo('recetas_medicas')} style={topBtnStyle}>Recetas</button>
                </div>
                <button onClick={handleLogout} style={logoutBtnStyle}>Cerrar Sesión</button>
            </div>

            <div style={cardStyle}>
                <h1 style={{ color: '#830cc4', marginBottom: '5px' }}>Gestión de Pacientes</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={searchInputStyle} />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={exportPatientsToExcel} style={{ ...actionBtnStyle, background: '#00b050' }}>🗂️ Excel</button>
                        <button onClick={openNewModal} style={actionBtnStyle}>+ Nuevo</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ background: '#f3e8ff', color: '#4a0376' }}>
                                <th style={thStyle}>Nombre</th>
                                <th style={thStyle}>RUT</th>
                                <th style={thStyle}>Teléfono</th>
                                <th style={thStyle}>Info Extra</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>{p.nombreCompleto}</td>
                                    <td style={tdStyle}>{p.rut}</td>
                                    <td style={tdStyle}>{p.telefono}</td>
                                    <td style={tdStyle}>{p.extra}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                                        <button onClick={() => openEditModal(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight:'10px' }}>✏️</button>
                                        <button onClick={() => deletePatient(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL UNIFICADO */}
            {(isNewPatientModalOpen || isEditModalOpen) && (
                <div className="modal-backdrop" style={modalBackdropStyle} onClick={() => { setIsNewPatientModalOpen(false); setIsEditModalOpen(false); }}>
                    <div className="modal-card" style={modalCardStyle} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: '#830cc4', textAlign: 'center', marginBottom: '20px' }}>
                            {isEditModalOpen ? "Editar Paciente" : "Registrar Nuevo Paciente"}
                        </h2>
                        <form onSubmit={handleSubmit(onSubmitForm, onInvalid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Nombre*</label>
                                    <input {...register("nombre", { required: true })} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Apellido*</label>
                                    <input {...register("apellido", { required: true })} style={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>RUT*</label>
                                <input {...register("rut", { required: "RUT obligatorio", pattern: { value: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, message: "Formato inválido" } })} placeholder="Ej: 12.345.678-9" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Teléfono</label>
                                <input {...register("telefono")} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Diagnóstico (Opcional)</label>
                                <input {...register("diagnosis")} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Estatus</label>
                                <select {...register('status')} style={inputStyle}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <button type="submit" style={modalBtnStyle}>{isEditModalOpen ? "Actualizar" : "Guardar"}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* POPUPS */}
            {showValidationModal && (
                <div className="modal-backdrop" style={modalBackdropStyle} onClick={() => setShowValidationModal(false)}>
                    <div style={{ ...alertModalStyle, animation: 'shake 0.3s' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c' }}>Faltan Datos</h3>
                        <ul>{validationMessages.map((m, i) => <li key={i}>{m}</li>)}</ul>
                        <button onClick={() => setShowValidationModal(false)} style={{ ...modalBtnStyle, background: '#e35c5c' }}>OK</button>
                    </div>
                </div>
            )}
            {isSuccessModalOpen && (
                <div className="modal-backdrop" style={modalBackdropStyle}>
                    <div style={{ ...alertModalStyle, textAlign: 'center' }}>
                        <h2 style={{ color: '#00b050' }}>¡Éxito!</h2>
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

// ESTILOS
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
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '700', fontSize: '0.9rem', color: '#333' };
const modalBtnStyle = { width: '100%', padding: '12px', background: '#830cc4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };
const btnCancelStyle = { padding: '12px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' };
const thStyle = { padding: '15px', textAlign: 'left', fontWeight: '700' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #f0f0f0', color: '#555' };