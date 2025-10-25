import { useForm } from "react-hook-form";
import { useState, useMemo } from "react";

export default function Contacto() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLines, setModalLines] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

  const onValid = async () => {
    // Simula espera (tu comportamiento actual)
    await new Promise((r) => setTimeout(r, 800));
    reset();
  };

  const onInvalid = (errs) => {
    // Orden amistoso para mostrar mensajes
    const order = [
      "nombre",
      "apellido",
      "clinica",
      "profesionales",
      "email",
      "telefono",
      "mensaje",
    ];
    const labels = {
      nombre: "Nombre",
      apellido: "Apellido",
      clinica: "Nombre de clínica",
      profesionales: "Nº de profesionales",
      email: "Correo laboral",
      telefono: "Número de teléfono",
      mensaje: "Mensaje",
    };

    const lines = order
      .filter((k) => errs[k])
      .map((k) => `• ${labels[k]}: ${errs[k]?.message ?? "Dato inválido"}`);

    // Por si aparece algún error no listado en 'order'
    Object.keys(errs).forEach((k) => {
      if (!order.includes(k)) {
        lines.push(`• ${k}: ${errs[k]?.message ?? "Dato inválido"}`);
      }
    });

    setModalLines(lines.length ? lines : ["• Verifica los datos ingresados."]);
    setModalOpen(true);
  };

  const modalTitle = useMemo(() => {
    const count = modalLines.length;
    return count > 1 ? "Verifique los datos:" : "Verifique el dato:";
  }, [modalLines]);

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
        <form
          className="contact-form-card"
          onSubmit={handleSubmit(onValid, onInvalid)}
        >
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
                {...register("nombre", { required: "El Nombre es Obligatorio" })}
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
                {...register("apellido", {
                  required: "El Apellido es Obligatorio",
                })}
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
                {...register("clinica", {
                  required: "Nombre de clínica Obligatorio",
                })}
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
                  required: "Numeros Obligatorios",
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
                  required: "El Email es Obligatorio",
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
                <label htmlFor="pais" className="sr-only">
                  País
                </label>
                <select
                  id="pais"
                  defaultValue="CL"
                  {...register("pais")}
                  disabled={isSubmitting}
                >
                  <option value="CL">+56</option>
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
                    pattern: {
                      value: /^[0-9]{8,15}$/,
                      message: "Formato inválido",
                    },
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

      {/* MODAL DE ERRORES */}
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
            <h3 id="modal-title">Verifique los datos</h3>
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
