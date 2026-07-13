import React from 'react'

/** Card flotante "+12 años de experiencia · +1000 pacientes" sobre la foto. */
export default function StatsCard({ stats }) {
  return (
    <div className='home-stats'>
      {stats.map((stat) => (
        <div key={stat.label} className='home-stats__item'>
          <span className='home-stats__value'>{stat.value}</span>
          <span className='home-stats__label'>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
