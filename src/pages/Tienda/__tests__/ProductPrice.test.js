import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductPrice from '../ui/ProductPrice'

const BASE = { price: 48000, active_promo: false, promo_price: null }

describe('ProductPrice', () => {
  it('shows the plain price without strikethrough', () => {
    const { container } = render(<ProductPrice product={BASE} />)
    expect(screen.getByText('$ 48.000')).toBeInTheDocument()
    expect(container.querySelector('.tienda-price__original')).toBeNull()
  })

  it('shows original strikethrough + promo price on active promos', () => {
    render(
      <ProductPrice product={{ ...BASE, active_promo: true, promo_price: 39990 }} />
    )
    expect(screen.getByText('$ 48.000')).toHaveClass('tienda-price__original')
    expect(screen.getByText(/39\.990/)).toBeInTheDocument()
  })

  it('ignores the promo flag when promo_price is missing', () => {
    const { container } = render(
      <ProductPrice product={{ ...BASE, active_promo: true, promo_price: null }} />
    )
    expect(container.querySelector('.tienda-price__original')).toBeNull()
    expect(screen.getByText('$ 48.000')).toBeInTheDocument()
  })

  it('appends the suffix (membresía /mes)', () => {
    render(<ProductPrice product={{ ...BASE, price: 49999 }} suffix='/mes' />)
    expect(screen.getByText('/mes')).toBeInTheDocument()
  })
})
