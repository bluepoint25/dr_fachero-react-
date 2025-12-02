// src/pages/Login.jsx
import { useForm } from "react-hook-form"; 
import { useState, useEffect } from "react"; 
import logo from '../assets/logo_drfachero.png';

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'http://localhost:8080';
const API_LOGIN_ENDPOINT = `${API_BASE_URL}/api/auth/login`;

// Usaremos un Mock de Logo para la consistencia visual sin importar una imagen aquí.
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
        <img src={logo} alt="Dr. Fachero Logo" style={{ height: '80px', marginBottom: '10px' }} />
    </div>
);

export default function Login({onLogin, setPagina}) {
    const [error, setError ]= useState(null);
    const [modalErrorOpen, setModalErrorOpen] = useState(false); 
    // Usaremos 'email' en el formulario para más familiaridad, pero lo mapeamos a 'username' para la API
    
    const{
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    }=useForm();

    // Abrir modal cuando se detecta un error de credenciales
    useEffect(() => {
        if (error) {
            setModalErrorOpen(true);
        }
    }, [error]);

    const onValid = async (data) => {
        setError(null);
        setModalErrorOpen(false);

        // Mapea 'email' del formulario a 'username' para el payload de la API
        const payload = {
            username: data.email, 
            password: data.password,
        };

        try {
            const response = await fetch(API_LOGIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Intenta leer el mensaje de error del cuerpo de la respuesta
                let errorMessage = "Credenciales inválidas. Intente de nuevo.";
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.message || errorBody.error || "Error de autenticación desconocido.";
                } catch {
                    // Si falla la lectura JSON, usa el status text
                    errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            // Autenticación exitosa
            const authResponse = await response.json();
            
            // Decidir el plan basado en el rol (su API devuelve "ROLE_ADMIN")
            let userPlan = 'estandar'; 
            if (authResponse.role === 'ROLE_ADMIN') {
                userPlan = 'pro'; 
            }
            
            // Guardar el JWT para peticiones futuras (Ej: en localStorage o contexto)
            localStorage.setItem("authToken", authResponse.jwt);
            
            // Llama a handleLogin(name, plan) en App.jsx
            // Usamos el username para el nombre de usuario mostrado en el dashboard
            onLogin(authResponse.username, userPlan); 

        } catch (err) {
            // Mostrar el error en el modal
            console.error("Error durante el login:", err);
            setError(`Error de Acceso: ${err.message}`); 
        }
    };

    return(
        // CAMBIO: Estilo de fondo degradado aplicado al contenedor completo
        <section 
            className="login-page" 
            style={{ 
                background: 'linear-gradient(to bottom, #830cc4 0%, #830cc4 50%, #fff 50%, #fff 100%)', 
                minHeight: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '72px 0 104px', // Mantiene el padding de App.css
                marginLeft: '-50vw', // Para hacerlo full-bleed
                marginRight: '-50vw',
                width: '100vw', 
                position: 'relative', 
                left: '50%', 
                right: '50%',
            }}
        >
            <div className="login-card">
                <MockLogo />
                <h1>Iniciar Sesion</h1>
                <p>Accede a tu panel de gestion de Dr. Fachero .</p>
                <form onSubmit={handleSubmit(onValid)}>
                    {/*Campo Email/Username*/}
                    <div className="field">
                        <label htmlFor="email">Usuario (Email o Nombre)</label>
                        < input
                        id="email"
                        // El backend espera el username, que en su setup inicial es "admin"
                        type="text" 
                        autoComplete="username" 
                        aria-invalid={!!errors.email} 
                        {...register("email", {
                            required:"El usuario es Obligatorio",
                            // Eliminamos la validación de formato de email para permitir el usuario "admin"
                        })}
                        className={errors.email ? "input-error" : ""}
                        disabled={isSubmitting}
                        />
                        {errors.email && (
                            <small className="input-hint">{errors.email.message}</small>
                        )}

                    </div>
                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                    {...register("password",{
                        required:"La Contraseña es Obligatoria",

                    })}
                    className={errors.password ? "input-error": ""}
                    disabled={isSubmitting}
                    />
                    {errors.password && (
                        <small className="input-hint">{errors.password.message}</small>
                    )}

                    </div>
                    
                    <button type="submit" disabled={isSubmitting} >
                        {isSubmitting ? "Accediendo..." : "Ingresar"}
                    </button>
                </form>
                <p className="forgot-password">
                    <button 
                    type="button"
                    onClick={()=> setPagina("recuperacion")}
                    >
                    ¿Olvidaste tu Contraseña?
                    </button>
                </p>
            </div>
            
            {/* MODAL DE CREDENCIALES INVÁLIDAS */}
            {modalErrorOpen && (
                <div
                    className="modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="error-modal-title"
                    onClick={() => setModalErrorOpen(false)}
                >
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="document"
                    >
                        <h3 id="error-modal-title" style={{color: '#e35c5c'}}>Error de Acceso</h3>
                        <p className="modal-subtitle">
                           {error}
                        </p>
                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() => setModalErrorOpen(false)}
                                className="btn btn--primary"
                                style={{background: '#e35c5c'}}
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}