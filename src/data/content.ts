/**
 * Contenido de todas las secciones del portafolio.
 * Edita libremente: los componentes se adaptan a la cantidad de elementos.
 */

/* ---------------------------------------------------------------- Sobre mí */

export const aboutParagraphs = [
  'Soy de Ayacucho y estudio **Ingeniería de Sistemas de Información**. Empecé en 2022 y voy por el décimo ciclo, así que buena parte de lo que sé viene de construir cosas mientras las estudio.',
  'Me dedico sobre todo a dos frentes: **páginas web** y **aplicaciones Android nativas** en Kotlin. Me gusta llevar un proyecto de punta a punta —modelo de datos, backend, interfaz y hasta el logo— porque así entiendo cada decisión que hay detrás.',
]

export const traits = [
  {
    icon: 'brain',
    title: 'Aprendizaje aplicado',
    body: 'Cada cosa que estudio termina en un proyecto real. Es la única forma en que se me queda.',
  },
  {
    icon: 'layers',
    title: 'De punta a punta',
    body: 'Base de datos, backend, interfaz e identidad visual. Prefiero entender el conjunto.',
  },
  {
    icon: 'users',
    title: 'Trabajo con Scrum',
    body: 'Iteraciones cortas, tareas visibles y entregas frecuentes en lugar de un gran final.',
  },
  {
    icon: 'book',
    title: 'La IA como herramienta',
    body: 'Uso IA para acelerar, no para sustituir el criterio. Reviso y entiendo todo lo que entrego.',
  },
]

/* ----------------------------------------------------------------- Skills */

export type SkillGroup = {
  id: string
  title: string
  note: string
  skills: { name: string; level: number }[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Lenguajes & Backend',
    note: 'El motor',
    skills: [
      { name: 'Java', level: 65 },
      { name: 'Spring Boot', level: 68 },
      { name: 'Python', level: 45 },
      { name: 'TypeScript', level: 70 },
    ],
  },
  {
    id: 'apps',
    title: 'Web & Android',
    note: 'La superficie',
    skills: [
      { name: 'Kotlin', level: 82 },
      { name: 'Android Studio', level: 80 },
      { name: 'HTML5 / CSS3', level: 75 },
      { name: 'JavaScript', level: 68 },
    ],
  },
  {
    id: 'datos',
    title: 'Bases de datos',
    note: 'La memoria',
    skills: [
      { name: 'PostgreSQL', level: 82 },
      { name: 'MySQL', level: 80 },
      { name: 'Supabase', level: 75 },
    ],
  },
  {
    id: 'tools',
    title: 'Herramientas & Método',
    note: 'El taller',
    skills: [
      { name: 'Git / GitHub', level: 65 },
      { name: 'VS Code', level: 88 },
      { name: 'Inkscape', level: 80 },
      { name: 'Scrum', level: 65 },
    ],
  },
]

/* -------------------------------------------------------------- Servicios */

export const services = [
  {
    icon: 'code',
    title: 'Páginas web',
    body: 'Sitios y aplicaciones web a medida, desde la landing hasta el panel de administración, con su base de datos detrás.',
    deliverables: ['Sitio desplegado', 'Base de datos', 'Código en GitHub'],
  },
  {
    icon: 'smartphone',
    title: 'Apps Android nativas',
    body: 'Aplicaciones para Android desarrolladas en Kotlin con Android Studio, no envoltorios de una web.',
    deliverables: ['APK firmado', 'Código fuente', 'Guía de uso'],
  },
  {
    icon: 'database',
    title: 'Bases de datos',
    body: 'Diseño del modelo, normalización y consultas en PostgreSQL, MySQL o Supabase según lo que pida el proyecto.',
    deliverables: ['Diagrama E-R', 'Scripts SQL', 'Datos de prueba'],
  },
  {
    icon: 'palette',
    title: 'Identidad visual',
    body: 'Logotipos vectoriales en Inkscape, listos para escalar a cualquier tamaño sin perder calidad.',
    deliverables: ['Logo en SVG', 'Versiones PNG', 'Paleta de color'],
  },
]

/* -------------------------------------------------------------- Proyectos */

export type ProjectCategory = 'Web' | 'App' | 'Escritorio'

/** Captura de pantalla del proyecto, servida desde `public/`. */
export type ProjectShot = { src: string; alt: string }

