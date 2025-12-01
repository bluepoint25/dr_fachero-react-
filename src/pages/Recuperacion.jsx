// src/pages/Recuperacion.jsx
import { useForm } from "react-hook-form";
import { useState } from "react";

// Componente Mock Logo/Icon para mantener la consistencia visual
const MockLogo = ({ style }) => (
    <div style={{ 
        ...style, 
        backgroundColor: '#f3e8ff', 
        borderRadius: '50%', 
        width: '60px', 
        height: '60px', 
        margin: '0 auto 15px', 
        display: 'grid', 
        placeItems: 'center',
        fontSize: '30px',
        color: '#830cc4'
    }}>
        🔑
    </div>
);

export default function Recuperacion({ setPagina }) {
    const [isRecoverySent, setIsRecoverySent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onValid = async (data) => {
        // Simulación de envío de correo (espera 1.5s)
        await new Promise((r) => setTimeout(r, 1500)); 
        
        // Aquí iría la lógica de API para enviar el enlace de recuperación.
        console.log(`Solicitud de recuperación para: ${data.email}`);
        
        setIsRecoverySent(true);
    };

    // Estilo de fondo degradado morado y blanco, cubriendo toda la pantalla
    const fullBleedStyle = {
        background: 'linear-gradient(to bottom, #830cc4 0%, #830cc4 50%, #fff 50%, #fff 100%)', 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '72px 0 104px', 
        // Usado para asegurar que ocupe todo el ancho, ignorando el contenedor de App.jsx
        marginLeft: '-50vw', 
        marginRight: '-50vw',
        width: '100vw', 
        position: 'relative', 
        left: '50%', 
        right: '50%',
        boxSizing: 'border-box'
    };

    const cardStyle = {
        maxWidth: '400px', 
        width: '100%', 
        padding: '40px', 
        background: '#fff', 
        borderRadius: '12px', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
    };

    // Estilos reutilizables para los botones
    const buttonStyle = {
        width: '100%', 
        padding: '12px', 
        background: '#830cc4', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontWeight: 'bold',
        transition: 'background 0.3s', 
        marginTop: '20px'
    };
    
    return (
        <section style={fullBleedStyle}>
            <div style={cardStyle}>
                
                <MockLogo />
                
                {isRecoverySent ? (
                    // PANTALLA DE ÉXITO
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ color: '#830cc4', margin: '10px 0 0' }}>¡Correo Enviado!</h1>
                        <p>Hemos enviado instrucciones para restablecer tu contraseña a tu dirección de correo electrónico. Por favor, revisa tu bandeja de entrada (y la carpeta de spam).</p>
                        <button 
                            type="button"
                            onClick={() => setPagina('login')}
                            style={buttonStyle}
                        >
                            Volver al Login
                        </button>
                    </div>

                ) : (
                    // FORMULARIO DE RECUPERACIÓN
                    <>
                        <h1 style={{ color: '#830cc4', margin: '10px 0 0', textAlign: 'center' }}>Recuperar Contraseña</h1>
                        <p style={{ textAlign: 'center' }}>Ingresa tu correo electrónico para recibir un enlace de restablecimiento.</p>
                        
                        <form onSubmit={handleSubmit(onValid)}>
                            {/* Campo Email */}
                            <div className="field" style={{ marginBottom: '20px' }}>
                                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555' }}>Correo Electrónico</label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    aria-invalid={!!errors.email} 
                                    {...register("email", {
                                        required: "El correo es Obligatorio",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Correo inválido",
                                        },
                                    })}
                                    className={errors.email ? "input-error" : ""}
                                    disabled={isSubmitting}
                                    placeholder="tu@correo.com"
                                    style={{ 
                                        width: '100%', padding: '12px', border: `1px solid ${errors.email ? '#e35c5c' : '#ddd'}`, 
                                        borderRadius: '6px', boxSizing: 'border-box' 
                                    }}
                                />
                                {errors.email && (
                                    <small className="input-hint" style={{ color: '#e35c5c', display: 'block', marginTop: '5px' }}>{errors.email.message}</small>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                style={buttonStyle}
                            >
                                {isSubmitting ? "Enviando..." : "Enviar Enlace de Recuperación"}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                            <button 
                                type="button"
                                onClick={() => setPagina("login")}
                                style={{ 
                                    background: 'none', border: 'none', color: '#830cc4', textDecoration: 'none', 
                                    cursor: 'pointer', padding: 0, fontSize: 'inherit' 
                                }}
                            >
                                Volver a Iniciar Sesión
                            </button>
                        </p>
                    </>
                )}
            </div>
        </section>
    );
}