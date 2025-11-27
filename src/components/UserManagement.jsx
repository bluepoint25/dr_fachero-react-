// src/components/UserManagement.jsx
import React, { useState } from 'react';
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
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Abrir modal (con o sin datos de usuario)
  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('role', user.role);
    } else {
      reset();
    }
  };

  // Manejar el envío del formulario (Agregar/Modificar)
  const onSubmit = (data) => {
    if (editingUser) {
      // Modificar
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...data } : u
      ));
    } else {
      // Agregar
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

  // Eliminar usuario
  const deleteUser = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este usuario?')) {
      setUsers(users.filter(user => user.id !== id));
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
                  onClick={() => deleteUser(user.id)} 
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
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                  type="email"
                  {...register('email', { required: 'El correo es obligatorio' })}
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
    </div>
  );
}