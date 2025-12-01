// src/components/UserManagement.jsx
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';

// Mock de usuarios iniciales
const initialUsers = [
  { id: 1, name: 'Dr. John Doe', email: 'john.doe@pro.cl', role: 'Médico', plan: 'Pro' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@pro.cl', role: 'Secretaria', plan: 'Pro' },
  { id: 3, name: 'Dr. Alex White', email: 'alex.white@pro.cl', role: 'Médico', plan: 'Pro' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 
  
  // ESTADOS DE VALIDACIÓN
  const [modalErrorOpen, setModalErrorOpen] = useState(false);
  const [modalLines, setModalLines] = useState([]);
  
  // NUEVOS ESTADOS DE ELIMINACIÓN
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [userToDelete, setUserToDelete] = useState(null); 
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Abrir modal (con o sin datos de usuario)
  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setModalErrorOpen(false); 
    setModalLines([]);

    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('role', user.role);
    } else {
      reset();
    }
  };

  // Manejar el envío del formulario (Agregar/Modificar) - Datos Válidos
  const onSubmit = (data) => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...data } : u
      ));
    } else {
      const newUser = {
        id: Date.now(),
        ...data,
        plan: 'Pro' 
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
    reset();
  };
  
  // Manejar la lógica de validación (Datos Inválidos)
  const onInvalid = (errs) => {
    const order = ["name", "email", "role"];
    const labels = {
      name: "Nombre Completo",
      email: "Correo",
      role: "Rol",
    };

    const lines = order
      .filter((k) => errs[k])
      .map((k) => `• ${labels[k]}: ${errs[k]?.message ?? "Dato inválido"}`);
      
    setModalLines(lines.length ? lines : ["• Verifica los datos ingresados."]);
    setModalErrorOpen(true);
  };
  
  const modalTitle = useMemo(() => {
      const count = modalLines.length;
      return count > 1 ? "Verifique los datos:" : "Verifique el dato:";
  }, [modalLines]);
  
  // FUNCIÓN MODIFICADA: Abre el modal de confirmación de eliminación
  const deleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  // NUEVA FUNCIÓN: Ejecuta la eliminación después de la confirmación
  const confirmDeletion = () => {
    if (userToDelete) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
        setIsDeleteModalOpen(false);
    }
  };

  return (
    <div style={{ marginTop: '40px', textAlign: 'left', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
      <h3 style={{ color: '#4a0376', margin: '0 0 20px', fontSize: '1.4rem' }}>Gestión de Usuarios</h3>
      
      <button 
        onClick={() => openModal(null)} 
        style={{ 
          background: '#830cc4', color: '#fff', padding: '10px 15px', border: 'none', 
          borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' 
        }}
      >
        + Agregar Nuevo Usuario
      </button>

      {/* Tabla de Usuarios */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '10px 5px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '10px 5px', textAlign: 'left' }}>Correo</th>
            <th style={{ padding: '10px 5px', textAlign: 'left' }}>Rol</th>
            <th style={{ padding: '10px 5px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
              <td style={{ padding: '10px 5px' }}>{user.name}</td>
              <td style={{ padding: '10px 5px', color: '#555' }}>{user.email}</td>
              <td style={{ padding: '10px 5px' }}>{user.role}</td>
              <td style={{ padding: '10px 5px', textAlign: 'center' }}>
                <button 
                  onClick={() => openModal(user)} 
                  style={{ background: '#00b050', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                >
                  Modificar
                </button>
                <button 
                  onClick={() => deleteUser(user)} // CAMBIO: Llama a la nueva función
                  style={{ background: '#e35c5c', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para Agregar/Modificar Usuario */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}> 
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(450px, 90vw)' }}>
            <h3 id="user-modal-title" style={{ color: '#4a0376' }}>{editingUser ? 'Modificar Usuario' : 'Agregar Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="field">
                <label htmlFor="name">Nombre Completo</label>
                <input 
                  id="name"
                  type="text"
                  {...register('name', { required: 'El nombre es obligatorio' })}
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <small className="input-hint">{errors.name.message}</small>}
              </div>

              <div className="field">
                <label htmlFor="email">Correo</label>
                <input 
                  id="email"
                  type="text" // Tipo 'text' para evitar la validación nativa de HTML5
                  {...register('email', { 
                    required: 'El correo es obligatorio',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Correo inválido (debe contener '@' y formato correcto)",
                    },
                  })}
                  className={errors.email ? 'input-error' : ''}
                />
                 {errors.email && <small className="input-hint">{errors.email.message}</small>}
              </div>

              <div className="field">
                <label htmlFor="role">Rol</label>
                <select 
                  id="role"
                  {...register('role', { required: 'El rol es obligatorio' })}
                  className={errors.role ? 'input-error' : ''}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="Médico">Médico</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Administrador">Administrador</option>
                </select>
                {errors.role && <small className="input-hint">{errors.role.message}</small>}
              </div>

              <button 
                type="submit" 
                className="btn btn--primary" 
                style={{ background: '#830cc4', marginTop: '15px' }}
              >
                {editingUser ? 'Guardar Cambios' : 'Agregar Usuario'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE ERRORES DE VALIDACIÓN (Pop-up) --- */}
      {modalErrorOpen && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="validation-modal-title"
            onClick={() => setModalErrorOpen(false)}
          >
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()}
              role="document"
            >
              <h3 id="validation-modal-title" style={{color: '#e35c5c'}}>¡Errores de Validación!</h3>
              <p className="modal-subtitle">{modalTitle}</p>
              <ul className="modal-list">
                {modalLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setModalErrorOpen(false)}
                  className="btn btn--primary"
                  style={{ background: '#e35c5c' }} 
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
        
      {/* --- NUEVO MODAL: CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {isDeleteModalOpen && userToDelete && (
          <div
              className="modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-modal-title"
              onClick={() => setIsDeleteModalOpen(false)}
          >
              <div
                  className="modal-card"
                  onClick={(e) => e.stopPropagation()}
                  role="document"
                  style={{ maxWidth: '400px' }}
              >
                  <h3 id="delete-modal-title" style={{ color: '#e35c5c', margin: '0 0 10px' }}>
                      Confirmar Eliminación
                  </h3>
                  <p style={{ color: '#555', marginBottom: '20px' }}>
                      ¿Estás seguro de que deseas eliminar al usuario **{userToDelete.name}**? Esta acción es irreversible.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                          type="button"
                          onClick={() => setIsDeleteModalOpen(false)}
                          style={{ 
                              background: '#f0f0f0', color: '#4a0376', padding: '10px 14px', border: 'none', 
                              borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                          }}
                      >
                          Cancelar
                      </button>
                      <button
                          type="button"
                          onClick={confirmDeletion}
                          style={{ 
                              background: '#e35c5c', color: '#fff', padding: '10px 14px', border: 'none', 
                              borderRadius: '10px', fontWeight: '700', cursor: 'pointer'
                          }}
                      >
                          Sí, Eliminar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}