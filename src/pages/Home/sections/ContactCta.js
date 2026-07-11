import React from 'react'
import { useNavigate } from 'react-router-dom'
import { contact } from '../homeContent'
import PillButton from '../../../components/ui/PillButton'

/**
 * Home contact block. The real contact flow (with reCAPTCHA) lives on /contacto,
 * so submitting this short form routes there rather than duplicating that logic.
 */
export default function ContactCta() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(contact.submitTo)
  }

  return (
    <section className='home__contact' aria-labelledby='home-contact-title'>
      <div className='home__contact-intro'>
        <h2 id='home-contact-title' className='home__section-title'>
          {contact.title}
        </h2>
        <p className='home__contact-text'>{contact.text}</p>
      </div>

      <form className='home__contact-form' onSubmit={handleSubmit} noValidate>
        {contact.fields.map((field) => (
          <label key={field.name} className='home__field'>
            <span className='home__field-label'>{field.label}</span>
            {field.multiline ? (
              <textarea
                name={field.name}
                className='home__field-input home__field-input--area'
                rows={3}
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                className='home__field-input'
              />
            )}
          </label>
        ))}
        <PillButton type='submit' variant='solid' className='home__contact-submit'>
          {contact.submitLabel}
        </PillButton>
      </form>
    </section>
  )
}