export type Project = {
  id: string
  draft: string
  category: ProjectCategory
  title: string
  summary: string
  description: string
  stack: string[]
  highlights: string[]
  /** Diagrama de respaldo: sólo se dibuja si el proyecto no tiene capturas. */
  diagram: 'stack' | 'flow' | 'grid'
  /** Si hay capturas reales, sustituyen al diagrama en la tarjeta. */
  shots?: ProjectShot[]
  featured: boolean
  links: { demo?: string; download?: string; source?: string; docs?: string }
}

export const projects: Project[] = [
  {
    id: 'printbatch',
    draft: 'Borrador #01',
    category: 'Escritorio',
    title: 'PrintBatch',
    summary:
      'Aplicación de escritorio para Windows que imprime libretas en PDF por lotes y las alinea sola para el dúplex.',
    description:
      'Recorre una carpeta buscando PDFs, los lista con su número de páginas y los envía a la impresora en cola, con barra de progreso y controles de iniciar, pausar y detener. La pieza clave es la alineación automática a doble cara: a las libretas con páginas impares les añade una hoja en blanco, de modo que ninguna acabe compartiendo hoja con la del siguiente alumno. Todo el proceso ocurre en la máquina; no sale ningún dato fuera.',
    stack: ['Python', 'customtkinter', 'pypdf', 'pywin32', 'PyInstaller'],
    highlights: [
      'Alineación automática para impresión a doble cara',
      'Detecta las impresoras del sistema y abre su configuración nativa',
      'Impresión silenciosa vía SumatraPDF cuando está instalado',
      'Se pausa sola y avisa si la impresora da error',
      'Instalador de Windows que no pide permisos de administrador',
    ],
    diagram: 'flow',
    shots: [
      {
        src: '/assets/Escritorio/PantallaPrincipal.png',
        alt: 'Ventana principal de PrintBatch: selector de carpeta raíz, elección de impresora, casilla de alineación a doble cara, tabla de libretas con nombre, ruta, páginas y estado, y los botones de iniciar, pausar y detener.',
      },
    ],
    featured: true,
    links: {
      download: 'https://github.com/LuisKinnDC/PrintBatch/releases/tag/v1.0',
      source: 'https://github.com/LuisKinnDC/PrintBatch',
    },
  },

  /*
   * TODO — REEMPLAZA LOS TRES SIGUIENTES POR PROYECTOS REALES.
   *
   * Son plantillas armadas con tu stack, no trabajos que hayas hecho. Cambia
   * título, descripción, logros y enlaces, o bórralos: la rejilla y los filtros
   * se adaptan solos a la cantidad de elementos que quede.
   */
  {
    id: 'proyecto-web-1',
    draft: 'Borrador #02',
    category: 'Web',
    title: 'Sistema de gestión web',
    summary: 'Aplicación web con panel de administración y base de datos relacional.',
    description:
      'Aplicación web construida con Spring Boot en el servidor y PostgreSQL como base de datos. Incluye autenticación, roles y un panel para administrar los registros.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'TypeScript'],
    highlights: [
      'Autenticación con roles diferenciados',
      'Modelo de datos normalizado',
      'Despliegue documentado paso a paso',
    ],
    diagram: 'stack',
    featured: true,
    links: { demo: '#', source: '#' },
  },
  {
    id: 'wasijob',
    draft: 'Borrador #03',
    category: 'App',
    title: 'WasiJob',
    summary:
      'App Android para publicar y encontrar chamba y cuartos en alquiler en el Perú, con anuncios geolocalizados y contacto directo por WhatsApp.',
    description:
      'Aplicación Android nativa en Kotlin y Jetpack Compose que conecta a quien busca trabajo o un cuarto con quien lo ofrece. Los anuncios se ubican en un mapa de OpenStreetMap y se filtran por cercanía gracias a PostGIS, y el contacto se hace directo por WhatsApp sin intermediarios. El backend corre sobre Supabase con PostgreSQL, y el acceso se resuelve con inicio de sesión de Google. Está publicada en Google Play.',
    stack: [
      'Kotlin',
      'Jetpack Compose',
      'Material 3',
      'Supabase',
      'PostgreSQL',
      'PostGIS',
      'OpenStreetMap',
    ],
    highlights: [
      'Anuncios geolocalizados en mapa con búsqueda por cercanía (PostGIS)',
      'Dos verticales en una app: chamba y cuartos en alquiler',
      'Contacto directo por WhatsApp, sin intermediarios',
      'Inicio de sesión con Google sobre Supabase Auth',
      'Publicada en Google Play',
    ],
    diagram: 'flow',
    featured: true,
    links: { download: 'https://play.google.com/store/apps/details?id=com.wasijob.app' },
  },
  {
    id: 'proyecto-web-2',
    draft: 'Borrador #04',
    category: 'Web',
    title: 'Sitio web corporativo',
    summary: 'Sitio informativo con identidad visual propia diseñada en Inkscape.',
    description:
      'Sitio web de presentación con diseño e identidad visual propios: logotipo vectorial, paleta de color y tipografías definidas desde cero.',
    stack: ['TypeScript', 'HTML5', 'CSS3', 'Inkscape'],
    highlights: [
      'Logotipo vectorial propio',
      'Adaptado a móvil y escritorio',
      'Optimizado para carga rápida',
    ],
    diagram: 'grid',
    featured: false,
    links: { demo: '#', source: '#' },
  },
]

