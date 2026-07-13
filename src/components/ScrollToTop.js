import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Al navegar: con hash (anclas del nav, ej. /#testimonios) scrollea a esa
// sección; sin hash arranca desde arriba. Solo en efectos — nunca durante el
// render (scrollear en render desestabiliza el layout y los tests).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // esperar el render de la página destino antes de buscar el ancla
      const timer = setTimeout(() => {
        document
          .querySelector(hash)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
    return undefined
  }, [pathname, hash])

  return null
}
