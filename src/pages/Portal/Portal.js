import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchLibrary,
  getLibrary,
  getPatient,
  logout,
  markViewed,
} from '../../features/portal/portalSlice'
import Kicker from '../../components/ui/Kicker'
import PillButton from '../../components/ui/PillButton'
import { dailyPhrase, MOOD_SHORTCUTS } from './portalContent'
import PortalSearch from './PortalSearch'

// Portal del paciente (designs 8a full-access / 18a restricted).
export default function Portal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const patient = useSelector(getPatient)
  const library = useSelector(getLibrary)
  const loading = useSelector((state) => state.portal.loading)

  useEffect(() => {
    dispatch(fetchLibrary())
  }, [dispatch])

  const handleLogout = () => {
    // navegar primero: si el token se limpia con el guard montado,
    // RequirePatient gana la carrera y redirige a /ingresar
    navigate('/')
    dispatch(logout())
  }

  const openResource = (resource) => {
    dispatch(markViewed(resource.id))
    if (resource.file_url) window.open(resource.file_url, '_blank', 'noopener')
  }

  if (loading || !library) {
    return <div className='portal__status'>Cargando tu biblioteca ...</div>
  }

  const categoriesByName = new Map(library.categories.map((c) => [c.name, c]))
  const moodChips = MOOD_SHORTCUTS.filter((m) => categoriesByName.has(m.category))
  const hasLocked = library.categories.some((c) => !c.unlocked)

  return (
    <main className='portal'>
      <div className='portal__topbar'>
        <span className='portal__hello'>Hola, {patient?.name}</span>
        <div className='portal__avatar' aria-hidden='true'>
          {patient?.name?.[0]?.toUpperCase()}
        </div>
        <button type='button' className='portal__logout' onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className='portal__searchbar'>
        <PortalSearch />
      </div>

      <section className='portal__phrase' aria-label='Frase del día'>
        <Kicker>Frase del día</Kicker>
        <p className='portal__phrase-text'>{dailyPhrase()}</p>
      </section>

      <section className='portal__greeting'>
        <h1 className='portal__title'>👋 Hola, {patient?.name}</h1>
        <p className='portal__text'>
          Elegiste priorizar tu salud. Ese ya es el primer paso.
        </p>
        <p className='portal__text'>
          Ahora seguí construyendo hábitos que te acerquen a la vida que querés.
        </p>
        {library.overall.total > 0 && (
          <div className='portal__progress'>
            <div className='portal__progress-track'>
              <div
                className='portal__progress-fill'
                style={{ width: `${library.overall.percent}%` }}
              />
            </div>
            <span className='portal__progress-label'>
              Llevás {library.overall.percent}% del material recomendado
            </span>
          </div>
        )}
      </section>

      {moodChips.length > 0 && (
        <section className='portal__moods' aria-label='Accesos rápidos'>
          <p className='portal__text'>
            <strong>Elegí lo que necesitás hoy.</strong> Estoy acá para
            acompañarte durante todo el proceso. 🤍
          </p>
          <div className='portal__mood-chips'>
            {moodChips.map((mood) => (
              <Link
                key={mood.label}
                to={`/portal/categoria/${categoriesByName.get(mood.category).id}`}
                className='portal__mood-chip'
              >
                <span className='portal__mood-dot' aria-hidden='true'>●</span>
                {mood.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {(library.recommended || library.last_viewed) && (
        <section className='portal__highlights'>
          {library.recommended && (
            <div className='portal__recommended'>
              <Kicker className='portal__kicker-mint'>
                Recomendado por tu nutri Pao
              </Kicker>
              <span className='portal__recommended-title'>
                {library.recommended.title}
              </span>
              <span className='portal__recommended-text'>
                Paola te sumó este material, especialmente para vos.
              </span>
              <PillButton
                variant='light'
                small
                onClick={() => openResource(library.recommended)}
              >
                Ver ahora
              </PillButton>
            </div>
          )}
          {library.last_viewed && (
            <div className='portal__lastviewed'>
              <Kicker className='portal__kicker-rosa'>Último material visto</Kicker>
              <span className='portal__lastviewed-title'>
                {library.last_viewed.title}
              </span>
              <PillButton
                variant='solid'
                small
                onClick={() => openResource(library.last_viewed)}
              >
                Continuar
              </PillButton>
            </div>
          )}
        </section>
      )}

      <section className='portal__library' aria-label='Biblioteca'>
        <div className='portal__library-head'>
          <Kicker>Biblioteca</Kicker>
          <h2 className='portal__subtitle'>Explorar por categoría</h2>
        </div>
        <div className='portal__categories'>
          {library.categories.map((category) => (
            <Link
              key={category.id}
              to={`/portal/categoria/${category.id}`}
              className={`portal-category${category.unlocked ? '' : ' portal-category--locked'}`}
              data-testid='portal-category'
            >
              <span
                className={`portal-category__icon${category.unlocked ? '' : ' portal-category__icon--locked'}`}
                aria-hidden='true'
              >
                {category.icon}
              </span>
              <span className='portal-category__info'>
                <span className='portal-category__name'>{category.name}</span>
                <span className='portal-category__meta'>
                  {category.unlocked && library.full_access === false
                    ? 'Desbloqueada'
                    : `${category.resource_count} recursos`}
                </span>
              </span>
              <span className='portal-category__mark' aria-hidden='true'>
                {category.unlocked ? '→' : '🔒'}
              </span>
            </Link>
          ))}
        </div>

        {hasLocked && (
          <div className='portal__upsell'>
            <div className='portal__upsell-text'>
              <span className='portal__upsell-title'>
                ¿Querés acceso a toda la biblioteca?
              </span>
              <span className='portal__upsell-sub'>
                Con el Programa Método Regula o la Membresía mensual desbloqueás
                todas las categorías.
              </span>
            </div>
            <PillButton to='/tienda' variant='light' small>
              Ver opciones
            </PillButton>
          </div>
        )}
      </section>
    </main>
  )
}
