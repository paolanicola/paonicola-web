import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createAccess, isLoggedIn } from '../../features/portal/portalSlice'
import PillButton from '../../components/ui/PillButton'
import Kicker from '../../components/ui/Kicker'
import { whatsAppUrl } from '../../utils/utils'

// Destino del email post-compra / recuperación (Fase D): el paciente elige su
// contraseña y entra directo al portal.
export default function CrearAcceso() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  const logged = useSelector(isLoggedIn)
  const { accessPending, accessError } = useSelector((state) => state.portal)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    if (logged) navigate('/portal', { replace: true })
  }, [logged, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password.length < 8) {
      return setLocalError('La contraseña debe tener al menos 8 caracteres.')
    }
    if (password !== confirm) {
      return setLocalError('Las contraseñas no coinciden.')
    }
    setLocalError(null)
    dispatch(createAccess({ token, password }))
  }

  const error = localError || accessError

  return (
    <main className='ingresar'>
      <section className='ingresar__panel ingresar__panel--solo'>
        <form className='ingresar__form' onSubmit={handleSubmit}>
          <div className='ingresar__form-head'>
            <Kicker>Portal de pacientes</Kicker>
            <h1 className='ingresar__title'>Creá tu acceso</h1>
            <p className='ingresar__subtitle'>
              Elegí una contraseña para entrar a tu material, tus recursos y tu
              seguimiento.
            </p>
          </div>

          {token ? (
            <>
              <label className='ingresar__field'>
                <span className='ingresar__label'>Contraseña nueva</span>
                <input
                  type='password'
                  name='password'
                  autoComplete='new-password'
                  className='ingresar__input'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label className='ingresar__field'>
                <span className='ingresar__label'>Repetila</span>
                <input
                  type='password'
                  name='confirm'
                  autoComplete='new-password'
                  className='ingresar__input'
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </label>

              {error && (
                <p className='ingresar__error' role='alert'>
                  {error}
                </p>
              )}

              <PillButton type='submit' variant='solid' disabled={accessPending}>
                {accessPending ? 'Creando...' : 'Crear acceso y entrar'}
              </PillButton>
            </>
          ) : (
            <p className='ingresar__error' role='alert'>
              Este link no es válido. Pedí uno nuevo desde el correo de compra o
              escribime por WhatsApp.
            </p>
          )}

          <p className='ingresar__help'>
            ¿Problemas con el link?{' '}
            <a href={whatsAppUrl} target='_blank' rel='noreferrer'>
              Escribime por WhatsApp
            </a>
          </p>
        </form>
      </section>
    </main>
  )
}
