import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { BrandLogo } from './BrandLogo'
import { App } from '../app/App'

describe('BrandLogo', () => {
  it.each([
    ['principal', 460, 247],
    ['transparente', 489, 280],
  ] as const)('usa o arquivo oficial %s e suas dimensões intrínsecas', (variant, width, height) => {
    render(<BrandLogo context="institutional" variant={variant} />)
    const image = screen.getByRole('img', { name: 'Trilhas 60+. CONEXÃO • APRENDIZAGEM • AUTONOMIA' })
    const src = `/brand/logo-trilhas60-${variant}.png`
    expect(image).toHaveAttribute('src', src)
    expect(image).toHaveAttribute('width', String(width))
    expect(image).toHaveAttribute('height', String(height))
    // Confere o PNG realmente entregue, em vez de pressupor que as variantes são iguais.
    const png = readFileSync(resolve(`public${src}`))
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
    expect(png.readUInt32BE(16)).toBe(width)
    expect(png.readUInt32BE(20)).toBe(height)
  })

  it.each(['small', 'medium', 'large'] as const)('oferece tamanho %s sem mudar o recurso original', (size) => {
    render(<BrandLogo context="home" size={size} />)
    const image = screen.getByRole('img')
    expect(image.parentElement).toHaveClass(`brand-logo--${size}`, 'brand-logo--home')
    expect(image).toHaveAttribute('src', '/brand/logo-trilhas60-principal.png')
  })

  it('aceita texto alternativo específico ao contexto', () => {
    render(<BrandLogo context="institutional" alt="Identidade oficial do projeto Trilhas 60+" />)
    expect(screen.getByRole('img', { name: 'Identidade oficial do projeto Trilhas 60+' })).toBeInTheDocument()
  })

  it('evita repetição quando o nome já aparece no contexto', () => {
    const { container } = render(<><BrandLogo context="header" size="small" decorative /><span>Trilhas 60+</span></>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
    expect(container.querySelector('img')).toHaveAttribute('aria-hidden', 'true')
  })

  it('integra a arte no cabeçalho e rodapé sem duplicação na apresentação inicial', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    const header = screen.getByRole('banner')
    expect(within(header).getByRole('link', { name: 'Trilhas 60+, início' })).toHaveAttribute('href', '/')
    expect(header.querySelector('img')).toHaveAttribute('alt', '')
    expect(screen.getByRole('main').querySelector('img')).toBeNull()
    expect(screen.getByRole('contentinfo').querySelector('img')).toHaveAttribute('src', '/brand/logo-trilhas60-transparente.png')
  })
})
