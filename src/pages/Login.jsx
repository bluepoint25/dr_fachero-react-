// src/pages/Login.jsx
import { useForm } from "react-hook-form"; 
import { useState, useEffect } from "react"; 
import logo from '../assets/logo_drfachero.png';
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

        await new Promise((r)=>setTimeout(r,800));
        let plan = null;
        let name = '';

        // --- AUTH LOGIC (Usando credenciales de prueba) ---
        if (data.email === "clinica_pro@pro.cl" && data.password === "drfachero123") {
            plan = 'pro';
            name = 'Dr. Pro Fachero'; 
        } else if (data.email === "clinica_estandar@estandar.cl" && data.password === "drfachero123") {
            plan = 'estandar';
            name = 'Dr. Estándar Fachero';   
        } else {
            setError("Credenciales Inválidas. Prueba con pro@drfachero.com o estandar@drfachero.com (Contraseña: 123)"); 
        }
        // --- END AUTH LOGIC ---

        if (plan){
            // Llama a handleLogin(name, plan) en App.jsx
            onLogin(name, plan); 
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
                    {/*Campo Email*/}
                    <div className="field">
                        <label htmlFor="email">Correo</label>
                        < input
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email} 
                        {...register("email", {
                            required:"El correo es Obligatorio",
                            pattern:{
                                value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message:"Correo invalido",
                            },
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