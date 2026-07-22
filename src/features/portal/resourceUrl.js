// Helpers for opening portal resource files (guías / PDFs / imágenes).
//
// Backend records sometimes store `file_url` as a bare filename
// (e.g. "Kiosko saludable.jpg") instead of a root-relative path. Passed
// straight to window.open() the browser resolves it relative to the current
// SPA route (/portal/categoria/1), producing /portal/categoria/Kiosko%20saludable.jpg
// which matches the category route and fires a bogus API call -> 500, leaving
// the page stuck on "Cargando categoría ...". Normalising to an absolute or
// root-relative URL prevents the SPA-route hijack (a bad filename now 404s at
// the static host instead of crashing the category view).
export const resolveFileUrl = (url) => {
  if (!url) return null
  if (/^(https?:)?\/\//i.test(url)) return url // absolute or protocol-relative
  return url.startsWith('/') ? url : `/${url}`
}

export const openResourceFile = (url) => {
  const href = resolveFileUrl(url)
  if (href) window.open(href, '_blank', 'noopener')
}
