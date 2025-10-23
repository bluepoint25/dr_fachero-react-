// src/components/tests/Footer.test.jsx
/* eslint-env vitest */
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Footer from '../Footer'

// La navegación del Footer usa window.scrollTo, necesitamos simular esa función.
global.scrollTo = vi.fn()

describe('Footer', () => {
  const mockSetPagina = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe mostrar el logo y todos los enlaces de navegación principales', () => {
    render(<Footer pagina="inicio" setPagina={mockSetPagina} />)

    // Botón del logo a Inicio
    expect(screen.getByRole('button', { name: /Ir a Inicio/i })).toBeInTheDocument()

    // Enlaces de Navegación
    expect(screen.getByRole('button', { name: /Funcionalidades/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Planes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /¿Por qué nosotros\?/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Blog/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Contacto/i })).toBeInTheDocument()
  })

  it('llama a setPagina con el slug correcto al hacer clic en los enlaces', () => {
    render(<Footer pagina="inicio" setPagina={mockSetPagina} />)

    // Prueba haciendo clic en diferentes botones
    fireEvent.click(screen.getByRole('button', { name: /Planes/i }))
    expect(mockSetPagina).toHaveBeenCalledWith('planes')

    fireEvent.click(screen.getByRole('button', { name: /Blog/i }))
    expect(mockSetPagina).toHaveBeenCalledWith('blog')

    fireEvent.click(screen.getByRole('button', { name: /Ir a Inicio/i }))
    expect(mockSetPagina).toHaveBeenCalledWith('inicio')
    
    // Verifica que window.scrollTo también es llamado (para resetear el scroll)
    expect(global.scrollTo).toHaveBeenCalled()
  })

  it('aplica la clase "active" y aria-current="page" a la página actual', () => {
    const { rerender } = render(<Footer pagina="funcionalidades" setPagina={mockSetPagina} />)

    // Funcionalidades debe estar activo
    const btnFuncionalidades = screen.getByRole('button', { name: /Funcionalidades/i })
    expect(btnFuncionalidades).toHaveClass('active')
    expect(btnFuncionalidades).toHaveAttribute('aria-current', 'page')

    // Rerender con una página diferente
    rerender(<Footer pagina="contacto" setPagina={mockSetPagina} />)
    const btnContacto = screen.getByRole('button', { name: /Contacto/i })

    // Contacto debe estar activo
    expect(btnContacto).toHaveClass('active')
    expect(btnContacto).toHaveAttribute('aria-current', 'page')
    
    // Funcionalidades ya NO debe estar activo
    expect(btnFuncionalidades).not.toHaveClass('active')
    expect(btnFuncionalidades).not.toHaveAttribute('aria-current', 'page')
  })

  it('debe mostrar los enlaces de Soporte y Redes Sociales', () => {
    render(<Footer pagina="inicio" setPagina={mockSetPagina} />)
    
    // Textos de soporte
    expect(screen.getByText(/Términos y Condiciones/i)).toBeInTheDocument()
    expect(screen.getByText(/Política de Privacidad/i)).toBeInTheDocument()

    // Enlaces de redes sociales
    expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    
    // Texto de copyright
    expect(screen.getByText(/Todos los derechos reservados\./i)).toBeInTheDocument()
  })
})