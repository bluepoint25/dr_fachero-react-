import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Navbar from '../Navbar'


describe('Navbar', () => {
  it('muestra todos los botones de navegación', () => {
    const setPagina = vi.fn()
    render(<Navbar pagina="inicio" setPagina={setPagina} />)

    // Usa roles accesibles con el nombre visible exacto (incluye tildes y signos)
    expect(screen.getByRole('button', { name: /inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /funcionalidades/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /¿por qué\?/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /blog/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /planes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /contacto/i })).toBeInTheDocument()
  })

  it('dispara setPagina al hacer clic en los botones', () => {
    const setPagina = vi.fn()
    render(<Navbar pagina="inicio" setPagina={setPagina} />)

    fireEvent.click(screen.getByRole('button', { name: /planes/i }))
    expect(setPagina).toHaveBeenCalledWith('planes')

    fireEvent.click(screen.getByRole('button', { name: /contacto/i }))
    expect(setPagina).toHaveBeenCalledWith('contacto')
  })

  it('marca con clase "active" el botón de la página actual', () => {
    const setPagina = vi.fn()
    const { rerender } = render(<Navbar pagina="inicio" setPagina={setPagina} />)

    // Inicio activo
    const btnInicio = screen.getByRole('button', { name: /inicio/i })
    expect(btnInicio).toHaveClass('active')

    // Cambiamos la prop y verificamos que cambie el activo
    rerender(<Navbar pagina="blog" setPagina={setPagina} />)
    const btnBlog = screen.getByRole('button', { name: /blog/i })
    expect(btnBlog).toHaveClass('active')
    expect(btnInicio).not.toHaveClass('active')
  })
})
