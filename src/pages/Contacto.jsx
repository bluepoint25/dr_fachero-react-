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
              <label htmlFor="nombre">Nombre*</label>
              <input
                id="nombre"
                type="text"
                autoComplete="given-name"
                aria-required="true"
                aria-invalid={!!errors.nombre}
                {...register("nombre", { required: "Obligatorio" })}
                className={errors.nombre ? "input-error" : ""}
                disabled={isSubmitting}
              />
              {errors.nombre && (
                <small className="input-hint">{errors.nombre.message}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="apellido">Apellido*</label>
              <input
                id="apellido"
                type="text"
                autoComplete="family-name"
                aria-required="true"
                aria-invalid={!!errors.apellido}
                {...register("apellido", { required: "Obligatorio" })}
                className={errors.apellido ? "input-error" : ""}
                disabled={isSubmitting}
              />
              {errors.apellido && (
                <small className="input-hint">{errors.apellido.message}</small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="clinica">Nombre de clínica*</label>
              <input
                id="clinica"
                type="text"
                autoComplete="organization"
                aria-required="true"
                aria-invalid={!!errors.clinica}
                {...register("clinica", { required: "Obligatorio" })}
                className={errors.clinica ? "input-error" : ""}
                disabled={isSubmitting}
              />
              {errors.clinica && (
                <small className="input-hint">{errors.clinica.message}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="profesionales">Nº de profesionales*</label>
              <input
                id="profesionales"
                type="number"
                inputMode="numeric"
                aria-required="true"
                aria-invalid={!!errors.profesionales}
                {...register("profesionales", {
                  required: "Obligatorio",
                  pattern: { value: /^[0-9]+$/, message: "Solo números" },
                })}
                className={errors.profesionales ? "input-error" : ""}
                disabled={isSubmitting}
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
              <label htmlFor="email">Correo laboral*</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo inválido",
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
              <label htmlFor="telefono">Número de teléfono*</label>

              <div className="phone-group">
                {/* Etiqueta accesible para el selector de país */}
                <label htmlFor="pais" className="sr-only">País</label>
                <select id="pais" defaultValue="CL" {...register("pais")} disabled={isSubmitting}>
                  <option value="CL">Chile (+56)</option>
                  <option value="AR">Argentina (+54)</option>
                  <option value="PE">Perú (+51)</option>
                </select>

                <input
                  id="telefono"
                  type="tel"
                  inputMode="tel"
                  placeholder="Ej: 912345678"
                  autoComplete="tel-national"
                  aria-required="true"
                  aria-invalid={!!errors.telefono}
                  {...register("telefono", {
                    required: "El número de teléfono es obligatorio.",
                    pattern: { value: /^[0-9]{8,15}$/, message: "Formato inválido" },
                  })}
                  className={errors.telefono ? "input-error" : ""}
                  disabled={isSubmitting}
                />
              </div>

              {errors.telefono && (
                <small className="input-hint">{errors.telefono.message}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="mensaje">¿Tienes preguntas?</label>
            <textarea
              id="mensaje"
              rows={4}
              {...register("mensaje")}
              disabled={isSubmitting}
            />
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
