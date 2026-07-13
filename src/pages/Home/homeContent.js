// Content for the redesigned Home page (design: "Rediseño Home" — Turno 6 / 6a).
// Copy lives here, separate from presentation, so sections stay small and data-driven.

// A paragraph is a list of inline segments so we can bold parts of a sentence.
// `variant: 'lead'` renders the emphasized navy paragraphs from the design.
const p = (text) => ({ variant: 'body', segments: [{ text }] })
const lead = (text) => ({ variant: 'lead', segments: [{ text }] })

export const hero = {
  title: 'Si buscás una dieta más, este espacio no es para vos.',
  intro: [
    p(
      'Si esperás entrar, recibir una hoja con un menú y volver a verte en un mes, probablemente no sea el acompañamiento que te voy a dar.'
    ),
    p(
      'Creé un programa porque nunca creí que una consulta de 15 minutos pudiera generar un cambio real. Acá nos tomamos el tiempo para entender qué te pasa, construir hábitos que puedas sostener y acompañarte durante el proceso.'
    ),
    lead('No solo vas a aprender sobre nutrición.'),
    p(
      'Vas a desarrollar herramientas para gestionar el estrés, la ansiedad, mejorar tu relación con la comida y construir hábitos que puedas sostener a largo plazo.'
    ),
    {
      variant: 'body',
      segments: [
        { text: 'Además, vas a contar con ' },
        { text: 'mi acompañamiento por WhatsApp', bold: true },
        {
          text: ' para que no tengas que atravesar el proceso en soledad. Por eso ',
        },
        {
          text: 'prefiero acompañar a pocas personas con profundidad antes que atender a muchas',
          bold: true,
        },
        { text: ' ' },
        { text: 'sin generar resultados', bold: true },
        { text: '.' },
      ],
    },
  ],
  ctas: [
    { label: 'Reservar consulta', to: '/tienda', variant: 'solid' },
    { label: 'Hablar con Paola', to: '/contacto', variant: 'outline' },
  ],
  // card flotante sobre la foto (design 6a)
  stats: [
    { value: '+12', label: 'años de experiencia' },
    { value: '+1000', label: 'pacientes' },
  ],
  imageAlt: 'Paola Nicola, nutricionista',
}

export const testimonials = [
  {
    id: 'julieta',
    paragraphs: [
      'Había pasado por varias nutricionistas y siempre era lo mismo: una hoja con indicaciones, un control al mes y sentir que tenía que arreglármelas sola. Con Pao fue completamente distinto.',
      'Nunca sentí que era "una paciente más". Me sentí escuchada, contenida y acompañada durante todo el proceso. Y creo que eso fue una de las claves para poder sostener los cambios.',
    ],
    author: 'Julieta R.',
  },
  {
    id: 'martin',
    paragraphs: [
      'Lo que más me hizo decidirme fue que el programa fuera online. Con mis horarios de trabajo era imposible comprometerme con consultas presenciales y pensé que eso iba a ser un obstáculo. Al final fue todo lo contrario.',
      'No hablamos solamente de alimentación, también de qué te pasa y qué emociones aparecen. Sentí que por primera vez alguien miraba el panorama completo y no solo lo que había en mi plato.',
    ],
    author: 'Martín D.',
  },
  {
    id: 'sofia',
    paragraphs: [
      'Llegué a Pao pensando que solo necesitaba aprender a comer mejor, pero el cambio fue mucho más profundo de lo que imaginaba. Aprendí a escucharme, a dejar de exigirme tanto y a entender qué había detrás de muchas de mis conductas con la comida.',
      'Siento que no solo cambié hábitos, cambié mi manera de vivir la alimentación. Y eso, para mí, no tiene precio.',
    ],
    author: 'Sofía P.',
  },
]

export const notForYou = {
  title: 'Este espacio fue creado para personas que quieren un cambio real.',
  subtitle: 'Por eso, quizás no sea para vos si...',
  disqualifiers: [
    'Preferís una dieta antes que aprender a construir hábitos sostenibles.',
    'Buscás resultados inmediatos, sin comprender que los cambios duraderos llevan tiempo y compromiso.',
    'No querés involucrarte activamente en tu proceso.',
    'No valorás el acompañamiento personalizado y el seguimiento entre consultas.',
    'No estás dispuesto/a a invertir tiempo, energía y recursos en tu bienestar.',
  ],
}

export const philosophy = {
  kicker: 'Por qué acompaño de esta manera',
  title: 'Este programa nació mucho antes de existir.',
  paragraphs: [
    p(
      'Durante mucho tiempo viví acelerada. Tenía varios trabajos, siempre estaba haciendo algo, pensando en lo que seguía o preocupándome por el futuro. Creía que podía con todo... hasta que mi cuerpo me mostró que no.'
    ),
    p(
      'En un viaje por Asia tuve un ataque de pánico que marcó un antes y un después en mi vida. Fue la forma que encontró mi cuerpo de decirme: "basta, necesito que me escuches."'
    ),
    p(
      'A partir de ese momento empecé un camino muy profundo para entender qué me estaba pasando. Descubrí que muchas veces el problema no está solo en la alimentación, sino en cómo vivimos: el estrés constante, la ansiedad, la autoexigencia, la falta de descanso y la desconexión con nuestro propio cuerpo.'
    ),
    p(
      'Esa búsqueda me llevó a especializarme en neurociencias y salud integrativa. Quería comprender qué ocurría en nuestro cerebro y en nuestro sistema nervioso para poder acompañar a otras personas desde un lugar mucho más profundo que un simple plan de alimentación.'
    ),
    p(
      'También disfruto mucho hacer deporte. Entrenar forma parte de mi estilo de vida. Por eso también acompaño a personas que desean recuperar su bienestar como a deportistas recreacionales y competidores que buscan mejorar su rendimiento. En ambos casos, mi mirada es la misma: la alimentación importa, pero los resultados sostenibles también dependen del descanso, el manejo del estrés, los hábitos y la relación que construimos con nuestro cuerpo.'
    ),
    p(
      'Con el tiempo elegí mudarme al sur buscando una vida más tranquila. Y aunque el paisaje ayuda, aprendí que la verdadera paz no depende del lugar donde vivís, sino de cómo aprendés a habitarte por dentro.'
    ),
    lead(
      'Hoy ese aprendizaje es la base de todo lo que hago. Porque sé que cuando dejás de luchar contra tu cuerpo y empezás a entenderlo, el cambio deja de sentirse como un esfuerzo constante y se transforma en una forma distinta de vivir.'
    ),
  ],
}

export const contact = {
  title: 'Contacto',
  text: 'Escribime y te asesoro qué servicio es el más adecuado para vos.',
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', multiline: false },
    { name: 'email', label: 'Email', type: 'email', multiline: false },
    { name: 'mensaje', label: 'Mensaje', type: 'text', multiline: true },
  ],
  submitLabel: 'Enviar mensaje',
  submitTo: '/contacto',
}
