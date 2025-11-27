// src/pages/Login.jsx
import { useForm } from "react-hook-form"; 
import { useState, useEffect } from "react"; // Importar useEffect

export default function Login({onLogin, setPagina}) {
    const [error, setError ]= useState(null);
    const [modalErrorOpen, setModalErrorOpen] = useState(false); // Estado para el modal de error

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
        let plan =null;
        
        if (data.email ==="clinica_pro@pro.cl" && data.password === "drfachero123"){
            plan='pro';

        }else if (data.email === "clinica_estandar@estandar.cl" && data.password =="drfachero123"){
            plan= 'estandar';   
        }else {
            // Establecer el error y el modal se abrirá vía useEffect
            setError("Credenciales Invalidas"); 
        }
        if (plan){
            onLogin(plan, data.email);
        }
    
    };

    return(
        <section className="login-page">
            <div className="login-card">
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
                        required:"La COntraseña es Obligatoria",

                    })}
                    className={errors.password ? "input-error": ""}
                    disabled={isSubmitting}
                    />
                    {errors.password && (
                        <small className="input-hint">{errors.password.message}</small>
                    )}

                    </div>
                    {/* Eliminamos el mensaje de error de texto plano */}
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
                           {/* Usamos 'error' directamente que ya fue seteado en onValid */}
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