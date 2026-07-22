import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import {
  fetchCategory,
  getCategory,
  markViewed,
} from '../../features/portal/portalSlice'
import { openResourceFile } from '../../features/portal/resourceUrl'
import Kicker from '../../components/ui/Kicker'
import PillButton from '../../components/ui/PillButton'
import { TYPE_ICONS } from '../Portal/portalContent'

// Filter chips per content type (design 9a)
const TYPE_FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'video', label: 'Videos' },
  { key: 'pdf', label: 'Guías / PDF' },
  { key: 'ejercicio', label: 'Ejercicios' },
]

// Vista de categoría (designs 9a full / 19a mixed with locked material).
export default function PortalCategoria() {
  const { categoryId } = useParams()
  const dispatch = useDispatch()
  const data = useSelector(getCategory)
  const loading = useSelector((state) => state.portal.categoryLoading)
  const [typeFilter, setTypeFilter] = useState('todos')

  useEffect(() => {
    dispatch(fetchCategory(categoryId))
    setTypeFilter('todos')
  }, [dispatch, categoryId])

  const visibleTypes = useMemo(() => {
    if (!data) return []
    const present = new Set(
      [...data.unlocked, ...data.locked].map((r) => r.content_type)
    )
    return TYPE_FILTERS.filter(
      (f) => f.key === 'todos' || present.has(f.key)
    )
  }, [data])

  if (loading || !data) {
    return <div className='portal__status'>Cargando categoría ...</div>
  }

  const { category, progress } = data
  const matches = (resource) =>
    typeFilter === 'todos' || resource.content_type === typeFilter
  const unlocked = data.unlocked.filter(matches)
  const locked = data.locked.filter(matches)

  const openResource = (resource) => {
    dispatch(markViewed(resource.id))
    openResourceFile(resource.file_url)
  }

  return (
    <main className='portal portal--categoria'>
      <nav className='portal__breadcrumb' aria-label='breadcrumb'>
        <Link to='/portal'>Biblioteca</Link>
        <span aria-hidden='true'> / </span>
        <span className='portal__breadcrumb-current'>{category.name}</span>
      </nav>

      <header className='portal__cat-head'>
        <div className='portal__cat-title-row'>
          <span className='portal__cat-icon' aria-hidden='true'>
            {category.icon}
          </span>
          <div className='portal__cat-titles'>
            <h1 className='portal__title'>{category.name}</h1>
            {category.description && (
              <p className='portal__text'>{category.description}</p>
            )}
          </div>
        </div>

        {progress.total > 0 && (
          <div className='portal__progress portal__progress--cat'>
            <div className='portal__progress-track'>
              <div
                className='portal__progress-fill'
                style={{
                  width: `${progress.total ? (progress.viewed / progress.total) * 100 : 0}%`,
                }}
              />
            </div>
            <span className='portal__progress-label'>
              {progress.viewed} de {progress.total} completados
            </span>
          </div>
        )}

        {visibleTypes.length > 1 && (
          <div className='portal__type-filters' role='group' aria-label='Filtrar por tipo'>
            {visibleTypes.map((filter) => (
              <button
                key={filter.key}
                type='button'
                className={`pn-chip${typeFilter === filter.key ? ' pn-chip--active' : ''}`}
                onClick={() => setTypeFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {unlocked.length > 0 && (
        <section className='portal__resources' aria-label='Material disponible'>
          {data.locked.length > 0 && <Kicker>Incluido en tu compra</Kicker>}
          {unlocked.map((resource) => (
            <button
              key={resource.id}
              type='button'
              className='portal-resource'
              data-testid='portal-resource'
              onClick={() => openResource(resource)}
            >
              <span
                className={`portal-resource__tile portal-resource__tile--${resource.content_type}`}
                aria-hidden='true'
              >
                {TYPE_ICONS[resource.content_type] || '📄'}
              </span>
              <span className='portal-resource__info'>
                <span className='portal-resource__type'>{resource.type_label}</span>
                <span className='portal-resource__title'>{resource.title}</span>
              </span>
              <span
                className={`portal-resource__state${resource.viewed ? ' portal-resource__state--viewed' : ''}`}
              >
                {resource.viewed ? '✓ Visto' : 'Sin ver'}
              </span>
            </button>
          ))}
        </section>
      )}

      {locked.length > 0 && (
        <section className='portal__resources' aria-label='Material bloqueado'>
          <Kicker className='portal__kicker-muted'>
            Más recursos de {category.name}
          </Kicker>
          {locked.map((resource) => (
            <div
              key={resource.id}
              className='portal-resource portal-resource--locked'
              data-testid='portal-resource-locked'
            >
              <span className='portal-resource__tile portal-resource__tile--locked' aria-hidden='true'>
                {TYPE_ICONS[resource.content_type] || '📄'}
              </span>
              <span className='portal-resource__info'>
                <span className='portal-resource__type'>{resource.type_label}</span>
                <span className='portal-resource__title'>{resource.title}</span>
              </span>
              <span aria-hidden='true'>🔒</span>
            </div>
          ))}

          <div className='portal__upsell'>
            <div className='portal__upsell-text'>
              <span className='portal__upsell-title'>
                Desbloqueá todo el contenido de {category.name}
              </span>
              <span className='portal__upsell-sub'>
                Disponible con el Programa Método Regula o la Membresía mensual.
              </span>
            </div>
            <PillButton to='/tienda' variant='light' small>
              Ver opciones
            </PillButton>
          </div>
        </section>
      )}
    </main>
  )
}
