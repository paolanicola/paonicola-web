import React from 'react'
import { hero } from '../homeContent'
import heroImg from '../../../assets/images/home/paola-hero.jpg'
import RichText from '../../../components/ui/RichText'
import PillButton from '../../../components/ui/PillButton'
import WellbeingCard from '../ui/WellbeingCard'

export default function Hero() {
  return (
    <section className='home__hero' aria-labelledby='home-hero-title'>
      <div className='home__hero-copy'>
        <h1 id='home-hero-title' className='home__hero-title'>
          {hero.title}
        </h1>
        {hero.intro.map((paragraph, i) => (
          <RichText key={i} paragraph={paragraph} />
        ))}
        <div className='home__hero-actions'>
          {hero.ctas.map((cta) => (
            <PillButton key={cta.label} to={cta.to} variant={cta.variant}>
              {cta.label}
            </PillButton>
          ))}
        </div>
      </div>

      <div className='home__hero-media'>
        <div className='home__hero-image'>
          <img src={heroImg} alt={hero.imageAlt} loading='eager' />
        </div>
        <WellbeingCard {...hero.wellbeing} />
      </div>
    </section>
  )
}
