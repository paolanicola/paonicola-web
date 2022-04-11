import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ReactComponent as InstagramBrand } from '../../assets/images/header/instagram-brands.svg';
import { ReactComponent as MailBrand } from '../../assets/images/header/mail.svg';
import { ReactComponent as WhatsappBrand } from '../../assets/images/header/whatsapp-brands.svg';

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();
  const onSubmit = (data) => {};

  return (
    <>
      <div className='container-contact'>
        <div className='contact-left one animate fadeLeft'>
          <div className=''>
            <p className='contact-title'>Por favor, llená el formulario o contáctame a través de:</p>
            <ul>
              <li class='contact-link'>
                <Link to='https://api.whatsapp.com/send?phone=5492216248895&text=Hola%21%20Estoy%20buscando%20reservar%20un%20turno.&source=&data=&app_absent='>
                  <WhatsappBrand className='contact-icon' />
                  <p className='contact-icon-info'>221-6248895</p>
                </Link>
              </li>
              <li class='contact-link'>
                <Link to='mailto:nutricionista.nicola@gmail.com'>
                  <MailBrand className='contact-icon' />
                  <p className='contact-icon-info'>nutricionista.nicola@gmail.com</p>
                </Link>
              </li>
              <li class='contact-link'>
                <Link target='_blank' to='https://www.instagram.com/nutricion.paonicola/'>
                  <InstagramBrand className='contact-icon' />
                  <p className='contact-icon-info'>nutricion.paonicola</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='contact-right one animate fadeRight'>
          <form id='formContact' className='form' onSubmit={handleSubmit(onSubmit)}>
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
                {errors.nombre && <span className={errors.nombre && 'span_error'}>{errors.nombre.message}</span>}
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
                  value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: 'Formato del email incorrecto',
                },
              })}
            />
            {errors.email && <span className={errors.email && 'span_error'}>{errors.email.message}</span>}

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
            {errors.textarea && <span className={errors.textarea && 'span_error'}>{errors.textarea.message}</span>}
            <div className='contact-buton-right'>
              <input type='submit' className='btn-primary right' value='Enviar' />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
