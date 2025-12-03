// src/pages/RecetasMedicas.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../assets/logo_drfachero.png';

const API_BASE_URL = 'http://localhost:8080';
const API_RECIPES_URL = `${API_BASE_URL}/api/recipes`;

const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' };
};

const medicData = { name: "DR. ARTURO CRUZ RIVADENEIRA", title: "Médico General", dgp: "1342631", cmp: "5024", cedula: "12345", address: "Sauces 6 Mz 250 V23", phone: "0983971613", email: "arturocruzriv@hotmail.com" };

export default function RecetasMedicas({ goBack, setPagina, handleLogout }) {
    const [recipes, setRecipes] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    
    // Estados Modales
    const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);
    const [isEditRecipeModalOpen, setIsEditRecipeModalOpen] = useState(false);
    const [recipeToEdit, setRecipeToEdit] = useState(null);

    const [isPrintRecipeModalOpen, setIsPrintRecipeModalOpen] = useState(false);
    const [recipeToPrint, setRecipeToPrint] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [recipeToDelete, setRecipeToDelete] = useState(null); 
    
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationMessages, setValidationMessages] = useState([]);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    
    const navigateTo = (page) => { if (setPagina) setPagina(page); };
    
    const fetchRecipes = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_RECIPES_URL, { headers: getAuthHeaders() }); 
            if (!response.ok) {
                if (response.status === 401) { handleLogout(); return; }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setRecipes(Array.isArray(data) ? data : []);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    }, [handleLogout]);

    useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

    const filteredRecipes = recipes.filter(r =>
        r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.medicament.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Abrir Modal Editar
    const openEditRecipeModal = (recipe) => {
        setRecipeToEdit(recipe);
        setValue("patientName", recipe.patientName);
        setValue("date", recipe.date);
        setValue("diagnosis", recipe.diagnosis);
        setValue("medicament", recipe.medicament);
        setValue("quantity", recipe.quantity);
        setValue("duration", recipe.duration);
        setValue("prescriptionDetail", recipe.prescriptionDetail);
        setIsEditRecipeModalOpen(true);
        setIsNewRecipeModalOpen(false);
    };

    // Abrir Modal Nuevo
    const openNewRecipeModal = () => {
        setRecipeToEdit(null);
        reset();
        setIsNewRecipeModalOpen(true);
        setIsEditRecipeModalOpen(false);
    };

    // --- FUNCIÓN DE ENVÍO UNIFICADA (SOLUCIÓN DEL ERROR) ---
    const onSubmitForm = async (data) => {
        try {
            let url = API_RECIPES_URL;
            let method = 'POST';
            let msg = "Receta creada exitosamente.";

            // Si estamos editando, cambiamos URL y Método
            if (isEditRecipeModalOpen) {
                if (!recipeToEdit || !recipeToEdit.id) {
                    alert("Error: No se identificó la receta a editar.");
                    return;
                }
                url = `${API_RECIPES_URL}/${recipeToEdit.id}`;
                method = 'PUT';
                msg = "Receta actualizada exitosamente.";
            }

            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                 const body = await response.json().catch(() => ({}));
                throw new Error(`Error: ${body.message || response.statusText}`);
            }
            
            // Cerrar todo y recargar
            setIsNewRecipeModalOpen(false);
            setIsEditRecipeModalOpen(false);
            setRecipeToEdit(null);
            reset();
            fetchRecipes(); 
            setSuccessMessage(msg);
            setIsSuccessModalOpen(true);

        } catch (err) {
            alert(err.message);
        }
    };

    const onInvalid = (errors) => {
        const msgs = [];
        if (errors.patientName) msgs.push("El Paciente es obligatorio.");
        if (errors.diagnosis) msgs.push("El Diagnóstico es obligatorio.");
        if (errors.medicament) msgs.push("El Medicamento es obligatorio.");
        setValidationMessages(msgs);
        setShowValidationModal(true);
    };
    
    const printRecipe = (r) => { setRecipeToPrint(r); setIsPrintRecipeModalOpen(true); };
    const deleteRecipe = (r) => { setRecipeToDelete(r); setIsDeleteModalOpen(true); };
    
    const confirmDeletion = async () => {
        if (!recipeToDelete) return;
        try {
            await fetch(`${API_RECIPES_URL}/${recipeToDelete.id}`, { method: 'DELETE', headers: getAuthHeaders() });
            setRecipeToDelete(null);
            setIsDeleteModalOpen(false);
            fetchRecipes(); 
        } catch (err) { alert("Fallo al eliminar: " + err.message); }
    };
    
    const RecipePrintContent = () => (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <div style={{ display: 'flex', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
                <div style={{ marginRight: '20px' }}><img src={logo} alt="Logo" style={{ height: '80px' }} /></div>
                <div style={{ textAlign: 'center', flexGrow: 1 }}>
                    <h3 style={{ margin: 0 }}>{medicData.name}</h3>
                    <p>{medicData.title}</p>
                </div>
            </div>
            <h2 style={{ textAlign: 'center', color: '#830cc4' }}>RECETA MÉDICA</h2>
            <p><strong>Paciente:</strong> {recipeToPrint?.patientName}</p>
            <p><strong>Medicamento:</strong> {recipeToPrint?.medicament}</p>
            <p><strong>Indicaciones:</strong> {recipeToPrint?.prescriptionDetail}</p>
        </div>
    );

    return (
        <div style={{ padding: '20px', backgroundColor: '#faf7ff', minHeight: '100vh' }}>
            <div style={topMenuStyle}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <button onClick={goBack} style={{...topBtnStyle, fontWeight:'800', fontSize:'1.2rem'}}>← Volver</button>
                    <button onClick={() => navigateTo('pacientes')} style={topBtnStyle}>Pacientes</button>
                    <button onClick={() => navigateTo('agenda_medica')} style={topBtnStyle}>Agenda</button>
                    <button onClick={() => navigateTo('recetas_medicas')} style={{...topBtnStyle, opacity:1, fontWeight:'700'}}>Recetas</button>
                </div>
                <button onClick={handleLogout} style={logoutBtnStyle}>Cerrar Sesión</button>
            </div>
            
            <div style={cardStyle}>
                <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Gestión de Recetas</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <input placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={searchInputStyle} />
                    <button onClick={openNewRecipeModal} style={actionBtnStyle}>+ Nueva Receta</button>
                </div>
                
                {!isLoading && !error && (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ background: '#f3e8ff', color: '#4a0376' }}>
                                    <th style={thStyle}>Paciente</th>
                                    <th style={thStyle}>Medicamento</th>
                                    <th style={thStyle}>Fecha</th>
                                    <th style={{...thStyle, textAlign:'center'}}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecipes.map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>{r.patientName}</td>
                                        <td style={tdStyle}>{r.medicament}</td>
                                        <td style={tdStyle}>{r.date}</td>
                                        <td style={{...tdStyle, textAlign:'center'}}>
                                            <button onClick={() => openEditRecipeModal(r)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', marginRight:'10px'}} title="Editar">✏️</button>
                                            <button onClick={() => printRecipe(r)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', marginRight:'10px'}} title="Imprimir">🖨️</button>
                                            <button onClick={() => deleteRecipe(r)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem'}} title="Eliminar">🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL NUEVA / EDITAR RECETA */}
            {(isNewRecipeModalOpen || isEditRecipeModalOpen) && (
                <div className="modal-backdrop" style={modalBackdropStyle} onClick={() => {setIsNewRecipeModalOpen(false); setIsEditRecipeModalOpen(false);}}>
                    <div className="modal-card" style={modalCardStyle} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: '#830cc4', textAlign: 'center' }}>{isEditRecipeModalOpen ? "Editar Receta" : "Nueva Receta"}</h2>
                        <form onSubmit={handleSubmit(onSubmitForm, onInvalid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input {...register("patientName", { required: true })} placeholder="Paciente" style={inputStyle} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <input type="date" {...register("date", { required: true })} style={inputStyle} />
                                <input {...register("diagnosis", { required: true })} placeholder="Diagnóstico" style={inputStyle} />
                            </div>
                            <input {...register("medicament", { required: true })} placeholder="Medicamento" style={inputStyle} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <input {...register("quantity", { required: true })} placeholder="Cantidad" style={inputStyle} />
                                <input {...register("duration")} placeholder="Duración" style={inputStyle} />
                            </div>
                            <textarea {...register("prescriptionDetail", { required: true })} placeholder="Instrucciones" rows="3" style={inputStyle} />
                            <button type="submit" style={modalBtnStyle}>{isEditRecipeModalOpen ? "Actualizar" : "Guardar"}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* POP-UPS */}
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
            {isPrintRecipeModalOpen && (
                <div className="modal-backdrop" style={modalBackdropStyle} onClick={() => setIsPrintRecipeModalOpen(false)}>
                    <div style={{...modalCardStyle, maxWidth:'700px'}} onClick={e => e.stopPropagation()}>
                        <RecipePrintContent />
                        <button onClick={() => window.print()} style={{...modalBtnStyle, marginTop:'20px'}}>Imprimir</button>
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
const modalBtnStyle = { width: '100%', padding: '12px', background: '#830cc4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' };
const btnCancelStyle = { padding: '12px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' };
const thStyle = { padding: '15px', textAlign: 'left', fontWeight: '700' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #f0f0f0', color: '#555' };