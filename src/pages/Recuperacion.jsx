// src/pages/Recuperacion.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import logo from '../assets/logo_drfachero.png';

// MockLogo
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

// Estilos
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

export default function Recuperacion({ setPagina }) {
    // Estado para Modal de Éxito
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Estado para Modal de Error/Validación
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    // Función si el formulario es VÁLIDO
    const onValid = async (data) => {
        // Simulación de envío
        await new Promise((r) => setTimeout(r, 1500)); 
        console.log(`Solicitud de recuperación para: ${data.email}`);
        
        reset();
        setShowSuccessModal(true);
    };

    // Función si el formulario es INVÁLIDO (Aquí capturamos los errores para el pop-up)
    const onInvalid = (errors) => {
        const msgs = [];
        if (errors.email) {
            msgs.push(errors.email.message);
        }
        setErrorMessages(msgs);
        setShowErrorModal(true);
    };
    
    return (
        <section style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #830cc4 0%, #830cc4 50%, #f3f4f6 50%, #f3f4f6 100%)',
            padding: '20px'
        }}>
            {/* Tarjeta Principal */}
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
                
                <h1 style={{ color: '#830cc4', margin: '0 0 10px', fontSize: '24px' }}>Recuperar Contraseña</h1>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>
                    Ingresa tu correo para recibir un enlace de restablecimiento.
                </p>
                
                {/* Pasamos onInvalid como segundo argumento a handleSubmit */}
                <form onSubmit={handleSubmit(onValid, onInvalid)} noValidate style={{ textAlign: 'left' }}>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Correo Electrónico</label>
                        <input
                            id="email"
                            type="text" 
                            autoComplete="email"
                            {...register("email", {
                                required: "El correo es obligatorio",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Correo inválido (ej: usuario@dominio.com)",
                                },
                            })}
                            style={{ 
                                ...inputStyle, 
                                borderColor: errors.email ? '#e35c5c' : '#ddd' 
                            }}
                            disabled={isSubmitting}
                            placeholder="tu@correo.com"
                            onFocus={(e) => e.target.style.borderColor = '#830cc4'}
                            onBlur={(e) => e.target.style.borderColor = errors.email ? '#e35c5c' : '#ddd'}
                        />
                        {/* Mantenemos el mensaje inline también por accesibilidad */}
                        {errors.email && (
                            <small style={{ color: '#e35c5c', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                {errors.email.message}
                            </small>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        style={{ ...buttonStyle, opacity: isSubmitting ? 0.7 : 1 }}
                    >
                        {isSubmitting ? "Enviando..." : "Enviar Enlace"}
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <button 
                        type="button"
                        onClick={() => setPagina("login")}
                        style={{ background: 'none', border: 'none', color: '#830cc4', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
                    >
                        Volver a Iniciar Sesión
                    </button>
                </div>
            </div>

            {/* --- POP-UP (MODAL) DE ÉXITO (VERDE) --- */}
            {showSuccessModal && (
                <div style={overlayStyle} onClick={() => setShowSuccessModal(false)}>
                    <div style={{ ...modalStyle, animation: 'scaleIn 0.2s ease-out' }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '50px', marginBottom: '10px' }}>📩</div>
                        <h3 style={{ color: '#00b050', margin: '0 0 15px', fontSize: '22px' }}>¡Correo Enviado!</h3>
                        <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.6', marginBottom: '25px' }}>
                            Hemos enviado las instrucciones a tu correo. <br/>
                            Por favor, revisa tu bandeja de entrada.
                        </p>
                        <button 
                            onClick={() => setPagina('login')} 
                            style={{ ...buttonStyle, marginTop: 0, background: '#00b050' }}
                        >
                            Ir al Login
                        </button>
                        <button onClick={() => setShowSuccessModal(false)} style={closeLinkStyle}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* --- POP-UP (MODAL) DE ERROR/VALIDACIÓN (ROJO) --- */}
            {showErrorModal && (
                <div style={overlayStyle} onClick={() => setShowErrorModal(false)}>
                    <div style={{ ...modalStyle, animation: 'shake 0.3s ease-in-out' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#e35c5c', margin: '0 0 15px', fontSize: '22px' }}>Verifique los datos</h3>
                        <ul style={{ textAlign: 'left', paddingLeft: '20px', color: '#555', marginBottom: '25px' }}>
                            {errorMessages.map((msg, idx) => (
                                <li key={idx} style={{ marginBottom: '5px' }}>{msg}</li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => setShowErrorModal(false)} 
                            style={{ ...buttonStyle, marginTop: 0, background: '#e35c5c' }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
            
            {/* Estilos de animación inline */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
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

// Estilos auxiliares para limpiar el JSX
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out'
};

const modalStyle = {
    background: '#fff', 
    padding: '30px', 
    borderRadius: '16px', 
    maxWidth: '380px', 
    width: '90%', 
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
};

const closeLinkStyle = {
    background: 'transparent', border: 'none', color: '#999', 
    marginTop: '15px', cursor: 'pointer', fontSize: '14px'
};