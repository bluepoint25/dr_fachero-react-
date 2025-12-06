// src/pages/Registro.jsx
import React, { useState } from 'react'; // Aseguramos import de React
import { useForm } from 'react-hook-form';
import logo from '../assets/logo_drfachero.png';

// --- CONFIGURACIÓN API ---
const API_BASE_URL = 'http://localhost:8080';
const API_REGISTER_ENDPOINT = `${API_BASE_URL}/api/auth/register`;

// Componentes Visuales (Idénticos al Login)
const MockLogo = ({ style }) => (
    <div style={{ 
        ...style, backgroundColor: '#f3e8ff', borderRadius: '50%', width: '80px', height: '80px', 
        margin: '0 auto 20px', display: 'grid', placeItems: 'center' 
    }}>
        <img src={logo} alt="Logo" style={{ height: '50px', width: 'auto' }} />
    </div>
);

// Estilos Unificados
const inputStyle = {
    width: '100%', padding: '12px 15px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '8px', 
    boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s', marginBottom: '15px'
};

const labelStyle = {
    display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px'
};

const buttonStyle = {
    width: '100%', padding: '14px', background: '#830cc4', color: '#fff', border: 'none', borderRadius: '8px', 
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px'
};

export default function Registro({ setPagina }) {
    // Estados para Modales
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationMessages, setValidationMessages] = useState([]);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    const [serverError, setServerError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    // --- 1. ENVIAR REGISTRO (Si el formulario es válido) ---
    const onValid = async (data) => {
        try {
            const payload = {
                username: data.email,
                password: data.password,
                role: data.role // ROLE_ADMIN o ROLE_USER
            };

            const response = await fetch(API_REGISTER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.message || `Error ${response.status}: No se pudo registrar.`);
            }

            // Éxito
            setShowSuccessModal(true);

        } catch (err) {
            setServerError(err.message);
            setShowErrorModal(true);
        }
    };

    // --- 2. MANEJO DE ERRORES DE VALIDACIÓN (Pop-up Rojo) ---
    const onInvalid = (errors) => {
        const msgs = [];
        if (errors.email) msgs.push(errors.email.message);
        if (errors.password) msgs.push(errors.password.message);
        if (errors.role) msgs.push(errors.role.message);
        
        setValidationMessages(msgs);
        setShowValidationModal(true);
    };

    return (
        <section style={{ 
            minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'linear-gradient(to bottom, #830cc4 0%, #830cc4 50%, #f3f4f6 50%, #f3f4f6 100%)', padding: '20px'
        }}>
            <div style={{
                background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '100%', maxWidth: '400px', textAlign: 'center'
            }}>
                <MockLogo />
                <h1 style={{ color: '#830cc4', margin: '0 0 10px', fontSize: '24px' }}>Crear Cuenta</h1>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Únete a Dr. Fachero.</p>

                <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate style={{ textAlign: 'left' }}>
                    
                    <div>
                        <label style={labelStyle}>Correo Electrónico</label>
                        <input 
                            type="email" 
                            {...register("email", { 
                                required: "El correo es obligatorio.",
                                pattern: { 
                                    // REGEX: Valida que termine en .cl o .com
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(cl|com)$/i, 
                                    message: "Debe ser un correo válido (.cl o .com)" 
                                }
                            })}
                            style={{ ...inputStyle, borderColor: errors.email ? '#e35c5c' : '#ddd' }}
                            placeholder="usuario@ejemplo.cl"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Contraseña</label>
                        <input 
                            type="password" 
                            {...register("password", { 
                                required: "La contraseña es obligatoria.", 
                                minLength: { value: 6, message: "Mínimo 6 caracteres." },
                                pattern: {
                                    // REGEX: Al menos 1 letra, 1 número, y SOLO caracteres alfanuméricos
                                    value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/,
                                    message: "Debe ser alfanumérica (letras y números)."
                                }
                            })}
                            style={{ ...inputStyle, borderColor: errors.password ? '#e35c5c' : '#ddd' }}
                            placeholder="******"
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Tipo de Cuenta</label>
                        <select {...register("role", { required: "Selecciona un tipo de cuenta." })} style={inputStyle}>
                            <option value="ROLE_USER">Profesional Estándar (Gratis)</option>
                            <option value="ROLE_ADMIN">Administrador PRO</option>
                        </select>
                    </div>

                    <button type="submit" disabled={isSubmitting} style={{ ...buttonStyle, opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>¿Ya tienes cuenta? </span>
                    <button onClick={() => setPagina("login")} style={{ background: 'none', border: 'none', color: '#830cc4', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
                        Inicia Sesión
                    </button>
                </div>
            </div>

            {/* --- MODALES --- */}
            
            {/* Pop-up de Validación (Rojo) - "Faltan Datos o Formato Incorrecto" */}
            {showValidationModal && (
                <div style={overlayStyle} onClick={() => setShowValidationModal(false)}>
                    <div style={{ ...modalStyle, animation: 'shake 0.3s ease-in-out' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 10px' }}>Datos Incorrectos</h3>
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', color: '#555', marginBottom: '20px' }}>
                            {validationMessages.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                        <button onClick={() => setShowValidationModal(false)} style={{ ...buttonStyle, background: '#e35c5c', marginTop: '0', padding: '10px' }}>Corregir</button>
                    </div>
                </div>
            )}

            {/* Pop-up de Error del Servidor (Rojo) */}
            {showErrorModal && (
                <div style={overlayStyle} onClick={() => setShowErrorModal(false)}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 10px' }}>Error del Sistema</h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>{serverError}</p>
                        <button onClick={() => setShowErrorModal(false)} style={{ ...buttonStyle, background: '#e35c5c', marginTop: '0', padding: '10px' }}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* Pop-up de Éxito (Verde) */}
            {showSuccessModal && (
                <div style={overlayStyle}>
                    <div style={{ ...modalStyle, textAlign: 'center' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎉</div>
                        <h3 style={{ color: '#00b050', margin: '0 0 10px' }}>¡Cuenta Creada!</h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>Tu registro ha sido exitoso. Ahora puedes iniciar sesión con tu nueva cuenta.</p>
                        <button onClick={() => setPagina('login')} style={{ ...buttonStyle, marginTop: 0, background: '#00b050' }}>
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                </div>
            )}

            <style>{` @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } } `}</style>
        </section>
    );
}

// Estilos Auxiliares
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' };