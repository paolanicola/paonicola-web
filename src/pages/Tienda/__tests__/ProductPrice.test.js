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

  it('renders nothing when the product has no price loaded', () => {
    const { container } = render(<ProductPrice product={{ ...BASE, price: null }} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('still shows the promo price when the base price is missing', () => {
    const { container } = render(
      <ProductPrice
        product={{ ...BASE, price: null, active_promo: true, promo_price: 39990 }}
      />
    )
    expect(screen.getByText(/39\.990/)).toBeInTheDocument()
    expect(container.querySelector('.tienda-price__original')).toBeNull()
  })

  it('shows "Gratis" instead of $ 0 for free products', () => {
    render(<ProductPrice product={{ ...BASE, price: 0 }} />)
    expect(screen.getByText('Gratis')).toHaveClass('tienda-price__free')
  })

  it('appends the suffix (membresía /mes)', () => {
    render(<ProductPrice product={{ ...BASE, price: 49999 }} suffix='/mes' />)
    expect(screen.getByText('/mes')).toBeInTheDocument()
  })

  describe('región', () => {
    const REGIONAL = {
      ...BASE,
      price: 499000,
      price_usd: 350,
      installments_count: 3,
      installment_price: 185000,
      installment_price_usd: 125,
    }

    it('uses pesos and the peso installment in Argentina', () => {
      render(<ProductPrice product={REGIONAL} region='ar' />)
      expect(screen.getByText('$ 499.000')).toBeInTheDocument()
      expect(screen.getByText('o 3 cuotas de $ 185.000')).toBeInTheDocument()
    })

    it('switches to dollars and the USD installment for Exterior', () => {
      render(<ProductPrice product={REGIONAL} region='ex' />)
      expect(screen.getByText('USD 350')).toBeInTheDocument()
      expect(screen.getByText('o 3 cuotas de USD 125')).toBeInTheDocument()
    })

    it('stays in pesos for Exterior when the product has no USD price', () => {
      render(<ProductPrice product={{ ...REGIONAL, price_usd: null }} region='ex' />)
      expect(screen.getByText('$ 499.000')).toBeInTheDocument()
    })

    // la promo es en pesos: aplicarla al precio en dólares lo dejaría mal
    it('ignores the peso promo when showing the USD price', () => {
      const { container } = render(
        <ProductPrice
          product={{ ...REGIONAL, active_promo: true, promo_price: 399000 }}
          region='ex'
        />
      )
      expect(screen.getByText('USD 350')).toBeInTheDocument()
      expect(container.querySelector('.tienda-price__original')).toBeNull()
    })

    it('omits the installment line when only the count is loaded', () => {
      const { container } = render(
        <ProductPrice product={{ ...REGIONAL, installment_price: null }} region='ar' />
      )
      expect(container.querySelector('.tienda-price__installments')).toBeNull()
    })
  })

  it('falls back to the important_note line when there are no installments', () => {
    render(
      <ProductPrice product={BASE} note='o USD 50/mes desde el exterior' />
    )
    expect(
      screen.getByText('o USD 50/mes desde el exterior')
    ).toHaveClass('tienda-price__note')
  })

  it('prefers the installment line over the note', () => {
    const { container } = render(
      <ProductPrice
        product={{ ...BASE, installments_count: 3, installment_price: 16000 }}
        note='nota suelta'
      />
    )
    expect(container.querySelector('.tienda-price__installments')).toBeInTheDocument()
    expect(container.querySelector('.tienda-price__note')).toBeNull()
  })
})
