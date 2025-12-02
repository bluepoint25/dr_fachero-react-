// src/pages/Login.jsx
import { useForm } from "react-hook-form"; 
import { useState, useEffect } from "react"; 
import logo from '../assets/logo_drfachero.png';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'http://localhost:8080';
const API_LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;

// Componentes y Estilos Reutilizables (Inline para asegurar consistencia)
const MockLogo = ({ style }) => (
    <div style={{ 
        ...style, 
        backgroundColor: '#f3e8ff', 
        borderRadius: '50%', 
        width: '80px', 
        height: '80px', 
        margin: '0 auto 20px', 
        display: 'grid', 
        placeItems: 'center',
    }}>
        <img src={logo} alt="Dr. Fachero Logo" style={{ height: '50px', width: 'auto' }} />
    </div>
);

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: '#830cc4',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px'
};

export default function Login({onLogin, setPagina}) {
    // Estado para errores del Servidor (401, 500, etc.)
    const [serverError, setServerError] = useState(null);
    const [showServerModal, setShowServerModal] = useState(false); 

    // Estado para errores de Validación (Campos vacíos, formato email)
    const [validationMessages, setValidationMessages] = useState([]);
    const [showValidationModal, setShowValidationModal] = useState(false);
    
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm();

    useEffect(() => {
        if (serverError) setShowServerModal(true);
    }, [serverError]);

    // --- 1. SI EL FORMULARIO ES VÁLIDO (Se envía al servidor) ---
    const onValid = async (data) => {
        setServerError(null);
        setValidationMessages([]);
        setShowValidationModal(false);
        setShowServerModal(false);

        const payload = { username: data.email, password: data.password };

        try {
            const response = await fetch(API_LOGIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = "Credenciales inválidas.";
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message || errorMessage;
                } catch {}
                throw new Error(errorMessage);
            }
            
            const authResponse = await response.json();
            let userPlan = authResponse.role === 'ROLE_ADMIN' ? 'pro' : 'estandar';
            
            localStorage.setItem("authToken", authResponse.jwt);
            onLogin(authResponse.username, userPlan); 

        } catch (err) {
            console.error("Login error:", err);
            setServerError(err.message); 
        }
    };

    // --- 2. SI EL FORMULARIO ES INVÁLIDO (Se activa el Pop-up de Validación) ---
    const onInvalid = (errors) => {
        const msgs = [];
        if (errors.email) msgs.push(errors.email.message);
        if (errors.password) msgs.push(errors.password.message);
        
        setValidationMessages(msgs);
        setShowValidationModal(true);
    };

    return(
        <section style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #830cc4 0%, #830cc4 50%, #f3f4f6 50%, #f3f4f6 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <MockLogo />
                <h1 style={{ color: '#830cc4', margin: '0 0 10px', fontSize: '24px' }}>Iniciar Sesión</h1>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Accede a tu panel de gestión.</p>
                
                {/* Formulario con noValidate y manejo de onInvalid */}
                <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate style={{ textAlign: 'left' }}>
                    
                    {/* CAMPO USUARIO */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Usuario (Email o Nombre)</label>
                        <input
                            id="email"
                            type="text" 
                            autoComplete="username" 
                            {...register("email", { required: "El usuario es obligatorio" })}
                            style={{ 
                                ...inputStyle, 
                                borderColor: errors.email ? '#e35c5c' : '#ddd' 
                            }}
                            disabled={isSubmitting}
                            onFocus={(e) => e.target.style.borderColor = '#830cc4'}
                            onBlur={(e) => e.target.style.borderColor = errors.email ? '#e35c5c' : '#ddd'}
                        />
                    </div>

                    {/* CAMPO CONTRASEÑA */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Contraseña</label>
                        <input 
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            {...register("password", { required: "La contraseña es obligatoria" })}
                            style={{ 
                                ...inputStyle, 
                                borderColor: errors.password ? '#e35c5c' : '#ddd' 
                            }}
                            disabled={isSubmitting}
                            onFocus={(e) => e.target.style.borderColor = '#830cc4'}
                            onBlur={(e) => e.target.style.borderColor = errors.password ? '#e35c5c' : '#ddd'}
                        />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} style={{ ...buttonStyle, opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? "Accediendo..." : "Ingresar"}
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <button 
                        type="button"
                        onClick={()=> setPagina("recuperacion")}
                        style={{ background: 'none', border: 'none', color: '#830cc4', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
                    >
                        ¿Olvidaste tu Contraseña?
                    </button>
                </div>
            </div>
            
            {/* --- MODAL 1: ERROR DE SERVIDOR (Credenciales incorrectas) --- */}
            {showServerModal && (
                <div style={overlayStyle} onClick={() => setShowServerModal(false)}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 10px' }}>Error de Acceso</h3>
                        <p style={{ color: '#555', marginBottom: '20px' }}>{serverError}</p>
                        <button onClick={() => setShowServerModal(false)} style={{ ...buttonStyle, marginTop: 0, background: '#e35c5c', padding: '10px' }}>
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: ERROR DE VALIDACIÓN (Campos vacíos) --- */}
            {showValidationModal && (
                <div style={overlayStyle} onClick={() => setShowValidationModal(false)}>
                    <div style={{ ...modalStyle, animation: 'shake 0.3s ease-in-out' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 15px' }}>Faltan Datos</h3>
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', color: '#555', marginBottom: '20px' }}>
                            {validationMessages.map((msg, idx) => (
                                <li key={idx} style={{ marginBottom: '5px' }}>{msg}</li>
                            ))}
                        </ul>
                        <button onClick={() => setShowValidationModal(false)} style={{ ...buttonStyle, marginTop: 0, background: '#e35c5c', padding: '10px' }}>
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Animación Shake */}
            <style>{`
                @keyframes shake {
                    0% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    50% { transform: translateX(5px); }
                    75% { transform: translateX(-5px); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </section>
    );
}

// Estilos Auxiliares para Modales
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    zIndex: 1000
};

const modalStyle = {
    background: '#fff', 
    padding: '25px', 
    borderRadius: '12px', 
    maxWidth: '350px', 
    width: '90%', 
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
};