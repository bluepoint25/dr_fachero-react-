// src/pages/RecetasMedicas.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../assets/logo_drfachero.png'; // Usado en el Modal de Impresión

// URL base de la API para Recetas
const API_RECIPES_URL = 'http://localhost:8080/api/recipes';

// --- FUNCIÓN DE UTILIDAD: MANEJO SEGURO DE ERRORES DE API ---
// Lee el cuerpo de la respuesta. Intenta JSON, si falla, lee como texto.
const getSafeErrorMessage = async (response) => {
    try {
        // 1. Intenta leer como JSON (para errores de validación de backend)
        const errorBody = await response.json();
        
        // Intenta extraer el mensaje del error de Spring Boot o usar un mensaje genérico
        if (errorBody.errors && errorBody.errors.length > 0) {
            return errorBody.errors.map(err => `${err.field}: ${err.defaultMessage}`).join('; ');
        }
        return errorBody.message || errorBody.error || JSON.stringify(errorBody);

    } catch (_e) { // Corregido: 'e' cambiado a '_e'
        // 2. Si falla la lectura JSON, lee como texto (para errores no JSON)
        try {
            const errorText = await response.text();
            return errorText || `Error HTTP ${response.status}. Respuesta vacía.`;
        } catch (_e) { // Corregido: 'e' cambiado a '_e'
            return `Error HTTP ${response.status}. Fallo al procesar la respuesta.`;
        }
    }
};

// --- FUNCIÓN UTILITARIA para EXPORTAR a CSV/EXCEL ---
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


// Estilos Reutilizados (se mantienen)
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

// Datos del médico para la plantilla de receta (Ahora se usan en el Modal de Impresión)
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

