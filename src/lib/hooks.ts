import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { scrollToSection, sectionForPath, suppressUrlSync, syncUrlToSection } from './routing'

/* --------------------------------------------------------- Entrada en vista */

/** Detecta si un bloque ya entró en viewport (para contadores, anotaciones…). */
export function useEnteredView<T extends Element>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return [ref, inView] as const
}

/* ------------------------------------------------------------------ Tema */

export type Theme = 'light' | 'dark'
const THEME_KEY = 'lk-theme'

/**
 * Lee el tema ya aplicado por el script inline de index.html, de modo que el
 * estado de React arranca sincronizado con el DOM (sin flash ni parpadeo).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* localStorage bloqueado: el tema sólo dura esta sesión */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}

/**
 * Lectura pasiva del tema activo, sin poseer el estado ni escribir en
 * localStorage. Lo usan los componentes que pintan a mano (roughjs,
 * rough-notation) y necesitan redibujarse cuando cambian los colores.
 */
export function useThemeObserver(): Theme {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  )

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light')

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

/* ------------------------------------------------------- Movimiento reducido */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/* ------------------------------------------------------------- Scroll spy */

/**
 * Altura real del header, publicada por él mismo en `--header-h`. Tenerla
 * medida —y no escrita a mano en dos sitios— es lo que mantiene sincronizados
 * el punto donde aterriza el scroll y el punto donde el nav marca la sección.
 */
export function headerHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : 64
}

/**
 * Línea de lectura: la sección activa es la última cuyo borde superior ya la
 * cruzó. Va algo por debajo del header para que una sección cuente como activa
 * en cuanto queda bien encuadrada, no antes.
 */
function readingLine(): number {
  return headerHeight() + 32
}

/** Devuelve el id de la sección visible más cercana al inicio del viewport. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      // Se recalcula en cada scroll: el header cambia de alto al pasar a móvil.
      const line = readingLine()

      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }

      // El último tramo de la página nunca llega a cruzar la línea: al tocar
      // fondo, forzamos la última sección para que el nav no se quede atrás.
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2
      if (atBottom) current = ids[ids.length - 1] ?? current

      setActive(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}

/* --------------------------------------------------------- Rutas de sección */

/**
 * Convierte el scroll de la página única en navegación con rutas limpias:
 * abre en la sección correcta si se entra por `/proyectos`, responde a los
 * botones atrás/adelante y reescribe la URL conforme se hace scroll.
 */
export function useSectionRouting(ids: readonly string[]) {
  const active = useScrollSpy(ids as string[])

  // Enlace profundo: si la URL ya apunta a una sección, saltamos a ella una vez
  // montado el árbol. Sin animación, porque es la posición de partida.
  useEffect(() => {
    const target = sectionForPath(window.location.pathname, ids)
    if (!target) return

    // Al montar, el scroll-spy cree que estamos en la primera sección y querría
    // reescribir la URL a "/". Lo congelamos hasta after del salto, o el enlace
    // profundo se perdería antes de poder usarlo.
    suppressUrlSync(600)

    const raf = requestAnimationFrame(() => scrollToSection(target, false))
    return () => cancelAnimationFrame(raf)
  }, [ids])

  // Atrás / adelante del navegador.
  useEffect(() => {
    const onPopState = () => {
      const target = sectionForPath(window.location.pathname, ids)
      if (target) scrollToSection(target)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [ids])

  // La sección visible manda sobre la URL.
  useEffect(() => {
    if (active) syncUrlToSection(active)
  }, [active])

  return active
}

/* ------------------------------------------------------- Posición de scroll */

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { progress, scrolled }
}

/* --------------------------------------------------------- Bloqueo de scroll */

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

/* ------------------------------------------------------------- Media query */

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
