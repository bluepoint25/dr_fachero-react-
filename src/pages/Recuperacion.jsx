// src/pages/Recuperacion.jsx
import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";

// Componente simulado para la recuperación de contraseña
export default function Recuperacion({ setPagina }) {
  const [success, setSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // --- Estados del Modal de Validación ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLines, setModalLines] = useState([]);


  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm();

  const nuevaContrasena = watch("nuevaContrasena");

  const onValid = async (data) => {
    setIsSimulating(true);
    // Simulación de proceso de actualización de contraseña
    await new Promise((r) => setTimeout(r, 1500));
    setIsSimulating(false);
    setSuccess(true);
  };

  // --- LÓGICA DE MANEJO DE ERRORES DE VALIDACIÓN ---
  const onInvalid = (errs) => {
    const order = [
        "nuevaContrasena",
        "confirmarContrasena",
    ];
    const labels = {
        nuevaContrasena: "Nueva Contraseña",
        confirmarContrasena: "Confirmación",
    };

    const lines = order
      .filter((k) => errs[k])
      .map((k) => `• ${labels[k]}: ${errs[k]?.message ?? "Dato inválido"}`);
      
    setModalLines(lines.length ? lines : ["• Verifica los datos ingresados."]);
    setModalOpen(true);
  };
  
  const modalTitle = useMemo(() => {
    const count = modalLines.length;
    return count > 1 ? "Verifique los datos:" : "Verifique el dato:";
  }, [modalLines]);

  return (
    <section className="login-page" style={{paddingTop: '100px'}}>
      <div className="login-card">
        <h1>Nueva Contraseña</h1>
        <p>Establece tu nueva clave de acceso de forma segura.</p>

        {success ? (
          <div style={{ padding: '20px', backgroundColor: '#f0f9eb', border: '1px solid #c8e6c9', borderRadius: '12px' }}>
            <h3 style={{ color: '#00b050', marginBottom: '10px' }}>¡Contraseña Actualizada!</h3>
            <p>Tu contraseña ha sido restablecida exitosamente. Ahora puedes ingresar con tu nueva clave.</p>
            <button 
              type="button" 
              className="btn-cta btn-cta--primary"
              onClick={() => setPagina("login")} 
              style={{ marginTop: '20px', background: 'var(--color-primary-strong)' }}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          // MODIFICADO: Agregamos onInvalid a handleSubmit
          <form onSubmit={handleSubmit(onValid, onInvalid)}>
            {/* Campo Nueva Contraseña */}
            <div className="field">
              <label htmlFor="nuevaContrasena">Nueva Contraseña*</label>
              <input
                id="nuevaContrasena"
                type="password"
                aria-required="true"
                {...register("nuevaContrasena", {
                  required: "La contraseña es obligatoria.",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres.",
                  },
                })}
                // Eliminamos la clase input-error y el hint inline
                className={errors.nuevaContrasena ? "input-error" : ""} 
                disabled={isSimulating}
              />
              {/* Ocultamos el error inline para usar solo el modal */}
            </div>

            {/* Campo Confirmar Contraseña */}
            <div className="field">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña*</label>
              <input
                id="confirmarContrasena"
                type="password"
                aria-required="true"
                {...register("confirmarContrasena", {
                  required: "Confirma la contraseña.",
                  validate: (value) =>
                    value === nuevaContrasena || "Las contraseñas no coinciden.",
                })}
                // Eliminamos la clase input-error y el hint inline
                className={errors.confirmarContrasena ? "input-error" : ""} 
                disabled={isSimulating}
              />
              {/* Ocultamos el error inline para usar solo el modal */}
            </div>

            <button type="submit" disabled={isSimulating}>
              {isSimulating ? "Actualizando..." : "Establecer Nueva Contraseña"}
            </button>
          </form>
        )}
      </div>

      {/* --- MODAL DE ERRORES DE VALIDACIÓN --- */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <h3 id="modal-title">¡Error de Validación!</h3>
            <p className="modal-subtitle">{modalTitle}</p>
            <ul className="modal-list">
              {modalLines.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn--primary"
                style={{ background: '#e35c5c' }} // Rojo para errores
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}