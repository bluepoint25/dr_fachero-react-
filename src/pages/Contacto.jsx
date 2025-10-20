import { useForm } from "react-hook-form";

export default function Contacto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800));
    reset();
  };

  return (
    <section className="contacto-page">
      <div className="contact-grid">
        {/* IZQUIERDA: texto + bullets */}
        <div className="contact-info">
          <h1>
            Moderniza tu clínica y <br /> gana eficiencia
          </h1>

          <p className="contact-lead">
            Descubre cómo digitalizar procesos en tu clínica o centro de salud
            para ahorrar tiempo y recursos valiosos, permitiéndote enfocarte en
            la atención al paciente.
          </p>

          <h3 className="contact-subtitle">Soluciones para múltiples áreas:</h3>

          <ul className="contact-bullets">
            <li>
              <span className="bullet-icon">📄</span>
              <div>Expediente electrónico</div>
            </li>
            <li>
              <span className="bullet-icon">📅</span>
              <div>Agenda pacientes</div>
            </li>
            <li>
              <span className="bullet-icon">💳</span>
              <div>Recaudación y cobranza</div>
            </li>
            <li>
              <span className="bullet-icon">📦</span>
              <div>Inventario y bodega</div>
            </li>
          </ul>
        </div>

        {/* DERECHA: tarjeta con formulario */}
        <form className="contact-form-card" onSubmit={handleSubmit(onSubmit)}>
          <h2>Obtén más información</h2>

          <div className="form-row">
            <div className="field">
              <label>Nombre*</label>
              <input
                {...register("nombre", { required: "Obligatorio" })}
                className={errors.nombre ? "input-error" : ""}
              />
              {errors.nombre && (
                <small className="input-hint">{errors.nombre.message}</small>
              )}
            </div>

            <div className="field">
              <label>Apellido*</label>
              <input
                {...register("apellido", { required: "Obligatorio" })}
                className={errors.apellido ? "input-error" : ""}
              />
              {errors.apellido && (
                <small className="input-hint">{errors.apellido.message}</small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Nombre de clínica*</label>
              <input
                {...register("clinica", { required: "Obligatorio" })}
                className={errors.clinica ? "input-error" : ""}
              />
              {errors.clinica && (
                <small className="input-hint">{errors.clinica.message}</small>
              )}
            </div>

            <div className="field">
              <label>Nº de profesionales*</label>
              <input
                {...register("profesionales", {
                  required: "Obligatorio",
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                })}
                className={errors.profesionales ? "input-error" : ""}
              />
              {errors.profesionales && (
                <small className="input-hint">
                  {errors.profesionales.message}
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Correo laboral*</label>
              <input
                {...register("email", {
                  required: "Obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo inválido",
                  },
                })}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && (
                <small className="input-hint">{errors.email.message}</small>
              )}
            </div>

            <div className="field">
              <label>Número de teléfono*</label>

              <div className="phone-group">
                <select defaultValue="CL" {...register("pais")}>
                  <option value="CL">Chile (+56)</option>
                  <option value="AR">Argentina (+54)</option>
                  <option value="PE">Perú (+51)</option>
                </select>

                <input
                  {...register("telefono", {
                    required: "El número de teléfono es obligatorio.",
                    pattern: { value: /^[0-9]{8,15}$/, message: "Formato inválido" },
                  })}
                  className={errors.telefono ? "input-error" : ""}
                  placeholder="Ej: 912345678"
                />
              </div>

              {errors.telefono && (
                <small className="input-hint">{errors.telefono.message}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label>¿Tienes preguntas?</label>
            <textarea rows={4} {...register("mensaje")} />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>

          {isSubmitSuccessful && (
            <p className="form-ok">¡Gracias! Te contactaremos pronto.</p>
          )}
        </form>
      </div>
    </section>
  );
}
