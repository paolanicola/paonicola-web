import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg'
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg'
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg'
import ReCAPTCHA from 'react-google-recaptcha'

import { toast } from 'react-toastify'
import { whatsAppNumber, whatsAppUrl } from '../../utils/utils'

export default function Contact() {
  const [send, setSend] = useState(false)
  const [recaptchaSucceeded, setRecaptchaSucceeded] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit = (data) => {
    setSend(true)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (recaptchaSucceeded) {
      handleSubmit(onSubmit)()
    } else {
      toast.error('Por favor, completa el reCAPTCHA.')
    }
  }

  const handleRecaptchaChange = (value) => {
    setRecaptchaSucceeded(true)
  }

  return (
    <div className='container-contact'>
      <div className='contact-left one animate fadeLeft'>
        <div className=''>
          <p className='contact-title'>
            Por favor, llená el formulario o contáctame a través de:
          </p>
          <ul>
            <li className='contact-link'>
              <a href={whatsAppUrl} target='_blank' rel='noopener noreferrer'>
                <WhatsappBrand className='contact-icon' />
                <p className='contact-icon-info'>{whatsAppNumber}</p>
              </a>
            </li>
            <li className='contact-link'>
              <a
                href='mailto:nutricionista.nicola@gmail.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <MailBrand className='contact-icon' />
                <p className='contact-icon-info'>
                  nutricionista.nicola@gmail.com
                </p>
              </a>
            </li>
            <li className='contact-link'>
              <a
                href='https://www.instagram.com/nutricion.paonicola/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <InstagramBrand className='contact-icon' />
                <p className='contact-icon-info'>nutricion.paonicola</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {send ? (
        <div className='contact-right contact-title'>
          Mensaje enviado Gracias por Contactarnos.{' '}
        </div>
      ) : (
        <div className='contact-right one animate fadeRight'>
          <form id='formContact' className='form' onSubmit={handleFormSubmit}>
            <div className='form'>
              <div className='form-name'>
                <p className='contact-right-label'>
                  <label>Nombre</label>
                </p>
                <input
                  className={errors.nombre && 'input_error'}
                  type='text'
                  {...register('nombre', {
                    required: {
                      value: true,
                      message: 'Nombre requerdio',
                    },
                    pattern: {
                      value: /^[a-z ,.'-]+$/i,
                      message: 'Formato incorrecto, solo letras',
                    },
                  })}
                />
                {errors.nombre && (
                  <span className={errors.nombre && 'span_error'}>
                    {errors.nombre.message}
                  </span>
                )}
              </div>
            </div>
            <p className='contact-right-label'>
              <label>E-mail</label>
            </p>
            <input
              className={errors.email && 'input_error'}
              placeholder=''
              type='text'
              {...register('email', {
                required: {
                  value: true,
                  message: 'Email requerido',
                },
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: 'Formato del email incorrecto',
                },
              })}
            />
            {errors.email && (
              <span className={errors.email && 'span_error'}>
                {errors.email.message}
              </span>
            )}

            <p className='contact-right-label'>
              <label>Mensaje</label>
            </p>
            <textarea
              className={errors.textarea && 'input_error'}
              type='text'
              {...register('textarea', {
                required: { value: true, message: 'Mensaje requerido' },
              })}
            />
            {errors.textarea && (
              <span className={errors.textarea && 'span_error'}>
                {errors.textarea.message}
              </span>
            )}

            <div className='contact-buton-right'>
              <ReCAPTCHA
                sitekey={
                  process.env.REACT_APP_RECAPTCHA_SITEKEY ?? 'invalid-key'
                }
                onChange={handleRecaptchaChange}
              />
              <input
                type='submit'
                className='btn-primary right'
                value='Enviar'
              />
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
