import React from 'react'
import Hero from './sections/Hero'
import Testimonials from './sections/Testimonials'
import NotForYou from './sections/NotForYou'
import Philosophy from './sections/Philosophy'
import ContactCta from './sections/ContactCta'

// Container: composes the redesigned Home from small, single-responsibility
// sections. Global chrome (Header / Footer / SectionFooter) is provided by App.
export default function Home() {
  return (
    <main className='home'>
      <Hero />
      <Testimonials />
      <NotForYou />
      <Philosophy />
      <ContactCta />
    </main>
  )
}
