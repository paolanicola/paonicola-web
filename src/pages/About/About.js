import React, { useEffect, useState } from 'react'
import laboratorio from '../../assets/images/sobre-mi/01laboratorio.svg'
import metodologia from '../../assets/images/sobre-mi/02metodologia.svg'
import planes from '../../assets/images/sobre-mi/03planes.svg'
import honestidad from '../../assets/images/sobre-mi/04honestidad.svg'
import tic from '../../assets/images/sobre-mi/tic.svg'

export default function About() {
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.screen.width < 700) {
        if (window.scrollY >= 1200) {
          setAnimate(true)
        } else {
          setAnimate(false)
        }
      } else {
        if (window.scrollY >= 1100) {
          setAnimate(true)
        } else {
          setAnimate(false)
        }
      }
    })
    return () => {
      window.removeEventListener('scroll', () => {
        if (window.scrollY >= 1300) {
          setAnimate(true)
        } else {
          setAnimate(false)
        }
      })
    }
  })
  return (
    <>
      <div className='container-about'>
        <div className='fondo'>
          <div className='about-column'>
            <div className='about-row about-row-t'>
              <div className='about-row-text'>
                <h5 className='about-text'>
                  Soy Paola Nicola. Nací en Chacabuco, Pcia. De Bs As, y
                  actualmente vivo en La Plata.
                  <br />
                  <br />
                  Me recibí en 2015 obteniendo el título de Licenciada en
                  Nutrición, MP 3268
                </h5>
              </div>
              <div className='about-row-text'>
                <h5 className='about-text'>
                  Realicé varias capacitaciones, cursos y asistí a congresos.{' '}
                  <br />
                  <br />
                  Los últimos perfeccionamientos fueron del la mano del
                  referente más grande en Nutrición deportiva, Francis Holway.
                </h5>
              </div>
            </div>
            <div className='text-center-1'>
              <a
                href='../../../public/packs/media/documents/CV_Paola_Nicola.pdf'
                className='link-underlined'
              >
                MI CURRÍCULUM
              </a>
            </div>
          </div>
          <div className='about-t '>
            <div className='about-row'>
              <div className='item-sobre-mi'>
                <img
                  className='item-img'
                  src={metodologia}
                  alt='Mi metodologia'
                  title='Mi meteodologia'
                />
                <div className=''>
                  <h4 className='link-underlined'>Mi metodología</h4>
                </div>
                <div>
                  <p>
                    A través de distintas herramientas nutricionales te ayudaré
                    a lograr tu objetivo.
                  </p>
                </div>
              </div>
              <div className=' item-sobre-mi'>
                <img
                  className='item-img'
                  src={planes}
                  alt='Mi metodologia'
                  title='Mi meteodologia'
                />
                <div>
                  <h4 className='link-underlined'>Acerca de mis planes</h4>
                </div>
                <div>
                  <p>Todos mis planes son 100% personalizados.</p>
                </div>
              </div>
            </div>
            <div className='about-row '>
              <div className='item-sobre-mi'>
                <img
                  className='item-img'
                  src={laboratorio}
                  alt='Mi metodologia'
                  title='Mi meteodologia'
                />
                <div className=''>
                  <h4 className='link-underlined'>Trabajo en Laboratorio</h4>
                </div>
                <div>
                  <p>
                    Realizo análisis fisicoquímicos en los alimentos: materia
                    grasa, proteínas, hidratos, colorantes, cenizas, humedad,
                    acidez. Todos estos datos conforman la tabla nutricional de
                    los alimentos (rótulos alimentarios).
                  </p>
                </div>
              </div>
              <div className='item-sobre-mi'>
                <img
                  className='item-img'
                  src={honestidad}
                  alt='Mi metodologia'
                  title='Mi meteodologia'
                />
                <div>
                  <h4 className='link-underlined'>Honestidad y confianza</h4>
                </div>
                <div>
                  <p>
                    Necesito que seas 100 % honesto y sigas las pautas que te
                    voy a dar al pie de la letra, sino mi trabajo es en vano y
                    todo tu progreso se verá comprometido. ﻿El éxito depende
                    solo de vos, de tu compromiso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='deporte'></div>

        <div className=''>
          <div className='ayuda text-center'>
            <h2 className='text-center'>Te puedo ayudar a:</h2>
            <div className='lista-ayuda'>
              <ul
                className={
                  animate ? 'two animate fadeLeft' : 'two animate fadeOut'
                }
              >
                <li>
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Disminuir grasa y peso corporal
                </li>
                <li
                  className={
                    animate ? 'three animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Mejorar hábitos alimentarios
                </li>
                <li
                  className={
                    animate ? 'four animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Aumentar masa muscula
                </li>
                <li
                  className={
                    animate ? 'five animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Mejorar el rendimiento deportivo
                </li>
                <li
                  className={
                    animate ? 'six animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Mejorar el perfil lipídico (grasas)
                </li>
              </ul>
              <ul
                className={
                  animate ? 'two animate fadeLeft ' : 'two animate fadeOut '
                }
              >
                <li
                  className={
                    animate ? 'three animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Aumentar los niveles de hierro
                </li>
                <li>
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Planificar una alimentación vegetariana.
                </li>
                <li
                  className={
                    animate ? 'four animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Mejorar glucemias
                </li>
                <li
                  className={
                    animate ? 'five animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Mejorar la calidad de nutrientes en embarazo
                </li>
                <li
                  className={
                    animate ? 'six animate fadeIn' : 'two animate fadeOut'
                  }
                >
                  <img
                    className='item-img-tic'
                    src={tic}
                    alt='Mi metodologia'
                    title='Mi meteodologia'
                  />
                  Otras.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
