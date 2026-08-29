/**
 * Identidad, navegación y enlaces.
 * Este archivo es el único sitio donde deberías tocar tus datos personales.
 */

export const profile = {
  name: 'Luis Kinder Flores De La Cruz',
  shortName: 'LuisKinnDC',
  initials: 'L.K.F.D.L.C.',
  role: 'Desarrollador Web & Android Nativo',
  badge: 'Ing. de Sistemas de Información',
  location: 'Ayacucho, Perú',
  available: true,
  availabilityNote: 'Disponible para proyectos y prácticas',
  tagline:
    'Construyo páginas web y aplicaciones Android nativas, del modelo de datos hasta el logo. Estudio Ingeniería de Sistemas de Información y llevo lo que aprendo directo a proyectos que funcionan.',
  email: 'luiskinndc@gmail.com',
  cvUrl: '/cv-luis-kinder.pdf',
  /** Foto en /public. Si queda vacío se dibuja un retrato SVG de reserva. */
  photoUrl: '/foto-perfil.jpg',
  /**
   * Encuadre dentro de los marcos cuadrados. La foto es vertical (900×1598),
   * así que sobran ~698 px de alto que hay que decidir dónde recortar.
   * Un valor más alto sube al sujeto en el marco; más bajo lo baja.
   */
  photoPosition: '50% 55%',
} as const

export const socials = [
  {
    label: 'GitHub',
    handle: 'github.com/LuisKinnDC',
    url: 'https://github.com/LuisKinnDC',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    handle: 'linkedin.com/in/luis-k-flores-de-la-cruz',
    url: 'https://www.linkedin.com/in/luis-k-flores-de-la-cruz/',
    icon: 'linkedin',
  },
  { label: 'Email', handle: profile.email, url: `mailto:${profile.email}`, icon: 'mail' },
] as const

export type NavItem = { id: string; label: string }

/** El orden define tanto el menú como el scroll-spy. */
export const navItems: NavItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'skills', label: 'Skills' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'trayectoria', label: 'Trayectoria' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contacto', label: 'Contacto' },
]
