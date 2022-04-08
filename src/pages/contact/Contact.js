import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
        <div className='contact-left'>
          <div className='datos wow fadeInLeft'>
            <p>Por favor, llená el formulario o contáctame a través de:</p>
            <ul>
              <li class='c-tel'>
                <Link to='https://api.whatsapp.com/send?phone=5492216248895&text=Hola%21%20Estoy%20buscando%20reservar%20un%20turno.&source=&data=&app_absent='>
                  221-6248895
                </Link>
              </li>
              <li class='c-mail'>
                <Link to='mailto:nutricionista.nicola@gmail.com'>nutricionista.nicola@gmail.com</Link>
              </li>
              <li class='c-ig'>
                <Link target='_blank' to='https://www.instagram.com/nutricion.paonicola/'>
                  nutricion.paonicola
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='contact-right'>
          <form id='formContact' className='form' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-row'>
              <div className='form-row-name'>
                <label>Nombre</label>
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
            <label>Email</label>
            <input
              className={errors.email && 'input_error'}
              placeholder='ejemplo@ejemplo.com.ar'
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

            <p>
              <label>Telefono</label>
            </p>
            <textarea
              className={errors.telefono && 'input_error'}
              type='text'
              {...register('textarea', {
                required: { value: true, message: 'Mensaje requerido' },
              })}
            />
            {errors.telefono && <span className={errors.telefono && 'span_error'}>{errors.telefono.message}</span>}
            <input type='submit' />
          </form>
        </div>
      </div>
    </>
  );
}
