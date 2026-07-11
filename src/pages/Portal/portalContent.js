// Static portal content (design 8a): rotating daily phrase + mood shortcuts.

export const DAILY_PHRASES = [
  'Cuando dejás de luchar contra tu cuerpo y empezás a entenderlo, el cambio se vuelve una forma distinta de vivir.',
  'No buscamos perfección. Buscamos regulación real.',
  'Los cambios duraderos llevan tiempo y compromiso — hoy es un buen día para sostenerlos.',
  'Comer bien no es un castigo: es una forma de cuidarte.',
  'Un hábito pequeño sostenido vale más que un plan perfecto abandonado.',
  'Tu cuerpo no es tu enemigo. Es tu casa.',
  'El descanso también es parte del tratamiento.',
]

export const dailyPhrase = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((date - start) / 86400000)
  return DAILY_PHRASES[dayOfYear % DAILY_PHRASES.length]
}

// Mood chip → library category name (chips render only if the category exists)
export const MOOD_SHORTCUTS = [
  { label: 'Hoy tengo ansiedad', category: 'Ansiedad' },
  { label: 'Me cuesta organizarme', category: 'No sé por dónde empezar' },
  { label: 'No tengo ideas para cocinar', category: 'Ideas de menú' },
  { label: 'Necesito motivación', category: 'Quiero cambiar mi mentalidad' },
  { label: 'Estoy estancado/a', category: 'Quiero bajar de peso' },
  { label: 'Tengo un evento o salida', category: 'Ideas de menú' },
  { label: 'Quiero aprender sobre nutrición', category: 'Las compras / las bases' },
  { label: 'Quiero reprogramar mi mente', category: 'Quiero cambiar mi mentalidad' },
]

// Tile emoji per content type (designs 9a/19a rows)
export const TYPE_ICONS = {
  video: '▶',
  pdf: '📄',
  planilla: '📊',
  checklist: '✅',
  ejercicio: '🧘',
  recetario: '🎁',
}
