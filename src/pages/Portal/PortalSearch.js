import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  clearSearch,
  markViewed,
  searchLibrary,
} from '../../features/portal/portalSlice'
import { openResourceFile } from '../../features/portal/resourceUrl'
import { TYPE_ICONS } from './portalContent'

// Buscador de material (barra de los diseños 8a/9a) con debounce.
// Resultados desbloqueados abren el archivo; los bloqueados llevan a la tienda.
export default function PortalSearch() {
  const dispatch = useDispatch()
  const { search, searchPending } = useSelector((state) => state.portal)
  const [term, setTerm] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    clearTimeout(timer.current)
    const q = term.trim()
    if (q.length < 2) {
      dispatch(clearSearch())
      return undefined
    }
    timer.current = setTimeout(() => dispatch(searchLibrary(q)), 250)
    return () => clearTimeout(timer.current)
  }, [term, dispatch])

  const openResource = (resource) => {
    dispatch(markViewed(resource.id))
    openResourceFile(resource.file_url)
  }

  const hasResults =
    search && (search.unlocked.length > 0 || search.locked.length > 0)

  return (
    <div className='portal-search'>
      <input
        type='search'
        className='portal-search__input'
        placeholder='Buscar material — ej. "ansiedad", "recetas dulces"...'
        aria-label='Buscar material'
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />

      {term.trim().length >= 2 && (
        <div className='portal-search__results' data-testid='search-results'>
          {searchPending && !search && (
            <span className='portal-search__empty'>Buscando...</span>
          )}
          {search && !hasResults && (
            <span className='portal-search__empty'>
              No encontré material con “{search.query}”.
            </span>
          )}
          {search?.unlocked.map((resource) => (
            <button
              key={resource.id}
              type='button'
              className='portal-search__row'
              onClick={() => openResource(resource)}
            >
              <span aria-hidden='true'>
                {TYPE_ICONS[resource.content_type] || '📄'}
              </span>
              <span className='portal-search__info'>
                <span className='portal-search__title'>{resource.title}</span>
                <span className='portal-search__meta'>
                  {resource.category_icon} {resource.category_name} ·{' '}
                  {resource.type_label}
                </span>
              </span>
              {resource.viewed && (
                <span className='portal-search__state'>✓ Visto</span>
              )}
            </button>
          ))}
          {search?.locked.map((resource) => (
            <Link
              key={resource.id}
              to='/tienda'
              className='portal-search__row portal-search__row--locked'
            >
              <span aria-hidden='true'>
                {TYPE_ICONS[resource.content_type] || '📄'}
              </span>
              <span className='portal-search__info'>
                <span className='portal-search__title'>{resource.title}</span>
                <span className='portal-search__meta'>
                  {resource.category_icon} {resource.category_name} · se
                  desbloquea con el Programa o la Membresía
                </span>
              </span>
              <span aria-hidden='true'>🔒</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
