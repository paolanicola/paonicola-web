import { resolveFileUrl, openResourceFile } from './resourceUrl'

describe('resolveFileUrl', () => {
  it('returns null for empty values', () => {
    expect(resolveFileUrl(null)).toBeNull()
    expect(resolveFileUrl(undefined)).toBeNull()
    expect(resolveFileUrl('')).toBeNull()
  })

  it('keeps absolute http(s) urls untouched', () => {
    expect(resolveFileUrl('https://cdn.x.com/a.pdf')).toBe('https://cdn.x.com/a.pdf')
    expect(resolveFileUrl('http://x.com/a.pdf')).toBe('http://x.com/a.pdf')
    expect(resolveFileUrl('//x.com/a.pdf')).toBe('//x.com/a.pdf')
  })

  it('keeps root-relative paths untouched', () => {
    expect(resolveFileUrl('/descargables/compras-saludables.pdf')).toBe(
      '/descargables/compras-saludables.pdf'
    )
  })

  it('forces a leading slash on bare filenames so window.open cannot hijack the SPA route', () => {
    expect(resolveFileUrl('Kiosko saludable.jpg')).toBe('/Kiosko saludable.jpg')
  })
})

describe('openResourceFile', () => {
  const original = window.open
  beforeEach(() => {
    window.open = jest.fn()
  })
  afterEach(() => {
    window.open = original
  })

  it('does not open anything for empty file_url', () => {
    openResourceFile(null)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('opens the normalised url in a new tab', () => {
    openResourceFile('Kiosko saludable.jpg')
    expect(window.open).toHaveBeenCalledWith(
      '/Kiosko saludable.jpg',
      '_blank',
      'noopener'
    )
  })
})
