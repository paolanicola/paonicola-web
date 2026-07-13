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
      cta: 'Comprar',
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
      cta: 'Comprar',
    },
  },

  'metodo-regula': {
    kicker: 'Programa 1 a 1 · 12 semanas',
    headline: '¿Sentís que hacés un esfuerzo constante por comer mejor, pero igual volvés a los mismos patrones?',
    heroBadge: 'Cupos limitados',
    heroCta: 'Empezar Método Regula',
    heroNote: 'Elegís fecha y hora de tu primer encuentro al comprar',
    signalsIntro: 'Te suena…',
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
    includesCards: {
      title: 'Qué incluye',
      items: [
        { title: 'Plan de alimentación personalizado', detail: 'Armado sobre tu vida real: horarios, gustos, entrenamiento y objetivos.' },
        { title: 'Controles cada 15 días', detail: '6 encuentros individuales durante las 12 semanas para ajustar el plan.' },
        { title: 'Acompañamiento por WhatsApp', detail: 'Contacto directo con Paola entre encuentros para dudas del día a día.' },
        { title: 'Biblioteca completa de material', detail: 'Acceso total a recetarios, guías y recursos del portal durante el programa.' },
        { title: 'Trabajo específico de objetivos', detail: 'Inflamación, energía, ansiedad con la comida, suplementación y bienestar.' },
      ],
    },
    testimonials: {
      kicker: 'Cambios reales',
      title: 'Lo que cuentan las que ya pasaron por el proceso',
      items: [
        { quote: 'Cambié mi relación con la comida sin sacrificar lo que me gusta.', name: 'J. M.' },
        { quote: 'Encontré un plan que se adapta a mi rutina de entrenamiento.', name: 'L. R.' },
        { quote: 'Bajé de peso sin pasar hambre ni prohibiciones.', name: 'D. S.' },
      ],
    },
    faqs: [
      { q: '¿Cómo son los encuentros?', a: 'Videollamadas individuales de seguimiento cada 15 días (6 en total durante las 12 semanas), más acompañamiento directo por WhatsApp entre encuentros.' },
      { q: '¿Qué pasa si no puedo asistir a un control?', a: 'Lo reprogramamos dentro de la misma quincena. Los encuentros se coordinan directamente con Paola por WhatsApp.' },
      { q: '¿Cuándo empiezo?', a: 'Al comprar elegís fecha y hora de tu primer encuentro, generalmente dentro de la misma semana. Después te escribimos por WhatsApp para darte la bienvenida.' },
      { q: '¿Cómo pago?', a: 'Pago único a través de Mercado Pago (tarjeta, débito o dinero en cuenta). Si residís en el exterior, escribinos por WhatsApp.' },
    ],
    closing: {
      badge: 'Cupos limitados',
      title: '12 semanas para dejar de empezar de nuevo cada lunes.',
      cta: 'Empezar Método Regula',
      note: 'Elegís tu primer turno al comprar',
    },
    sticky: true,
    purchase: null,
  },

  'programa-grupal-regula': {
    kicker: 'Programa grupal · 4 semanas · Regulá tu alimentación, tu estrés y tu energía',
    headline: 'Dejá de vivir en piloto automático, picoteando por ansiedad, agotada y empezando de nuevo cada lunes.',
    subheadline: 'Un programa grupal para mujeres que saben qué hacer para alimentarse mejor, pero el estrés, la ansiedad y el ritmo de vida terminan saboteando sus hábitos.',
    heroBadge: 'Precio especial primera edición',
    heroCta: 'Sumarme al grupal',
    heroNote: 'Primera edición · cupos limitados',
    philosophy: [
      { text: 'Porque muchas veces el problema no es la comida.', lead: true },
      { text: 'Es todo lo que pasa alrededor de la comida.', lead: true, accent: true },
    ],
    checklist: {
      title: 'Este programa es para vos si…',
      items: [
        'Sentís que el estrés influye en cómo comés.',
        'Picoteás, comés por ansiedad o terminás el día buscando comida como refugio.',
        'Te cuesta sostener hábitos saludables.',
        'Vivís cansada, acelerada o desconectada de tus necesidades.',
        'Querés aprender a regularte sin recurrir a dietas extremas.',
        'Buscás herramientas prácticas para sentirte mejor física y mentalmente.',
      ],
    },
    includes: {
      title: 'Qué incluye',
      items: [
        { icon: '✓', text: '4 encuentros grupales en vivo' },
        { icon: '✓', text: 'Material de trabajo y ejercicios' },
        { icon: '✓', text: 'Recursos de regulación emocional y gestión del estrés' },
        { icon: '✓', text: 'Grupo de acompañamiento durante las 4 semanas' },
        { icon: '✓', text: 'Grabaciones disponibles' },
      ],
      crossLink: {
        text: '¿Buscás acompañamiento individual y a tu medida?',
        cta: 'Conocé el Método Regula 1:1 →',
        productSlug: 'metodo-regula',
      },
    },
    closing: {
      badge: 'Precio especial primera edición',
      title: 'No necesitás más información. Necesitás aprender a sostener lo que ya sabés.',
      cta: 'Sumarme al grupal',
    },
    purchase: null,
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
