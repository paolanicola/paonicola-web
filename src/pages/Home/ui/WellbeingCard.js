import React from 'react'

/** Floating "Bienestar 92" stat card overlapping the hero image. */
export default function WellbeingCard({ score, label, bars }) {
  return (
    <div className='home-wellbeing' aria-hidden='true'>
      <div className='home-wellbeing__head'>
        <span className='home-wellbeing__score'>{score}</span>
        <span className='home-wellbeing__label'>{label}</span>
      </div>
      <div className='home-wellbeing__bars'>
        {bars.map((bar, i) => (
          <div key={i} className={`home-wellbeing__track home-wellbeing__track--${bar.tone}`}>
            <div
              className={`home-wellbeing__fill home-wellbeing__fill--${bar.tone}`}
              style={{ width: `${bar.width}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
