import { useForm } from "react-hook-form"; 
import { useState } from "react";

export default function Login({onLogin}) {
    const [error,setError ]= useState(null);

    const{
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    }=useForm();

    const onValid = async (data) => {
        setError(null);

        await new Promise((r)=>setTimeout(r,800));
        let plan =null;
        
        if (data.email ==="clinica_pro@pro.cl" && data.password === "drfachero123"){
            plan='pro';

        }else if (data.email === "clinica_estandar@estandar.cl" && data.password =="drfachero123"){
            plan= 'estandar';   
        }else {
            setError("Credenciales Invalidas");
        }
        if (plan){
            onLogin(plan);
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
                        className={errors.email ? "input-errors" : ""}
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
                    {error && <p className="form-error">{error}</p>}
                    <button type="submit" disabled={isSubmitting} >
                        {isSubmitting ? "Accediendo..." : "Ingresar"}


                    </button>
                </form>
                <p className="forgot-password">
                    <button 
                    type="button"
                    onClick={()=> alert("Funcion no Implementada")}
                    >
                    ¿Olvidaste tu Contraseña?
                    </button>

                </p>
            </div>
        </section>
    );
}