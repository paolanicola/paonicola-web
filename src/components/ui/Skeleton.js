import React from 'react'

/**
 * Bloque gris con shimmer para los estados de carga. La gracia es que ocupe el
 * mismo alto que el contenido real: si la página no tiene alto mientras carga,
 * el footer sube al medio de la pantalla.
 *
 * `w`/`h` aceptan cualquier unidad CSS ('60%', 240, '18px'); los números se
 * toman como px. `radius` por defecto sigue el radio de las tarjetas.
 */
export default function Skeleton({ w = '100%', h = 16, radius = 8, className }) {
  // h={null} deja que lo defina el CSS (p.ej. el aspect-ratio de las fotos)
  const style = { width: w, borderRadius: radius }
  if (h != null) style.height = h
  return (
    <span
      aria-hidden='true'
      className={`pn-skeleton${className ? ` ${className}` : ''}`}
      style={style}
    />
  )
}

/** Varias líneas de texto; la última sale más corta, como un párrafo real. */
export function SkeletonText({ lines = 3, h = 14, gap = 10, last = '60%', className }) {
  return (
    <span className='pn-skeleton-text' style={{ gap }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          h={h}
          w={i === lines - 1 ? last : '100%'}
          radius={6}
          className={className}
        />
      ))}
    </span>
  )
}
