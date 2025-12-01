// src/pages/RecetasMedicas.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../assets/logo_drfachero.png';

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

// Datos simulados de recetas
const initialRecipes = [
    { 
        id: 1, 
        patientName: 'Ramírez Doménica', 
        date: '2023-11-15', 
        medicament: 'Ezetimiba/Rosuvastatina', 
        quantity: 'TAB 10mg/20mg #30', 
        duration: 'Tratamiento continuo', 
        diagnosis: 'Hiperlipidemia mixta', 
        prescriptionDetail: 'Tomar una tableta cada noche'
    },
    { 
        id: 2, 
        patientName: 'Pérez Juan', 
        date: '2023-11-10', 
        medicament: 'Amoxicilina', 
        quantity: 'Cápsulas 500mg #14', 
        duration: '7 días', 
        diagnosis: 'Infección respiratoria', 
        prescriptionDetail: 'Tomar una cápsula cada 8 horas'
    },
];

// Datos del médico para la plantilla de receta
const medicData = {
    name: "DR. ARTURO CRUZ RIVADENEIRA",
    title: "Médico General",
    dgp: "1342631",
    cmp: "5024",
    cedula: "12345",
    address: "Sauces 6 Mz 250 V23 Telf 04-2967796",
    phone: "Telf Cel 0983971613",
    email: "arturocruzriv@hotmail.com"
};

