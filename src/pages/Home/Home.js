import React from 'react';
import { NavLink } from 'react-router-dom';
import Clinica from '../../assets/images/services-img/01clinica.svg';
import Deportiva from '../../assets/images/services-img/02deportiva.svg';
import Feedback from '../../assets/images/services-img/03feedback.svg';
import Bioimpedancia from '../../assets/images/services-img/04bioimpedancia.svg';

export default function Home() {
  return (
    <div className='home-container'>
      <section className='home-main'>
        <div className='home-main-container'>
          <div className='home-main-row'>
            <div className='  title-home-container  one animate fadeRight  '>
              <h1 className='home-main-title '>LOGRÁ UN ESTILO DE VIDA SALUDABLE, A TRAVÉS DE UNA PLANIFICACIÓN PROFESIONAL Y PERSONALIZADA</h1>
            </div>
          </div>
        </div>
      </section>
      <section className='home-services'>
        <div className=''>
          <h2 className=''>
            <span>Sobre mi</span>
          </h2>
        </div>
        <div className='services-items'>
          <div className='services-item-row'>
            <div className='services-item-about'>
              {
                //<%= image_tag'servicios/01clinica.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'} %>
              }
              <img className='item-img' src={Clinica} alt='Mi metodologia' title='Mi meteodologia' />

              <h5>Nutrición clínica: Educación y hábitos saludables</h5>
            </div>
          </div>
          <div className='services-item-row'>
            <div className='services-item-about'>
              {
                //<%= image_tag('servicios/02deportiva.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'}) %>
              }
              <img className='item-img' src={Deportiva} alt='Mi metodologia' title='Mi meteodologia' />
              <h5>Nutrición para el rendimiento deportivo</h5>
            </div>
          </div>
          <div className='services-item-row'>
            <div className='services-item-about'>
              {
                // <%= image_tag('servicios/03feedback.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'}) %>
              }
              <img className='item-img' src={Feedback} alt='Mi metodologia' title='Mi meteodologia' />
              <h5>Feedback continuo</h5>
            </div>{' '}
          </div>
          <div className='services-item-row'>
            <div className=' services-item-about'>
              {
                //<%= image_tag('servicios/04bioimpedancia.svg', alt: 'Nutrición clínica', data: { title:'Nutrición clínica'}) %>
              }
              <img className='item-img' src={Bioimpedancia} alt='Mi metodologia' title='Mi meteodologia' />
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
      <section className='home-shop'>
        <div class='container'>
          <div class='row'>
            <div class=' text-center'>
              <h2 class='title-section-card title-section-card-rosa'>Tienda</h2>
            </div>
          </div>
          <div class=' container-menu-tienda'>
            <div class=''>
              <div class=''>
                <div class=' text-center item-tienda-home'>
                  <a href='' class='item-tienda-home-mosaicos item'>
                    <h4>MOSAICOS CON IDEAS DE MENÚES</h4>
                  </a>
                </div>
                <div class=' text-center item-tienda-home'>
                  <a href='' class='item-tienda-home-pack item'>
                    <h4>PACK AHORRO</h4>
                  </a>
                </div>
                <div class='text-center item-tienda-home'>
                  <a href='' class='item-tienda-home-recetarios item'>
                    <h4>RECETARIOS</h4>
                  </a>
                </div>
                <div class=' text-center item-tienda-home'>
                  <a href='' class='item-tienda-home-guias item'>
                    <h4>GUÍAS</h4>
                  </a>
                </div>
              </div>
            </div>
            <div class=''>
              <div class='row'>
                <div class=' text-center item-tienda-home-lg'>
                  <a href='' class='item-tienda-home-consultas item'>
                    <h3>Consultas online</h3>
                  </a>
                </div>
              </div>
            </div>
            <div class=' text-center'>
              <a href='' class=''>
                Ir a la tienda
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className='home-changes'>
        <h2 className=''>Transformaciones</h2>
      </section>
    </div>
  );
}
