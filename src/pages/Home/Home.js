import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Clinica from '../../assets/images/services-img/01clinica.svg'
import Deportiva from '../../assets/images/services-img/02deportiva.svg'
import Feedback from '../../assets/images/services-img/03feedback.svg'
import ConsultasOnline from '../../assets/images/services-img/04consultas-online.svg'

export default function Home() {
  return (
    <div className='home-container'>
      <section className='home-main '>
        <div className='home-main-container '>
          <div className='home-main-row'>
            <div className='  title-home-containers one animate fadeRight'>
              <h1 className='home-main-title '>
                LOGRÁ UN ESTILO DE VIDA SALUDABLE, A TRAVÉS DE UNA PLANIFICACIÓN PROFESIONAL Y
                PERSONALIZADA
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className='home-services'>
        <div className='services-title'>
          <h2 className=''>Sobre mi</h2>
        </div>
        <div className='services-items'>
          <div className='services-item-row'>
            <div className='services-item-about'>
              {
                //<%= image_tag'servicios/01clinica.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'} %>
              }
              <img
                className='item-img'
                src={Clinica}
                alt='Mi metodologia'
                title='Mi meteodologia'
              />

              <h5>Nutrición clínica: Educación y hábitos saludables</h5>
            </div>
          </div>
          <div className='services-item-row'>
            <div className='services-item-about'>
              {
                //<%= image_tag('servicios/02deportiva.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'}) %>
              }
              <img
                className='item-img'
                src={Deportiva}
                alt='Mi metodologia'
                title='Mi meteodologia'
              />
              <h5>Nutrición para el rendimiento deportivo</h5>
            </div>
          </div>
          <div className='services-item-row'>
            <div className='services-item-about'>
              {
                // <%= image_tag('servicios/03feedback.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'}) %>
              }
              <img
                className='item-img'
                src={Feedback}
                alt='Mi metodologia'
                title='Mi meteodologia'
              />
              <h5>Feedback continuo</h5>
            </div>
          </div>
          <div className='services-item-row'>
            <div className=' services-item-about'>
              {
                //<%= image_tag('servicios/04bioimpedancia.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'}) %>
              }
              <img
                className='item-img'
                src={ConsultasOnline}
                alt='Mi metodologia'
                title='Mi meteodologia'
              />
              <h5>Consultas Online</h5>
            </div>
          </div>
        </div>
        <div className='services-button-container '>
          <div className='container-btn-sobre-mi '>
            {
              //<%= link_to 'sobre-mi', {class: 'btn btn-primary btn-md' } do %>Más sobre mi<% end %>
            }
            <NavLink to='/sobre-mi' className=' btt'>
              Mas sobre mi
            </NavLink>
          </div>
        </div>
      </section>
      <section className='home-shop '>
        <div className='shop-container'>
          <div clclassNameass='shop-container-title-top'>
            <div className=' '>
              <h2 className='title-section-card title-section-card-rosa'>Tienda</h2>
            </div>
          </div>
          <div className='shop-container-menu-tienda'>
            <div className='menu-top'>
              <div className='menu-top-grid '>
                <div className='item-tienda-home '>
                  <NavLink to='/tienda' className='item-tienda-home-mosaicos item'>
                    <h4 className='item-shop-title'>MOSAICOS CON IDEAS DE MENÚES</h4>
                  </NavLink>
                </div>
                <div className='  item-tienda-home'>
                  <NavLink to='/tienda' className='item-tienda-home-pack item'>
                    <h4 className='item-shop-title'>PACK AHORRO</h4>
                  </NavLink>
                </div>
                <div className='  item-tienda-home'>
                  <NavLink to='/tienda' className='item-tienda-home-recetarios item'>
                    <h4 className='item-shop-title'>RECETARIOS</h4>
                  </NavLink>
                </div>
                <div className='  item-tienda-home'>
                  <NavLink to='/tienda' className='item-tienda-home-guias item'>
                    <h4 className='item-shop-title'>GUÍAS</h4>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className='menu-mid'>
              <div className='menu-mid-grid'>
                <div className='item-tienda-home-lg'>
                  <NavLink to='/tienda' className='item-tienda-home-consultas item'>
                    <h3 className='item-shop-title-h3'>Consultas online</h3>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className='shop-botton-link '>
            <Link to='/tienda' className='shop-button-go'>
              Ir a la tienda
            </Link>
          </div>
        </div>
      </section>
      <section className='home-changes'>
        <div className='h2'>
          <h2 className='transformaciones'>Transformaciones</h2>
          <NavLink className='botontransfo' to='/cambios-reales'>
            Ver casos reales
          </NavLink>
        </div>
      </section>
      <div class='flores-faq'></div>
      <section className='home-faq'>
        <div className=''>
          <div className='faq-container'>
            <div className=' faq-text-top'>
              <h2 className='title-section-card-b title-section-card-gris'>
                ¿Tenés dudas o consultas?
              </h2>
              <h3>Visitá nuestras preguntas frecuentes</h3>
            </div>
            <div className='faq-container-button '>
              <NavLink to='/faq' className='button-faq'>
                Ir a FAQ
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
