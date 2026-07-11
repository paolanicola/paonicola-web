import React from 'react'
import { philosophy } from '../homeContent'
import Kicker from '../ui/Kicker'
import RichText from '../ui/RichText'

export default function Philosophy() {
  return (
    <section className='home__philosophy' aria-labelledby='home-philosophy-title'>
      <div className='home__philosophy-inner'>
        <Kicker>{philosophy.kicker}</Kicker>
        <h2 id='home-philosophy-title' className='home__philosophy-title'>
          {philosophy.title}
        </h2>
        {philosophy.paragraphs.map((paragraph, i) => (
          <RichText key={i} paragraph={paragraph} />
        ))}
      </div>
    </section>
  )
}
