import React from 'react'
import { notForYou } from '../homeContent'
import DisqualifierItem from '../ui/DisqualifierItem'

export default function NotForYou() {
  return (
    <section className='home__notforyou' aria-labelledby='home-notforyou-title'>
      <div className='home__notforyou-inner'>
        <h2 id='home-notforyou-title' className='home__notforyou-title'>
          {notForYou.title}
        </h2>
        <p className='home__notforyou-subtitle'>{notForYou.subtitle}</p>
        <ul className='home__notforyou-list'>
          {notForYou.disqualifiers.map((text, i) => (
            <DisqualifierItem key={i}>{text}</DisqualifierItem>
          ))}
        </ul>
      </div>
    </section>
  )
}
