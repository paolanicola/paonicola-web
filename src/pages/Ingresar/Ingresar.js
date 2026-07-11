import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, isLoggedIn } from '../../features/portal/portalSlice'
import PillButton from '../../components/ui/PillButton'
import { whatsAppUrl } from '../../utils/utils'

const BENEFITS = [
  'Tu plan personalizado',
  'Acceso a todo el material',
  'Seguimiento de tu progreso',
  'Acompañamiento por WhatsApp',
]

// Login del portal (design 7a): panel navy + formulario.
export default function Ingresar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logged = useSelector(isLoggedIn)
  const { loginPending, loginError } = useSelector((state) => state.portal)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (logged) navigate('/portal', { replace: true })
  }, [logged, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(login({ email, password }))
  }

  return (
    <main className='ingresar'>
      <section className='ingresar__brand' aria-hidden='true'>
        <div className='ingresar__brand-head'>
          <span className='ingresar__brand-kicker'>NUTRICIONISTA · MP14044</span>
          <span className='ingresar__brand-name'>Paola Nicola</span>
        </div>
        <div className='ingresar__brand-body'>
          <h2 className='ingresar__brand-title'>
            Un acceso exclusivo para pacientes.
          </h2>
          <p className='ingresar__brand-text'>
            Iniciá sesión para tener todo tu material a mano: tu plan, tus
            recursos y tu seguimiento, en un solo lugar.
          </p>
          <ul className='ingresar__benefits'>
            {BENEFITS.map((benefit) => (
              <li key={benefit} className='ingresar__benefit'>
                <span className='ingresar__benefit-check'>✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <span className='ingresar__brand-foot'>
          © {new Date().getFullYear()} Paola Nicola — Nutrición
        </span>
      </section>

      <section className='ingresar__panel'>
        <form className='ingresar__form' onSubmit={handleSubmit}>
          <div className='ingresar__form-head'>
            <h1 className='ingresar__title'>Iniciar sesión</h1>
            <p className='ingresar__subtitle'>
              Accedé a tu plan y seguimiento personalizado.
            </p>
          </div>

          <label className='ingresar__field'>
            <span className='ingresar__label'>Email</span>
            <input
              type='email'
              name='email'
              autoComplete='email'
              className='ingresar__input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className='ingresar__field'>
            <span className='ingresar__label'>Contraseña</span>
            <input
              type='password'
              name='password'
              autoComplete='current-password'
              className='ingresar__input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {loginError && (
            <p className='ingresar__error' role='alert'>
              {loginError}
            </p>
          )}

          <PillButton type='submit' variant='solid' disabled={loginPending}>
            {loginPending ? 'Ingresando...' : 'Ingresar'}
          </PillButton>

          <p className='ingresar__help'>
            ¿Olvidaste tu contraseña o todavía no tenés acceso?{' '}
            <a href={whatsAppUrl} target='_blank' rel='noreferrer'>
              Escribime por WhatsApp
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}