/* ------------------------------------------------------------ Trayectoria */

export type TimelineEntry = {
  period: string
  kind: 'trabajo' | 'formación' | 'certificación'
  title: string
  org: string
  body: string
  tags: string[]
}

export const timeline: TimelineEntry[] = [
  {
    period: '2022 — Actualidad',
    kind: 'formación',
    title: 'Ingeniería de Sistemas de Información',
    org: 'Décimo ciclo · Ayacucho, Perú',
    body: 'Formación en desarrollo de software, bases de datos y gestión de proyectos. En paralelo llevo lo aprendido a proyectos web y aplicaciones Android nativas.',
    tags: ['Desarrollo de software', 'Bases de datos', 'Scrum'],
  },
]

/** Vacío por ahora: el bloque no se muestra hasta que añadas alguna. */
export const certifications: { title: string; org: string; year: string; id: string }[] = []

/* ------------------------------------------------------------------- FAQ */

export const faqs = [
  {
    q: '¿Qué tecnologías manejas?',
    a: 'En backend trabajo con Java y Spring Boot, y también con Python. Para web uso TypeScript, HTML y CSS. Para móvil, Kotlin con Android Studio. En datos manejo PostgreSQL, MySQL y Supabase.',
  },
  {
    q: '¿Haces aplicaciones para iPhone?',
    a: 'No. Me especializo en Android nativo con Kotlin y Android Studio. Si necesitas iOS puedo ayudarte con la parte web y el backend, pero la app en sí quedaría fuera de lo que hago.',
  },
  {
    q: '¿Trabajas de forma remota?',
    a: 'Sí. Estoy en Ayacucho, Perú, y trabajo en remoto sin problema. Coordino por correo o videollamada y mantengo el avance visible durante todo el proyecto.',
  },
  {
    q: '¿También diseñas el logo?',
    a: 'Sí. Trabajo los logotipos en Inkscape y los entrego en vector (SVG), así que escalan a cualquier tamaño sin perder calidad. Es parte de lo que ofrezco junto al desarrollo.',
  },
  {
    q: '¿Usas inteligencia artificial para programar?',
    a: 'La uso como herramienta para ir más rápido, igual que uso un IDE o la documentación. Pero reviso y entiendo todo lo que entrego: si no soy capaz de explicar una línea de código, no va al proyecto.',
  },
  {
    q: '¿Estás disponible ahora?',
    a: 'Sí, estoy disponible para proyectos y prácticas. Escríbeme por el formulario o directamente a mi correo y te respondo lo antes posible.',
  },
]

/* ------------------------------------------------- Proceso de trabajo */

export const processSteps = [
  { n: '01', title: 'Entender', body: 'Hablamos del problema y de a quién va dirigido, antes de pensar en tecnología.' },
  { n: '02', title: 'Bocetar', body: 'Dibujo la estructura: pantallas, modelo de datos y cómo se conecta todo.' },
  { n: '03', title: 'Construir', body: 'Desarrollo por partes y te muestro avances, para corregir el rumbo a tiempo.' },
  { n: '04', title: 'Entregar', body: 'Despliegue, código en GitHub y lo necesario para que puedas mantenerlo.' },
]
