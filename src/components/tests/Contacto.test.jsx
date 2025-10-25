/* eslint-env vitest */
import { render, screen, fireEvent } from '@testing-library/react'
import Contacto from '../../pages/Contacto'

it('limpia los campos después de enviar el formulario exitosamente', async () => {
  render(<Contacto />)

  const nombre = screen.getByLabelText(/Nombre\*/i)
  const apellido = screen.getByLabelText(/Apellido\*/i)
  const clinica = screen.getByLabelText(/Nombre de clínica\*/i)
  const profesionales = screen.getByLabelText(/Nº de profesionales\*/i)
  const email = screen.getByLabelText(/Correo laboral\*/i)
  const telefono = screen.getByPlaceholderText(/912345678/i)
  const boton = screen.getByRole('button', { name: /enviar/i })

  // llena
  fireEvent.change(nombre, { target: { value: 'Juan' } })
  fireEvent.change(apellido, { target: { value: 'Pérez' } })
  fireEvent.change(clinica, { target: { value: 'Clínica Centro' } })
  fireEvent.change(profesionales, { target: { value: '3' } })
  fireEvent.change(email, { target: { value: 'juan@mail.com' } })
  fireEvent.change(telefono, { target: { value: '987654321' } })

  // envía
  fireEvent.click(boton)

  //  onSubmit espera ~800ms. Esperamos el mensaje de éxito.
  await screen.findByText(/¡Gracias! Te contactaremos pronto\./i, {}, { timeout: 3000 })

  // luego verificamos que el reset ocurrió
  expect(nombre.value).toBe('')
  expect(apellido.value).toBe('')
  expect(clinica.value).toBe('')
  expect(profesionales.value).toBe('')
  expect(email.value).toBe('')
  expect(telefono.value).toBe('')
})
