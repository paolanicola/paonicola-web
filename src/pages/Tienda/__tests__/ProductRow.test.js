import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductRow from '../ui/ProductRow'

const KIT = {
  id: 3,
  name: 'Kit Rendimiento Inteligente',
  description: 'Nutrición deportiva.',
  price: 48000,
  active_promo: false,
  promo_price: null,
  download_url: null,
  thumbnail: '/img/kit.png',
}

function renderRow(props) {
  return render(
    <MemoryRouter>
      <ProductRow cta='Agregar' onAdd={jest.fn()} {...props} />
    </MemoryRouter>
  )
}

describe('ProductRow', () => {
  it('links image and title to the product page', () => {
    renderRow({ product: KIT })
    const links = screen.getAllByRole('link')
    links.forEach((l) => expect(l).toHaveAttribute('href', '/producto/3'))
  })

  it('renders an Agregar button that calls onAdd with the product', () => {
    const onAdd = jest.fn()
    renderRow({ product: KIT, onAdd })
    screen.getByRole('button', { name: 'Agregar' }).click()
    expect(onAdd).toHaveBeenCalledWith(KIT)
  })

  it('renders a download link (no price) for free downloadables', () => {
    renderRow({
      product: { ...KIT, price: 0, download_url: '/descargables/guia.pdf' },
      cta: 'Descargar',
      download: true,
    })
    expect(screen.getByRole('link', { name: 'Descargar' })).toHaveAttribute(
      'href',
      '/descargables/guia.pdf'
    )
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('falls back to Agregar when a downloadable has no file yet', () => {
    renderRow({
      product: { ...KIT, price: 0, download_url: null },
      cta: 'Descargar',
      download: true,
    })
    expect(screen.getByRole('button', { name: 'Descargar' })).toBeInTheDocument()
  })
})
