import React from 'react'
import { render, screen } from '@testing-library/react'
import NotForYou from '../sections/NotForYou'
import { notForYou } from '../homeContent'

describe('NotForYou', () => {
  beforeEach(() => render(<NotForYou />))

  it('renders the title and subtitle', () => {
    expect(
      screen.getByRole('heading', { name: notForYou.title })
    ).toBeInTheDocument()
    expect(screen.getByText(notForYou.subtitle)).toBeInTheDocument()
  })

  it('renders one item per disqualifier', () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(
      notForYou.disqualifiers.length
    )
  })

  it('renders the exact disqualifier copy', () => {
    notForYou.disqualifiers.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument()
    })
  })
})
