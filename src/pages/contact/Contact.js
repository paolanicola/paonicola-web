import React from 'react'
import { useForm } from 'react-hook-form'
import { ReactComponent as InstagramSvg } from '../../assets/images/footer/instagram-footer.svg'
import { ReactComponent as MailSvg } from '../../assets/images/footer/mail-footer.svg'
import { ReactComponent as WhatsappSvg } from '../../assets/images/footer/whatsapp-footer.svg'
import Kicker from '../../components/ui/Kicker'
import PillButton from '../../components/ui/PillButton'
import { whatsAppLink, whatsAppNumber } from '../../utils/utils'

const EMAIL = 'nutricionista.nicola@gmail.com'
const INSTAGRAM = 'nutricion.paonicola'

const CHANNELS = [
  {
    key: 'whatsapp',
    Icon: WhatsappSvg,
    label: 'WhatsApp',
    value: whatsAppNumber,
    href: whatsAppLink('¡Hola Pao! Vengo de la web y quiero hacerte una consulta.'),
  },
  {
    key: 'mail',
    Icon: MailSvg,
    label: 'Correo',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    key: 'instagram',
    Icon: InstagramSvg,
    label: 'Instagram',
    value: INSTAGRAM,
    href: 'https://www.instagram.com/nutricion.paonicola/',
  },
]

// Arma el mensaje que Pao recibe ya encarrilado por WhatsApp.
function buildMessage({ nombre, email, mensaje }) {
  const lines = [`¡Hola Pao! Soy ${nombre.trim()}.`, '', mensaje.trim()]
  if (email && email.trim()) lines.push('', `Mi email: ${email.trim()}`)
  return lines.join('\n')
}

/**
 * Contacto (Tienda Rediseño). El formulario ya no hacía nada (setSend(true) y a
 * la nada); ahora abre WhatsApp con el mensaje precargado, que es donde Pao
 * realmente atiende. Sin reCAPTCHA: no hay envío al servidor que proteger.
 */
export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    window.open(whatsAppLink(buildMessage(data)), '_blank', 'noopener,noreferrer')
  }

  return (
    <main className='pn-contacto'>
      <header className='pn-contacto__header'>
        <Kicker>Contacto</Kicker>
        <h1 className='pn-contacto__title'>Hablemos</h1>
        <p className='pn-contacto__subtitle'>
          Contame qué estás buscando y te oriento sobre qué servicio se adapta
          mejor a vos.
        </p>
      </header>

      <div className='pn-contacto__grid'>
        <section className='pn-contacto__channels' aria-label='Canales de contacto'>
          <p className='pn-contacto__channels-lead'>Escribime directamente por:</p>
          {CHANNELS.map(({ key, Icon, label, value, href }) => (
            <a
              key={key}
              className='pn-contacto__channel'
              href={href}
              target='_blank'
              rel='noopener noreferrer'
            >
              <span className='pn-contacto__channel-icon' aria-hidden='true'>
                <Icon />
              </span>
              <span className='pn-contacto__channel-body'>
                <span className='pn-contacto__channel-label'>{label}</span>
                <span className='pn-contacto__channel-value'>{value}</span>
              </span>
            </a>
          ))}
        </section>

        <section className='pn-contacto__form-card' aria-label='Enviar un mensaje'>
          <form className='pn-contacto__form' onSubmit={handleSubmit(onSubmit)} noValidate>
            <label className='pn-contacto__field'>
              <span className='pn-contacto__field-label'>Nombre</span>
              <input
                className={`pn-contacto__input${errors.nombre ? ' pn-contacto__input--error' : ''}`}
                type='text'
                {...register('nombre', {
                  required: 'Contame tu nombre',
                })}
              />
              {errors.nombre && (
                <span className='pn-contacto__error'>{errors.nombre.message}</span>
              )}
            </label>

            <label className='pn-contacto__field'>
              <span className='pn-contacto__field-label'>
                Email <span className='pn-contacto__optional'>(opcional)</span>
              </span>
              <input
                className={`pn-contacto__input${errors.email ? ' pn-contacto__input--error' : ''}`}
                type='email'
                {...register('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Revisá el formato del email',
                  },
                })}
              />
              {errors.email && (
                <span className='pn-contacto__error'>{errors.email.message}</span>
              )}
            </label>

            <label className='pn-contacto__field'>
              <span className='pn-contacto__field-label'>Mensaje</span>
              <textarea
                className={`pn-contacto__input pn-contacto__input--area${errors.mensaje ? ' pn-contacto__input--error' : ''}`}
                rows={4}
                {...register('mensaje', {
                  required: 'Escribí tu consulta',
                })}
              />
              {errors.mensaje && (
                <span className='pn-contacto__error'>{errors.mensaje.message}</span>
              )}
            </label>

            <PillButton type='submit' variant='solid' className='pn-contacto__submit'>
              Enviar por WhatsApp
            </PillButton>
            <p className='pn-contacto__note'>
              Se abre WhatsApp con tu mensaje listo para enviar.
            </p>
          </form>
        </section>
      </div>
    </main>
  )
}
