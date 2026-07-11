import { getLanding, slugify } from '../productLanding'

describe('slugify', () => {
  it('normalizes accents, dashes and case', () => {
    expect(slugify('Método Regula — programa 1 a 1 de 12 semanas')).toBe(
      'metodo-regula-programa-1-a-1-de-12-semanas'
    )
    expect(slugify('Kit Regula — protocolo de 7 días')).toBe(
      'kit-regula-protocolo-de-7-dias'
    )
  })
})

describe('getLanding', () => {
  it('matches the three flagship products', () => {
    expect(getLanding('Método Regula — programa 1 a 1 de 12 semanas')).toBeTruthy()
    expect(getLanding('Kit Regula — protocolo de 7 días')).toBeTruthy()
    expect(getLanding('Kit Rendimiento Inteligente')).toBeTruthy()
  })

  it('never confuses Kit Regula with Kit Rendimiento', () => {
    expect(getLanding('Kit Rendimiento Inteligente').kicker).toBe('Kit · Deporte')
    expect(getLanding('Kit Regula — protocolo de 7 días').kicker).toBe(
      'Kit · Ansiedad'
    )
  })

  it('returns null for unknown products', () => {
    expect(getLanding('Consulta inicial')).toBeNull()
    expect(getLanding(null)).toBeNull()
  })
})
