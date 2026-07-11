// Landing copy for the flagship product pages (designs 12a, 17a, 21a).
// Keyed by product-name slug prefix; price/promo/CTA always come from the API
// product, so Paola can retouch prices in the admin without code changes.
// Products without an entry fall back to a generic detail layout.

export const slugify = (name) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const LANDINGS = {
  'kit-rendimiento-inteligente': {
    kicker: 'Kit · Deporte',
    headline: 'Entrenás fuerte. Pero si tu nutrición no acompaña, tu rendimiento tiene un techo.',
    tagline: 'Más energía · Más foco · Mejores resultados.',
    signalsIntro: 'Sentís que entrenás con ganas pero…',
    signals: [
      'Te falta energía durante tus entrenamientos.',
      'Te cuesta recuperarte después de entrenar.',
      'No sabés si estás llegando a la proteína que necesitás.',
      'Terminás improvisando tus comidas y eso afecta tus resultados.',
    ],
    philosophy: [
      { text: 'El problema no es tu esfuerzo.', lead: true },
      { text: 'El problema es que quizás tu alimentación todavía no está trabajando a favor de tu objetivo.' },
      { text: 'El Kit Rendimiento Inteligente es una herramienta práctica para ordenar tu nutrición deportiva y aprender a comer estratégicamente para mejorar tu desempeño.' },
    ],
    checklist: {
      title: 'Vas a aprender',
      items: [
        'Qué comer antes y después de entrenar para rendir mejor',
        'Cuánta proteína necesitás según tu objetivo',
        'Cómo acompañar tu recuperación',
        'Cómo organizar tus comidas sin vivir improvisando',
      ],
    },
    includes: {
      title: 'Incluye',
      items: [
        { icon: '🔥', text: 'Mini guía de Timing Nutricional — qué comer antes y después del entrenamiento' },
        { icon: '🔥', text: 'Planilla de cálculo personalizado de proteínas' },
        { icon: '🔥', text: 'Checklist de recuperación post entrenamiento' },
        { icon: '🎁', text: 'Bonus 1: Recetario proteico práctico' },
        { icon: '🎁', text: 'Bonus 2: Menú semanal ejemplo' },
      ],
      footer: 'No es una dieta. No es comer más por comer. Es aprender a usar la nutrición como una herramienta para potenciar tu rendimiento.',
    },
    purchase: {
      badge: '🔥 Lanzamiento especial',
      cta: 'Agregar al carrito',
    },
  },

  'kit-regula': {
    kicker: 'Kit · Ansiedad',
    headline: '7 días para regular tu sistema nervioso y salir del modo alerta.',
    tagline: 'Menos ansiedad. Más estabilidad.',
    intro: [
      { text: 'El Kit Regula es un sistema práctico de 7 días diseñado para calmar tu sistema nervioso y cortar el ciclo: ansiedad → impulso → culpa → restricción.', strong: true },
      { text: 'Si picoteás todo el día, comés por impulso o sentís que la ansiedad maneja tu alimentación, no te falta fuerza de voluntad. Lo que te falta es aprender a regular.' },
      { text: 'No es una dieta. No es contar calorías. No es empezar de cero cada lunes. Es enseñarle a tu cuerpo que no está en peligro.' },
    ],
    checklist: {
      title: 'En solo 7 días vas a empezar a...',
      navy: true,
      items: [
        'Frenar el impulso antes de que aparezca',
        'Entender qué te dispara la ansiedad',
        'Comer con más calma, sin culpa',
        'Sentirte más liviana y menos inflamada',
        'Salir del loop de descontrol y empezar a regularte',
      ],
      footer: 'No buscamos perfección. Buscamos regulación real.',
    },
    includes: {
      title: 'Qué incluye',
      items: [
        { icon: '🎥', text: 'Video de bienvenida y explicación del proceso' },
        { icon: '📄', text: 'Radiografía de tu Sistema en Alerta' },
        { icon: '🎥', text: 'Videos grabados — plan de 7 días' },
        { icon: '🎁', text: 'Bonus: ejemplos de comidas reguladoras del sistema nervioso' },
        { icon: '🎁', text: 'Bonus: ideas para momentos de ansiedad' },
      ],
    },
    purchase: {
      tagline: '7 días para empezar a regular tu ansiedad con la comida.',
      cta: 'Agregar al carrito',
    },
  },

  'metodo-regula': {
    kicker: 'Programa 1 a 1 · 12 semanas',
    headline: '¿Sentís que hacés un esfuerzo constante por comer mejor, pero igual volvés a los mismos patrones?',
    signals: [
      'Empezás con ganas y te cuesta sostener los hábitos.',
      'Comés por ansiedad, estrés o impulso aunque sabés lo que deberías hacer.',
      'Vivís inflamado/a, cansado/a o con poca energía.',
      'Sentís que tu cuerpo no responde como esperás.',
      'Te frustrás porque probaste muchas cosas y nada parece durar.',
    ],
    philosophy: [
      { text: 'El problema no es la falta de voluntad.', lead: true },
      { text: 'La mayoría de las veces no necesitás más información sobre alimentación.' },
      { text: 'Necesitás aprender a trabajar con tu cuerpo, regular tu sistema, construir hábitos sostenibles y dejar de vivir en una lucha constante con la comida.' },
      { text: 'Por eso creé Método Regula.', lead: true },
      { text: 'Un acompañamiento personalizado de 12 semanas donde trabajamos de forma integral sobre alimentación, hábitos, inflamación, estrés, suplementación y bienestar.' },
    ],
    afterPhilosophy: [
      { text: 'No se trata de seguir un plan perfecto, sino de construir una forma de alimentarte que puedas sostener en tu vida real.' },
      { text: 'El objetivo no es que dependas de una dieta — es que recuperes energía, claridad, confianza y herramientas para sentirte bien de manera sostenible.', strong: true },
      { text: 'Este proceso es para vos si estás listo/a para dejar de empezar de nuevo cada lunes y comprometerte con cambios reales.' },
    ],
    checklist: {
      title: 'Qué incluye',
      items: [
        'Plan de alimentación personalizado',
        'Controles periódicos: 2 encuentros por mes (6 en total)',
        'Acompañamiento directo por WhatsApp',
        'Acceso completo a la biblioteca de material',
        'Trabajo específico de objetivos',
      ],
    },
    purchase: {
      badge: 'Cupos limitados',
      cta: 'Empezar Método Regula',
      note: 'Después de comprar, coordinamos tu turno por WhatsApp',
    },
  },
}

// Longest keys first so 'kit-regula' never shadows 'kit-rendimiento-…'.
const KEYS = Object.keys(LANDINGS).sort((a, b) => b.length - a.length)

export function getLanding(productName) {
  if (!productName) return null
  const slug = slugify(productName)
  const key = KEYS.find((k) => slug.startsWith(k))
  return key ? LANDINGS[key] : null
}

export default LANDINGS