export default function RecetasMedicas({ goBack }) {
    const [recipes, setRecipes] = useState(initialRecipes);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para Modales
    const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);
    const [isPrintRecipeModalOpen, setIsPrintRecipeModalOpen] = useState(false);
    const [recipeToPrint, setRecipeToPrint] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [recipeToDelete, setRecipeToDelete] = useState(null); 
    
    // ESTADO: Modal de éxito después de crear receta
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const filteredRecipes = recipes.filter(recipe =>
        recipe.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.medicament.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- FUNCIONES DE GESTIÓN ---

    // Abre modal de nueva receta
    const openNewRecipeModal = () => {
        reset({ date: new Date().toISOString().substring(0, 10) }); // Set default date
        setIsNewRecipeModalOpen(true);
    };

    // Envío del formulario de nueva receta
    const onSubmitNewRecipe = (data) => {
        const newRecipe = {
            id: Date.now(),
            ...data,
        };
        setRecipes([...recipes, newRecipe]);
        
        // Cierra el modal de formulario y limpia
        setIsNewRecipeModalOpen(false);
        reset();
        
        // CORRECCIÓN CLAVE: Abrir el modal de éxito con un ligero retraso (ej. 100ms) 
        // para asegurar que el modal del formulario se desmonte correctamente.
        setTimeout(() => {
            setIsSuccessModalOpen(true); 
        }, 100);
    };

    // FUNCIÓN: Cierra el modal de éxito
    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };
    
    // Abre modal de impresión
    const printRecipe = (recipe) => {
        setRecipeToPrint(recipe);
        setIsPrintRecipeModalOpen(true);
    };
    
    // Abre modal de eliminación
    const deleteRecipe = (recipe) => {
        setRecipeToDelete(recipe);
        setIsDeleteModalOpen(true);
    };

    // Confirma la eliminación
    const confirmDeletion = () => {
        if (recipeToDelete) {
            setRecipes(recipes.filter(r => r.id !== recipeToDelete.id));
            setRecipeToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };


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
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>Módulo Recetas Médicas</span>
            </div>

            {/* CONTENIDO DEL MÓDULO */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={cardStyle}>
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Gestión de Recetas</h1>
                    <p style={{ color: '#555', marginBottom: '30px' }}>
                        Crea y administra las recetas médicas para tus pacientes.
                    </p>

                    {/* Controles: Buscar y Nueva Receta */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Buscar por paciente o medicamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        <button 
                            onClick={openNewRecipeModal}
                            style={{ 
                                background: '#830cc4', color: '#fff', padding: '10px 15px', border: 'none', 
                                borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
                            }}
                        >
                            + Nueva Receta
                        </button>
                    </div>

                    {/* Tabla de Recetas */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #830cc4', backgroundColor: '#f9f5ff' }}>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Paciente</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '25%' }}>Medicamento</th>
                                <th style={{ padding: '15px 10px', textAlign: 'left', width: '15%' }}>Fecha</th>
                                <th style={{ padding: '15px 10px', textAlign: 'center', width: '25%' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecipes.length > 0 ? filteredRecipes.map(recipe => (
                                <tr key={recipe.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px 10px', fontWeight: 'bold' }}>{recipe.patientName}</td>
                                    <td style={{ padding: '15px 10px', color: '#555' }}>{recipe.medicament}</td>
                                    <td style={{ padding: '15px 10px', color: '#555' }}>{recipe.date}</td>
                                    <td style={{ padding: '15px 10px', textAlign: 'center' }}>
                                        <button 
                                            onClick={() => printRecipe(recipe)} 
                                            style={{ background: '#00b050', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                                        >
                                            Imprimir
                                        </button>
                                        <button 
                                            onClick={() => deleteRecipe(recipe)} 
                                            style={{ background: '#e35c5c', color: '#fff', padding: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                                        No se encontraron recetas que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL 1: NUEVA RECETA MÉDICA --- */}
            {isNewRecipeModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsNewRecipeModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(600px, 90vw)' }}>
                        <h3 style={{ color: '#830cc4', margin: '0 0 15px' }}>Crear Nueva Receta</h3>
                        <form onSubmit={handleSubmit(onSubmitNewRecipe)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            
                            <div className="field">
                                <label htmlFor="patientName">Nombre y Apellido del Paciente*</label>
                                <input type="text" {...register('patientName', { required: 'El nombre del paciente es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.patientName && <small style={{ color: '#e35c5c' }}>{errors.patientName.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="date">Fecha de la Receta*</label>
                                <input type="date" {...register('date', { required: 'La fecha es obligatoria' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.date && <small style={{ color: '#e35c5c' }}>{errors.date.message}</small>}
                            </div>
                            
                            <div className="field">
                                <label htmlFor="medicament">Nombre del Medicamento*</label>
                                <input type="text" {...register('medicament', { required: 'El nombre del medicamento es obligatorio' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.medicament && <small style={{ color: '#e35c5c' }}>{errors.medicament.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="quantity">Cantidad y Concentración*</label>
                                <input type="text" {...register('quantity', { required: 'La cantidad es obligatoria' })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="Ej: TAB 10mg/20mg #30" />
                                {errors.quantity && <small style={{ color: '#e35c5c' }}>{errors.quantity.message}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="duration">Duración del Tratamiento</label>
                                <input type="text" {...register('duration')} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="Ej: Tratamiento continuo" />
                            </div>

                            <div className="field">
                                <label htmlFor="diagnosis">Diagnóstico</label>
                                <input type="text" {...register('diagnosis')} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} placeholder="Ej: Hiperlipidemia mixta" />
                            </div>

                            <div className="field">
                                <label htmlFor="prescriptionDetail">Detalle de la Prescripción*</label>
                                <textarea {...register('prescriptionDetail', { required: 'El detalle de la prescripción es obligatorio' })} rows="3" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }} placeholder="Ej: Tomar una tableta cada noche"></textarea>
                                {errors.prescriptionDetail && <small style={{ color: '#e35c5c' }}>{errors.prescriptionDetail.message}</small>}
                            </div>
                            
                            <button type="submit" style={{ background: '#830cc4', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', marginTop: '10px' }}>
                                Guardar Receta
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: PLANTILLA DE RECETA PARA IMPRIMIR --- */}
            {isPrintRecipeModalOpen && recipeToPrint && (
                <div className="modal-backdrop" onClick={() => setIsPrintRecipeModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', padding: '20px', border: '1px solid #000', fontFamily: 'Arial, sans-serif' }}>
                        <div id="print-recipe-area" style={{ padding: '20px' }}>
                            {/* ENCABEZADO DE LA RECETA */}
                            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
                                <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                                    {/* Símbolo de medicina (Ejemplo, puede ser un logo) */}
                                    <img src={logo} alt="Dr. Fachero Logo" style={{ height: '80px', marginBottom: '10px' }} />
                                </div>
                                <div style={{ flexGrow: 1, textAlign: 'center' }}>
                                    <h3 style={{ margin: '0', fontSize: '1.5rem', color: '#333' }}>{medicData.name}</h3>
                                    <p style={{ margin: '5px 0 0', fontSize: '1.2rem', color: '#555' }}>{medicData.title}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: '#777' }}>
                                        D.G.P {medicData.dgp} & C.M.P {medicData.cmp} * Cédula Estatal No. {medicData.cedula}
                                    </p>
                                </div>
                            </div>

                            {/* CUERPO DE LA RECETA */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', minHeight: '300px' }}>
                                
                                {/* Columna Izquierda - Información del Paciente y Datos */}
                                <div style={{ borderRight: '1px solid #eee', paddingRight: '20px' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>NOMBRE Y APELLIDO DE PACIENTE</strong>
                                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{recipeToPrint.patientName}</span>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>FECHA DE LA RECETA</strong>
                                        <span style={{ fontSize: '1rem' }}>{recipeToPrint.date}</span>
                                    </div>
                                    <div style={{ marginBottom: '15px', color: '#830cc4', fontWeight: 'bold' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>Rp.</strong>
                                        <span style={{ fontSize: '1.2rem' }}>RECETA MÉDICA</span>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>Se solicita:</strong>
                                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{recipeToPrint.medicament}</span>
                                        <p style={{ margin: '5px 0 0' }}>{recipeToPrint.quantity}</p>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>DURACIÓN DEL TRATAMIENTO</strong>
                                        <span style={{ fontSize: '1rem' }}>{recipeToPrint.duration || 'N/A'}</span>
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>DIAGNÓSTICO</strong>
                                        <span style={{ fontSize: '1rem' }}>{recipeToPrint.diagnosis || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Columna Derecha - Prescripción y Firma */}
                                <div style={{ position: 'relative' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <strong style={{ display: 'block', marginBottom: '5px' }}>Prescripción</strong>
                                        <p style={{ fontSize: '1.1rem' }}>{recipeToPrint.prescriptionDetail}</p>
                                    </div>

                                    {/* Firma del Médico */}
                                    <div style={{ position: 'absolute', bottom: '0', right: '0', textAlign: 'center', borderTop: '1px solid #000', paddingTop: '10px', width: '250px' }}>
                                        <p style={{ margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>{medicData.name}</p>
                                        <p style={{ margin: '0', fontSize: '0.8rem' }}>{medicData.title}</p>
                                        <p style={{ margin: '0', fontSize: '0.7rem' }}>Cédula Profesional {medicData.cmp}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* PIE DE PÁGINA DE LA RECETA */}
                            <div style={{ borderTop: '2px solid #000', paddingTop: '10px', marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ margin: '0', fontSize: '0.9rem' }}>
                                    <strong style={{ marginRight: '10px' }}>{medicData.name}</strong>
                                    {medicData.address} <br/>
                                    {medicData.phone} | E: {medicData.email}
                                </p>
                            </div>
                        </div>

                        {/* Botón de Impresión Real */}
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button
                                type="button"
                                onClick={() => { window.print(); setIsPrintRecipeModalOpen(false); }}
                                style={{ background: '#00b050', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
                            >
                                Imprimir Receta
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 3: CONFIRMACIÓN DE ELIMINACIÓN DE RECETA --- */}
            {isDeleteModalOpen && recipeToDelete && (
                <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 10px' }}>Confirmar Eliminación</h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>
                            ¿Seguro que deseas eliminar la receta de **{recipeToDelete.patientName}** para **{recipeToDelete.medicament}**?
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
                                Sí, Eliminar Receta
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- MODAL 4: CONFIRMACIÓN DE ÉXITO DE RECETA --- */}
            {isSuccessModalOpen && (
                <div 
                    className="modal-backdrop" 
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="success-modal-title"
                    onClick={closeSuccessModal}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="document"
                        style={{ maxWidth: '400px', textAlign: 'center' }}
                    >
                        <h3 id="success-modal-title" style={{ color: '#00b050', margin: '0 0 10px' }}>
                            ¡Receta Creada con Éxito!
                        </h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>
                            La prescripción ha sido guardada en el sistema. Ahora puedes imprimirla.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={closeSuccessModal}
                                style={{ 
                                    background: '#00b050', color: '#fff', padding: '10px 14px', border: 'none', 
                                    borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                                }}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}