export default function RecetasMedicas({ goBack, setPagina, handleLogout }) {
    const [recipes, setRecipes] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null); 
    
    // Estados para Modales
    const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);
    const [isPrintRecipeModalOpen, setIsPrintRecipeModalOpen] = useState(false);
    const [recipeToPrint, setRecipeToPrint] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    const [recipeToDelete, setRecipeToDelete] = useState(null); 
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
    const fetchRecipes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_RECIPES_URL); 

            if (!response.ok) {
                throw new Error(`Error al cargar las recetas. HTTP: ${response.status}. Asegúrese de que el endpoint GET ${API_RECIPES_URL} esté implementado.`);
            }
            
            const data = await response.json();
            setRecipes(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Error al cargar recetas:", err);
            // El error de conexión es genérico, no necesita manejo de JSON/texto aquí
            setError(`Error al cargar recetas. Failed to fetch`); 
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);
    // --- FIN FUNCIÓN DE CARGA ---


    const filteredRecipes = recipes.filter(recipe =>
        // Usa searchTerm
        recipe.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.medicament.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- FUNCIÓN: EXPORTAR RECETAS A EXCEL ---
    const exportRecipesToExcel = () => {
        const headers = ["ID", "Paciente", "Fecha", "Diagnóstico", "Medicamento", "Cantidad", "Duración", "Instrucciones"];
        const keys = ["id", "patientName", "date", "diagnosis", "medicament", "quantity", "duration", "prescriptionDetail"];
        const filename = `recetas_${new Date().toISOString().substring(0, 10)}.csv`;
        
        convertToCsvAndDownload(filteredRecipes, filename, headers, keys);
    };
    // --- FIN FUNCIÓN EXPORTAR RECETAS ---


    // Abre modal de nueva receta
    const openNewRecipeModal = () => {
        reset({ date: new Date().toISOString().substring(0, 10) }); 
        setIsNewRecipeModalOpen(true);
    };

    // --- ENVÍO DEL FORMULARIO DE NUEVA RECETA (POST a la API) ---
    const onSubmitNewRecipe = async (data) => {
        try {
            const response = await fetch(API_RECIPES_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // USANDO EL MANEJO DE ERRORES SEGURO
                const errorMessage = await getSafeErrorMessage(response);
                throw new Error(errorMessage);
            }
            
            setIsNewRecipeModalOpen(false);
            reset();
            fetchRecipes(); 
            
            setTimeout(() => {
                setIsSuccessModalOpen(true); 
            }, 100);
            
        } catch (err) {
            console.error("Error al crear receta:", err);
            setError(`Fallo al crear la receta: ${err.message}`);
        }
    };
    
    // FUNCIÓN: Cierra el modal de éxito (Usada en el Modal)
    const closeSuccessModal = () => {
        setIsSuccessModalOpen(false);
    };
    
    // Abre modal de impresión (Usada en la tabla y usa setRecipeToPrint)
    const printRecipe = (recipe) => {
        setRecipeToPrint(recipe);
        setIsPrintRecipeModalOpen(true);
    };
    
    // Abre modal de eliminación (Usada en la tabla)
    const deleteRecipe = (recipe) => {
        setRecipeToDelete(recipe);
        setIsDeleteModalOpen(true);
    };

    // --- FUNCIÓN PARA CONFIRMAR ELIMINACIÓN (DELETE a la API) ---
    const confirmDeletion = async () => {
        if (recipeToDelete) {
            try {
                const response = await fetch(`${API_RECIPES_URL}/${recipeToDelete.id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    // USANDO EL MANEJO DE ERRORES SEGURO
                    const errorMessage = await getSafeErrorMessage(response);
                    throw new Error(errorMessage);
                }
                
                setRecipeToDelete(null);
                setIsDeleteModalOpen(false);
                fetchRecipes(); 
                
            } catch (err) {
                console.error("Error al eliminar receta:", err);
                alert(`Fallo al eliminar la receta: ${err.message}`);
            }
        }
    };
    
    // Componente auxiliar para el Modal de Impresión (Para asegurar uso de logo, medicData y recipeToPrint)
    const RecipePrintContent = () => (
        <div id="print-recipe-area" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
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
            {/* Resto del contenido de la receta (usa recipeToPrint) */}
            <h2 style={{ color: '#830cc4', textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #830cc4', paddingBottom: '10px' }}>RECETA MÉDICA</h2>
            <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f5ff' }}>
                <p style={{ margin: 0 }}><strong>Paciente:</strong> {recipeToPrint?.patientName}</p>
                <p style={{ margin: 0 }}><strong>Fecha:</strong> {recipeToPrint?.date}</p>
                <p style={{ margin: 0 }}><strong>Diagnóstico:</strong> {recipeToPrint?.diagnosis}</p>
            </div>
            {/* Firma y pie de página que usan medicData */}
            <div style={{ marginTop: '50px', borderTop: '1px solid #000', paddingTop: '10px', width: '30%', textAlign: 'center', marginLeft: 'auto' }}>
                Firma y Sello del Médico
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#faf7ff' }}>
            
            {/* MENÚ SUPERIOR: NAVEGACIÓN CORREGIDA */}
            <div style={topMenuStyle}>
                {/* Botón Volver (usa goBack) */}
                <button 
                    onClick={goBack} 
                    style={{ all: 'unset', color: '#fff', fontSize: '1.5rem', fontWeight: 800, cursor: 'pointer' }}
                >
                    ← Volver al Dashboard
                </button>
                <ul style={topMenuItemsStyle}>
                    {/* Botón Pacientes */}
                    <li style={topMenuItemStyle}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('pacientes')}>Pacientes</button>
                    </li>
                    {/* Botón Agenda */}
                    <li style={topMenuItemStyle}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('agenda_medica')}>Agenda médica</button>
                    </li>
                    {/* Botón Recetas (Activo) */}
                    <li style={{...topMenuItemStyle, opacity: 1}}>
                      <button style={{all:'unset', color:'inherit', cursor:'pointer'}} onClick={() => navigateTo('recetas_medicas')}>Recetas médicas</button>
                    </li>
                </ul>
                {/* Botón Cerrar Sesión */}
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
                    <h1 style={{ color: '#830cc4', marginBottom: '10px' }}>Gestión de Recetas</h1>
                    <p style={{ color: '#555', marginBottom: '30px' }}>
                        Crea y administra las recetas médicas para tus pacientes.
                    </p>
                    
                    {error && (
                        <div style={{ padding: '10px', backgroundColor: '#fdd', border: '1px solid #e35c5c', color: '#e35c5c', borderRadius: '4px', marginBottom: '20px' }}>
                            **Error de Carga:** {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        
                        <input
                            type="text"
                            placeholder="Buscar por paciente o medicamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px', width: '40%', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* NUEVO BOTÓN: EXPORTAR A EXCEL */}
                            <button 
                                onClick={exportRecipesToExcel}
                                disabled={isLoading || filteredRecipes.length === 0}
                                style={{ 
                                    background: '#00b050', color: '#fff', padding: '10px 15px', border: 'none', 
                                    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                                    opacity: (isLoading || filteredRecipes.length === 0) ? 0.6 : 1 
                                }}
                                title="Exportar recetas visibles a CSV/Excel"
                            >
                                🗂️ Exportar Excel
                            </button>
                            {/* BOTÓN: NUEVA RECETA */}
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
                    </div>
                    
                    {/* Mensaje de Carga */}
                    {isLoading && (
                        <p style={{ textAlign: 'center', color: '#830cc4' }}>Cargando recetas...</p>
                    )}

                    {/* Tabla de Recetas */}
                    {!isLoading && (
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
                                            No se encontraron recetas en el sistema.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* --- MODALES --- */}
            
            {/* Modal de Nueva Receta */}
            {isNewRecipeModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsNewRecipeModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
                        <h2 style={{ color: '#830cc4', marginTop: 0 }}>Crear Nueva Receta</h2>
                        <form onSubmit={handleSubmit(onSubmitNewRecipe)}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Paciente*</label>
                                <input {...register("patientName", { required: "El nombre es obligatorio" })} placeholder="Nombre completo" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.patientName && <small style={{ color: '#e35c5c' }}>{errors.patientName.message || "Campo obligatorio"}</small>}
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fecha*</label>
                                    <input type="date" {...register("date", { required: "La fecha es obligatoria" })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.date && <small style={{ color: '#e35c5c' }}>{errors.date.message || "Campo obligatorio"}</small>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Diagnóstico*</label>
                                    <input {...register("diagnosis", { required: "El diagnóstico es obligatorio" })} placeholder="Diagnóstico principal" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.diagnosis && <small style={{ color: '#e35c5c' }}>{errors.diagnosis.message || "Campo obligatorio"}</small>}
                                </div>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Medicamento*</label>
                                <input {...register("medicament", { required: "El medicamento es obligatorio" })} placeholder="Nombre del medicamento" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.medicament && <small style={{ color: '#e35c5c' }}>{errors.medicament.message || "Campo obligatorio"}</small>}
                            </div>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Cantidad/Dosis*</label>
                                    <input {...register("quantity", { required: "La cantidad es obligatoria" })} placeholder="Ej: TAB 10mg/20mg #30" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    {errors.quantity && <small style={{ color: '#e35c5c' }}>{errors.quantity.message || "Campo obligatorio"}</small>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duración</label>
                                    <input {...register("duration")} placeholder="Ej: 7 días o Continuo" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Instrucciones de Uso*</label>
                                <textarea {...register("prescriptionDetail", { required: "Las instrucciones son obligatorias" })} placeholder="Tomar una tableta cada noche..." rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                {errors.prescriptionDetail && <small style={{ color: '#e35c5c' }}>{errors.prescriptionDetail.message || "Campo obligatorio"}</small>}
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsNewRecipeModalOpen(false)} style={{ background: '#ccc', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Generar Receta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Modal de éxito */}
            {isSuccessModalOpen && (
                <div className="modal-backdrop" onClick={closeSuccessModal} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h2 style={{ color: '#00b050', marginTop: 0 }}>¡Receta Creada con Éxito!</h2>
                        <p>La nueva receta ha sido guardada en el sistema.</p>
                        <button onClick={closeSuccessModal} style={{ background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Entendido</button>
                    </div>
                </div>
            )}
            
            {/* Modal de Confirmación de Borrado */}
            {isDeleteModalOpen && recipeToDelete && (
                <div className="modal-backdrop" onClick={() => setIsDeleteModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                        <h2 style={{ color: '#e35c5c', marginTop: 0 }}>Confirmar Eliminación</h2>
                        <p>¿Estás seguro de que deseas eliminar la receta de **{recipeToDelete.patientName}**?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} style={{ background: '#ccc', color: '#333', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                            <button type="button" onClick={confirmDeletion} style={{ background: '#e35c5c', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Impresión de Receta */}
            {isPrintRecipeModalOpen && recipeToPrint && (
                <div className="modal-backdrop" onClick={() => setIsPrintRecipeModalOpen(false)} style={{ zIndex: 1000 }}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%' }}>
                        <RecipePrintContent />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => window.print()} style={{ background: '#00b050', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Imprimir Receta</button>
                            <button onClick={() => setIsPrintRecipeModalOpen(false)} style={{ background: '#830cc4', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}